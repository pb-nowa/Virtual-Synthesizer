import Grain from './grain.js';
import { getBuffer } from './get_buffer';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let playing = false;
let loaded = false;
let timer = 1;
let timerId;

const c = new AudioContext();
const master = c.createGain();
const masterbus = c.createGain();
const reverbBus = c.createGain();
let rad = 2;
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
    console.log('reverb loaded');
}

setReverb();

masterbus.connect(master);
lfo.connect(master.gain);
// lfo.start();
master.connect(analyser);
master.connect(c.destination);

//https://stackoverflow.com/questions/5276953/what-is-the-most-efficient-way-to-reverse-an-array-in-javascript
function xorSwapHalf(array) {
    var i = null;
    var r = null;
    var length = array.length;
    for (i = 0; i < length / 2; i += 1) {
        r = length - 1 - i;
        var left = array[i];
        var right = array[r];
        left ^= right;
        right ^= left;
        left ^= right;
        array[i] = left;
        array[r] = right;
    }
    return array;
}

window.onload = () => {
    let buffer, revBuffer, source;

    async function initBuffer() {
        buffer = await getBuffer(c, '/assets/audio/reverie.mp3'); 
        revBuffer = await getBuffer(c, '/assets/audio/reverie.mp3');
        // Array.prototype.reverse.call(revBuffer.getChannelData(0));
        // Array.prototype.reverse.call(revBuffer.getChannelData(1));
        // xor swap algorithm used for reversing the array for efficiency while rendering Canvas load screen
        xorSwapHalf(revBuffer.getChannelData(0));
        xorSwapHalf(revBuffer.getChannelData(1));

        loaded = true;
    }

    initBuffer();
    
    canvas.addEventListener('click', function(){
        if (!playing){
            source = c.createBufferSource();
            source.buffer = buffer;
            source.start(c.currentTime, timer);
            const bus = c.createGain();
            source.connect(bus);
            console.log(timer);
            bus.gain.linearRampToValueAtTime(timer, c.currentTime + 3);
            bus.connect(masterbus);

            console.log('playing');
            source.onended = () => {
                console.log("file has ended");
            };
            playing = true;
            timerId = window.setInterval(() => {
                timer++;
            }, 1000);
        } else {
            source.stop(c.currentTime);
            console.log('stopped');
            playing = false;
            window.clearInterval(timerId);
        }
    });

    const grains = [];
    let grainCount = 0;

    function playGrains() {
        const grain = new Grain(c, buffer, reverbBus);
        grains[grainCount] = grain;
        grainCount += 1;
    }

 
    canvas.addEventListener('mousemove', (e) => {
        const radius = 200;
        if (loaded && 
            playing &&
            e.y < (height / 2) + radius - 30 &&
            e.y > (height / 2) - radius + 30 &&
            e.x < (width / 2) + radius - 30 &&
            e.x > (width / 2) - radius + 30
            ){           
            playGrains();
            window.setTimeout(playGrains, Math.random() * 275);
            masterbus.gain.linearRampToValueAtTime(0, c.currentTime + 1);
        } else {
            masterbus.gain.linearRampToValueAtTime(3, c.currentTime + 0.5);
        }
    });

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


let PERSPECTIVE = width * 0.8;
let PROJECTION_CENTER_X = width / 2;
let PROJECTION_CENTER_Y = height / 2;
const PARTICLE_RADIUS = 1.6;
// let GLOBE_RADIUS = width / 3;
let GLOBE_RADIUS = 40;
let particles = [];

class Particle {
    constructor({analyser, theta, phi, x, y, z, rad}) {
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
        this.rad = rad || 0; 

    }

    project() {
        const dataArray = new Float32Array(this.analyser.frequencyBinCount);        
        this.analyser.getFloatFrequencyData(dataArray);

        this.rad = this.rad || (Math.pow(dataArray[12] + 75, 3/2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 3/2)); 
        rad = this.rad || (Math.pow(dataArray[12] + 75, 3 / 2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 3 / 2));
        GLOBE_RADIUS = this.rad;
        
        // Projection translation from 2d to 3d from:
        // https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas
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

let density = 30;

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

let loadParticles = [ 
    { idx: 1, saveRad: 1200, particles: [] },
    { idx: 2, saveRad: 900, particles: [] },
    { idx: 3, saveRad: 600, particles: [] },
    { idx: 4, saveRad: 300, particles: [] }
];

let loadIdx = 0;
let saveRad = 1200;

function render(ctx) {
    ctx.clearRect(0, 0, width, height);

    let loadRad = 1200;
    //play and pause button
    if (loaded) {
        if (playing) {
            draw(ctx, pause, width / 2 - 37.5, height - 105, 75, 50);
        } else {
            draw(ctx, play, width / 2 - 75, height - 130, 150, 100);
        }
    }
    
    if (loaded){
        density = 1300;
        if (!particles.length) {
            for (let i = 0; i < density; i++) {
                particles.push(new Particle({ analyser, rad: 2}));
            }
        } else {
            const preParticles = Array.from(particles);
            particles = [];
            for (let i = 0; i < density; i++) {
                particles.push(new Particle({
                    analyser: analyser, 
                    theta: preParticles[i].theta,
                    phi: preParticles[i].phi,
                    x: preParticles[i].x, 
                    y: preParticles[i].y, 
                    z: preParticles[i].z
                }));
            }  
        }
    } else {
    // load screen
        if (!loadParticles[0].particles.length) {
            for (let j = 0; j  < loadParticles.length; j++) {
                for (let i = 0; i < density; i++) {
                    loadParticles[j].particles.push(new Particle({ analyser, rad: loadParticles[j].saveRad }));
                } 
            }
        } else {
            for (let j = 0; j < loadParticles.length; j++) {
                const preParticles = Array.from(loadParticles[j].particles);
                loadParticles[j].particles = [];
                const zoomSpeed = 25;
                loadParticles[j].saveRad = (loadParticles[j].saveRad <= 0) ? loadRad : loadParticles[j].saveRad - zoomSpeed;
                
                for (let i = 0; i < density; i++) {
                    loadParticles[j].particles.push(new Particle({
                        analyser: analyser, 
                        rad: loadParticles[j].saveRad,
                        theta: preParticles[i].theta,
                        phi: preParticles[i].phi,
                        x: preParticles[i].x, 
                        y: preParticles[i].y, 
                        z: preParticles[i].z
                    }));
                } 
            } 
        }
    }
    for (let i = 0; i < particles.length; i++){
        particles[i].project();
    }

    //sort particles by their z index 
    particles.sort((dot1, dot2) => {
        return dot1.sizeProjection - dot2.sizeProjection;
    });

    if (!loaded) {
        for (let j = 0; j < loadParticles.length; j++) {
            for (let i = 0; i < loadParticles[j].particles.length; i++){
                loadParticles[j].particles[i].draw();
            }
        }
    } else {
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
        }
    }

    window.requestAnimationFrame(() => render(ctx));
}

function init() {
    window.requestAnimationFrame(() => render(ctx));
}

init();
