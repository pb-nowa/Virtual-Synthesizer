import Grain from './grain.js';
import { getBuffer } from './get_buffer';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let playing = false;
const c = new AudioContext();
const master = c.createGain();
const masterbus = c.createGain();
const reverbBus = c.createGain();
let Q = 12;

const delay = new DelayNode(c, {
    delayTime: 0.4,
    maxDelayTime: 0.4,
});

const bandpass = new BiquadFilterNode(c, {
    type: 'bandpass',
    // frequency: 10,
    Q: Q
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

let convolver;

async function setReverb() {
    convolver = c.createConvolver();
    convolver.buffer = await getBuffer(c, '/assets/audio/large_hall.wav');
    reverbBus.connect(convolver).connect(bandpass).connect(master);
}

setReverb();

masterbus.connect(master);
lfo.connect(master.gain);
// lfo.start();
master.connect(analyser);
master.connect(c.destination);



window.onload = () => {
    let buffer, revBuffer, source;

    async function initBuffer() {
        buffer = await getBuffer(c, '/assets/audio/reverie.mp3'); 
        revBuffer = await getBuffer(c, '/assets/audio/reverie.mp3');
        Array.prototype.reverse.call(revBuffer.getChannelData(0));
        Array.prototype.reverse.call(revBuffer.getChannelData(1));
        console.log('loaded');
    }

    initBuffer();
    
    canvas.addEventListener('click', function(){
        if (!playing){
            source = c.createBufferSource();
            source.buffer = buffer;
            source.start(c.currentTime, 6);
            const bus = c.createGain();
            source.connect(bus);
            bus.gain.linearRampToValueAtTime(-20, c.currentTime + 3);
            bus.connect(masterbus);

            console.log('playing');
            source.onended = () => {
                console.log("file has ended");
            };
            playing = true;
        } else {
            source.stop(c.currentTime);
            console.log('stopped');
            playing = false;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        console.log(e.x, e.y);
        if (e.y < 400){
            playGrains();
            window.setTimeout(playGrains, Math.random() * 275);
        } else  {

        }
    });

    const grains = [];
    let grainCount = 0;

    const playGrains = () => {
        const grain = new Grain(c, buffer, reverbBus);
        grains[grainCount] = grain;
        grainCount += 1;
    };

    // canvas.addEventListener('click', function() {
    //         play();
    //         console.log('clicked');
    // });

    const changeVolume = (ele, node) => {
        const volume = ele.value;
        const fraction = parseInt(volume) / 100;
        node.gain.value = fraction * fraction;
    };
};

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

let PERSPECTIVE = width * 0.7;
let PROJECTION_CENTER_X = width / 2;
let PROJECTION_CENTER_Y = height / 2;
const PARTICLE_RADIUS = 1.6;
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

        const rad = Math.pow(dataArray[12] + 75, 3/2); 
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

let density = 1600;

const play = new Image();
play.src = "./assets/images/play_icon_hero.png";
const pause = new Image();
pause.src = "./assets/images/pause.png";

function draw(ctx, img, x, y, w, h){
    if (!img.complete) {
        setTimeout(() => {
            draw(ctx, img);
        }, 500);
        return;
    } else {
        ctx.drawImage(img, x, y, w, h);
    }
}

function render(ctx) {
    ctx.clearRect(0, 0, width, height);

    if (playing) {
        draw(ctx, pause, width / 2 - 37.5, height - 105, 75, 50);
    } else {
        draw(ctx, play, width / 2 - 75, height - 130, 150, 100);
    }
    
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

    window.requestAnimationFrame(() => render(ctx));
}

function init() {
    window.requestAnimationFrame(() => render(ctx));
}

init();
