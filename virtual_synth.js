import Grain from './grain.js';
// import Reverb from './reverb.js';
import { getBuffer } from './impulse';
// import { request } from './request.js';
// import Particle from './particle.js';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const c = new AudioContext();
const master = c.createGain();
const masterbus = c.createGain();

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

let lfo = new OscillatorNode(c, {
    type: 'sine',
    frequency: 1.5,
});

const analyser = new AnalyserNode(c, {
    fftSize: 2048,
    maxDecibles: -30,
    minDecibels: -100,
    smoothingTimeConstant: 0.97
});

// const reverb = new Reverb(c, { 
//     roomSize: 0.9, 
//     dampening: 3000, 
//     wetGain: 0.8, 
//     dryGain: 0.2 
// });
let convolver;

async function setReverb() {
    convolver = c.createConvolver();
    convolver.buffer = await getBuffer(c, '/assets/audio/large_hall.wav');
    masterbus.connect(convolver).connect(c.destination);
}

setReverb();

masterbus.connect(master);
// masterbus.connect(reverb);
// reverb.connect(master);

lfo.connect(master.gain);
// lfo.start();
master.connect(analyser);
// analyser.connect(c.destination);



window.onload = () => {
    let buffer, source;

    async function initBuffer() {
        buffer = await getBuffer(c, '/assets/audio/reverie.mp3'); 
        console.log('loaded');
    }

    initBuffer();
    
    const playButton = document.getElementById("play");
    playButton.addEventListener('click', function(){
            // scheduled start, audio start time, sample length
            source = c.createBufferSource();
            source.buffer = buffer;
            source.connect(masterbus);
            source.start(c.currentTime, 30);
            source.onended = () => {
                console.log("file has ended");
            };
            console.log('playing');
    });

    const grains = [];
    let grainCount = 0;

    const play = () => {
        const grain = new Grain(c, buffer, masterbus);
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

function onResize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
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
}

window.addEventListener('resize', onResize);
onResize();

let PERSPECTIVE = width * 0.3;
let PROJECTION_CENTER_X = width / 2;
let PROJECTION_CENTER_Y = height / 2;
const PARTICLE_RADIUS = 4;
// let GLOBE_RADIUS = width / 3;
let GLOBE_RADIUS = 40;
let particles = [];
class Particle {
    constructor(analyser, theta, phi, x, y, z) {
        this.analyser = analyser;

        this.theta = theta || Math.random() * 2 * Math.PI;
        //multiply MathRandom by acos so that the partcles don't clump near the poles
        this.phi = phi || Math.acos((Math.random() * 2) - 1);

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

        this.xProjected = x || 0; 
        this.yProjected = y || 0;
        this.scaleProjected = z || 0;
    }

    // Projection translation from 2d to 3d from:
    // https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas
    project() {
        const timeFrequencyData = new Uint8Array(this.analyser.fftSize);
        const timeFloatData = new Float32Array(this.analyser.fftSize);
        const dataArray = new Float32Array(this.analyser.frequencyBinCount);

        this.analyser.getByteTimeDomainData(timeFrequencyData);
        this.analyser.getFloatTimeDomainData(timeFloatData);
        this.analyser.getFloatFrequencyData(dataArray);

        const rad = Math.pow(dataArray[0] + 100, 3/2); 
        GLOBE_RADIUS = rad < 0 ? 40 : rad;
        
       
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

let density = 800;
function render() {
    ctx.clearRect(0, 0, width, height);
    if (!particles.length) {
        for (let i = 0; i < density; i++) {
            particles.push(new Particle(analyser));
        }
    } else {
        const preParticles = Array.from(particles);
        particles = [];
        for (let i = 0; i < density; i++) {
            particles.push(new Particle(
                analyser, 
                preParticles[i].theta,
                preParticles[i].phi,
                preParticles[i].x, 
                preParticles[i].y, 
                preParticles[i].z)
            );
        }  
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

function init() {
    window.requestAnimationFrame(render);
}

init();
