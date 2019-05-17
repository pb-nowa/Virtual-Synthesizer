import { impulseResponse } from './impulse.js';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const c = new AudioContext();
const analyzer = c.createAnalyzer();
const master = c.createGain();
const masterbus = c.createGain();
const masterSplit = c.createChannelSplitter(2);
const filterbus = c.createGain();
const convolver = c.createConvolver(); //this uses the whole audio file
const delay = new DelayNode(c, {
    delayTime: 0.4,
    maxDelayTime: 0.4,
});
const hipass = new BiquadFilterNode(c, {
    type: 'highpass',
    frequency: 0,
});
const lopass = new BiquadFilterNode(c, {
    type: 'lowpass',
    frequency: 10000,
});


/////////////////

const reverb = c.createConvolver();

https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
const base64ToArrayBuffer = base64 => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

const reverbSoundArrayBuffer = base64ToArrayBuffer(impulseResponse);
c.decodeAudioData(reverbSoundArrayBuffer, buffer => {
    reverb.buffer = buffer;
}, e => {
    alert('Error when decoding audio data ' + e.err);
});
//////////////

masterbus.connect(hipass);
hipass.connect(lopass);
lopass.connect(master);
master.connect(delay);

delay.connect(analyzer);
master.connect(analyzer);
analyzer.connect(c.destination);
// convolver.connect(c.destination);




window.onload = () => {
    let buffer, source;

    //brahms_3_mvt3
    const request = new XMLHttpRequest();
    request.open('GET', 'assets/audio/reverie.mp3', true);
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
        window.setTimeout(play, Math.random() * 275);
    };

    const grain = document.getElementById("grain");
    grain.addEventListener('click', function() {
            play();
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

    updateHipassFilter = () => {
        const hifilter = document.getElementById("hipass");
        hipass.frequency.setValueAtTime(hifilter.value, c.currentTime);
        console.log(hifilter.value);
        console.log(hipass.frequency.value);
    };

    updateLopassFilter = () => {
        const lowfilter = document.getElementById("lopass");
        lopass.frequency.setValueAtTime(lowfilter.value, c.currentTime);
        console.log(lowfilter.value);
        console.log(lopass.frequency.value);
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
        this.sustain = Math.random() * 0.2;
        this.release = Math.random() * 0.05;
        this.playbackSampleStart = 25; //where in the audio file to start playing

        this.bus = c.createGain();
        this.source.connect(this.bus);
        this.bus.connect(masterbus);
        // this.bus.connect(convolver);
        
        this.play();
    }

    play(){
        this.source.start(c.currentTime, Math.random() * 0.5 + this.playbackSampleStart, this.attack + this.sustain + this.release);
        this.bus.gain.setValueAtTime(0, this.now);
        // value, endtime
        this.bus.gain.linearRampToValueAtTime(50, this.now + this.attack);
        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.01);
    }
}