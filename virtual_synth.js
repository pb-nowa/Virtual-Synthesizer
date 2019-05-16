
window.AudioContext = window.AudioContext || window.webkitAudioContext;


window.onload = () => {
    const c = new AudioContext();
    
    const oscProp = {
        type: "sine",
        frequency: 440,
    };

    var audioNodeOptions = {
        "length": 10,
        "numberOfChannels": 2,
        "sampleRate": 44100,
    };
    let osc;
    let isPlaying = false;


    const master = c.createGain();
    master.connect(c.destination);
    const request = new XMLHttpRequest();
    request.open('GET', 'assets/audio/brahms_3_mvt3.mp3', true);
    request.responseType = "arraybuffer";
    request.onload = function () {
        c.decodeAudioData(request.response, function(b) {
            buffer = b; //set the buffer
            data = buffer.getChannelData(0);
            console.log(buffer);
            isloaded = true;
            // var canvas1 = document.getElementById('canvas');
            //initialize the processing draw when the buffer is ready
            // var processing = new Processing(canvas1, waveformdisplay);
            console.log(data);

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
        if (c.state === 'suspended') {
            c.resume();
        } 
        if (this.dataset.playing === 'false'){
            buffer.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            buffer.pause();
            this.dataset.playing = 'false';
        }
    }, false);
    // playButton.addEventListener('click', function() {
    //     if (c.state === 'suspended') {
    //         c.resume();
    //     } 
    //     if (this.dataset.playing === 'false'){
    //         audioElement.play();
    //         this.dataset.playing = 'true';
    //     } else if (this.dataset.playing === 'true') {
    //         audioElement.pause();
    //         this.dataset.playing = 'false';
    //     }
    // }, false);

    changeGain = () => {
        //create gain node
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
// const play = (source) => {
//     if (oscProp.playing) {
//         osc.stop();
//         oscProp.playing = false;
//         console.log("stopped");
//     } else {
//         osc = c.createOscillator();
//         osc.type = oscProp.type;
//         osc.frequency.setValueAtTime(oscProp.frequency, c.currentTime);
//         osc.connect(master);
//         osc.start();
//         oscProp.playing = true;
//         console.log("playing");
//     }
// };




