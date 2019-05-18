import Grain from './grain.js';
// import Particle from './particle.js';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

export const c = new AudioContext();
export const master = c.createGain();
export const masterbus = c.createGain();

export const delay = new DelayNode(c, {
    delayTime: 0.4,
    maxDelayTime: 0.4,
});

export const hipass = new BiquadFilterNode(c, {
    type: 'highpass',
    frequency: 0,
});

export const lopass = new BiquadFilterNode(c, {
    type: 'lowpass',
    frequency: 10000,
});

export const reverb = c.createConvolver();
let source, hallBuffer;

const request = new XMLHttpRequest();
request.open('GET', 'assets/audio/large_hall.wav', true);
request.responseType = "arraybuffer";
request.onload = function () {
    c.decodeAudioData(request.response, function (buffer) {
        hallBuffer = buffer;
        source = c.createBufferSource();
        source.buffer = hallBuffer;
        console.log('reverb loaded');
    }, function (e) {
        console.log('loading failed' + e.err);
    });
};
request.send();

reverb.buffer = hallBuffer;

masterbus.connect(reverb);
masterbus.connect(c.destination);
reverb.connect(master);

// master.connect(c.destination);
master.connect(c.destination);
// delay.connect(c.destination);

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
            source.connect(c.destination);
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
/////////////////////////////////////////////////////////
const canvas = document.getElementById("sphere");


let width = canvas.offsetWidth;
let height = canvas.offsetHeight;


const ctx = canvas.getContext('2d');

//https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas
// If the screen device has a pixel ratio over 1
// We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)
if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
} else {
    canvas.width = width;
    canvas.height = height;
}

let PERSPECTIVE = width * 0.3;
let PROJECTION_CENTER_X = width / 2;
let PROJECTION_CENTER_Y = height / 2;
const PARTICLE_RADIUS = 4;
let GLOBE_RADIUS = width / 3;
const particles = [];
class Particle {
    constructor() {
        this.theta = Math.random() * 2 * Math.PI;
        //multiply MathRandom by acos so that the partcles don't clump near the poles
        this.phi = Math.acos((Math.random() * 2) - 1);

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.xProjected = 0; // x coordinate on the 2D world
        this.yProjected = 0; // y coordinate on the 2D world
        this.scaleProjected = 0;
    }

    //transforms the 3d coordinates into 2d coordinates
    project() {
        this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = GLOBE_RADIUS * Math.cos(this.phi);
        this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;

        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
    }

    draw() {
        this.project();
        //opacity based on distance
        ctx.globalAlpha = Math.abs(1 - this.z / width);

        ctx.beginPath();
        //x, y ,r, angle-start, angle-end
        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);
        const r = 70;
        const g = 255;
        const b = 140;

        const rgbString = "rgba(" + r + "," + g + "," + b + ")";
        ctx.fillStyle = 'rgb(0, 212, 212)';
        ctx.fill();
    }

}

function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < 1500; i++) {
        particles.push(new Particle());
    }

    for (let i = 0; i < particles.length; i++){
        particles[i].project();
    }
    //sort particles by their z index 
    particles.sort((dot1, dot2) => {
        return dot1.sizeProjection - dot2.sizeProjection;
    });

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
    window.requestAnimationFrame(render);

}
    // window.setInterval(render(), 80);

function init() {
    window.requestAnimationFrame(render);
}
init();
