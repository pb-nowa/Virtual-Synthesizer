import { c, masterbus } from './audio_context';
import Grain from './grain.js';

window.onload = () => {
    let buffer, source, data;

    //brahms_3_mvt3
    //import audio file
    const request = new XMLHttpRequest();
    request.open('GET', 'assets/audio/reverie.mp3', true);
    request.responseType = "arraybuffer";
    request.onload = function () {
        c.decodeAudioData(request.response, function(b) {
            buffer = b; 
            data = buffer.getChannelData(0);
            console.log('loaded');

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
            source.connect(masterbus);
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

    const changeVolume = (ele, node) => {
        const volume = ele.value;
        const fraction = parseInt(volume) / 100;
        node.gain.value = fraction * fraction;
    };

    const changeGain = () => {
        const masterGain = document.getElementById("master-gain");
        changeVolume(masterGain, master);
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

