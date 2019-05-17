window.AudioContext = window.AudioContext || window.webkitAudioContext;

const c = new AudioContext();
const master = c.createGain();
const convolver = c.createConvolver(); //this uses the whole audio file
const delay = new DelayNode(c, {
    delayTime: 0.2,
    maxDelayTime: 2,
});

/////////////////

const reverb = c.createConvolver();

// https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
// const base64ToArrayBuffer = base64 => {
//     const binaryString = window.atob(base64);
//     const length = binaryString.length;
//     const bytes = new Uint8Array(length);
//     for (var i = 0; i < length; i++) {
//         bytes[i] = binaryString.charCodeAt(i);
//     }
//     return bytes.buffer;
// };

// const reverbSoundArrayBuffer = base64ToArrayBuffer(impulseResponse);
// c.decodeAudioData(reverbSoundArrayBuffer, buffer => {
//     reverb.buffer = buffer;
// }, e => {
//     alert('Error when decoding audio data ' + e.err);
// });
//////////////
master.connect(c.destination);
// convolver.connect(c.destination);
delay.connect(c.destination);


window.onload = () => {
    let buffer, source;

    const request = new XMLHttpRequest();
    request.open('GET', 'assets/audio/brahms_3_mvt3.mp3', true);
    request.responseType = "arraybuffer";
    request.onload = function () {
        c.decodeAudioData(request.response, function(b) {
            buffer = b; //set the buffer

            data = buffer.getChannelData(0);
            isloaded = true;
            console.log('loaded');
            const hall = buffer;
            convolver.buffer = hall; //apply a buffer to the convolution verb

        }, function () {
            console.log('loading failed');
        });
    };
    request.send();



    
    const playButton = document.getElementById("play");
    playButton.addEventListener('click', function(){
            // scheduled start, audio start time, sample length
            source = c.createBufferSource();
            source.buffer = buffer;
            source.connect(master);
            source.start(c.currentTime, 6);
            source.onended = () => {
                console.log("file has ended");
            };
            console.log('playing');
    });

    const grains = [];
    let grainCount = 0;

    const play = () => {
        const grain = new Grain(buffer);
        grains[grainCount] = grain;
        grainCount += 1;
        window.setTimeout(play, Math.random() * 500);
    };

    const grain = document.getElementById("grain");
    grain.addEventListener('click', function() {
            // scheduled start, audio start time, sample length
            play();
            

            
            // grain.source.onended = () => {
            //     console.log("file has ended");
            // };
            console.log('playing');
    });

    changeGain = () => {
        const masterGain = document.getElementById("master-gain");
        changeVolume(masterGain, master);
    };

    const changeVolume = (ele, node) => {
        const volume = ele.value;
        const fraction = parseInt(volume) / 100;
        node.gain.value = fraction * fraction;
    };

    changeFreq = () => {
        //the range of the range-input is from 0 - 100
        oscProp.frequency = document.getElementById("freqslider").value * Math.exp(2);
        play();
        play();
    };
};

class Grain {
    constructor(buffer){
        this.now = c.currentTime;
        this.source = c.createBufferSource();
        this.source.buffer = buffer;
        this.attack = Math.random() * 0.3;
        this.release = Math.random() * 0.3;

        this.bus = c.createGain();
        this.bus.connect(master);
        this.bus.connect(convolver);
        this.source.connect(this.bus);
        
        this.source.start(c.currentTime, Math.random() * 3 + 20, this.attack + this.release);
        this.bus.gain.setValueAtTime(0, this.now);
        // value, endtime
        this.bus.gain.linearRampToValueAtTime(50, this.now + this.attack);
        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.release);

    }
}