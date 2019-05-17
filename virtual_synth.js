
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const c = new AudioContext();
const master = c.createGain();
master.connect(c.destination);

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
        }, function () {
            console.log('loading failed');
        });
    };
    request.send();



    
    // const audioElement = new Audio('assets/audio/brahms_3_mvt3.mp3');

    // const track = c.createMediaElementSource(audioElement);
    // track.connect(master);
    
    const playButton = document.getElementById("play");
    playButton.addEventListener('click', function() {
            // scheduled start, audio start time, sample length
            source = c.createBufferSource();
            source.buffer = buffer;
            source.connect(master);
            source.start(c.currentTime, 20, 6);
            source.onended = () => {
                console.log("file has ended");
            };
            console.log('playing');
    });

    const grain = document.getElementById("grain");
    grain.addEventListener('click', function() {
            // scheduled start, audio start time, sample length
            const grain = new Grain(buffer);
            console.log(grain);
            grain.source.start(c.currentTime, 20, 6);
            grain.source.onended = () => {
                console.log("file has ended");
            };
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

    changeType = () => {
        oscProp.type = document.querySelector("input[name = 'waveform']:checked").value;
        play();
        play();
    };
};

class Grain {
    constructor(buffer){
        this.now = c.currentTime;
        this.source = c.createBufferSource();
        this.source.buffer = buffer;
        this.attack = 2;
        this.release = 2;

        this.bus = c.createGain();
        this.bus.connect(master);
        this.source.connect(this.bus);


        this.bus.gain.setValueAtTime(0, this.now);

        // value, endtime
        this.bus.gain.linearRampToValueAtTime(50, this.now + 2);
        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.release);

    }
}


