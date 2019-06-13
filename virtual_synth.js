import Grain from './grain.js';
import { getBuffer } from './get_buffer';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let playing = false;
let loaded = false;
let timer = 1;
let timerId;
let source;
let buffer;
let mouse = {
    x: null,
    y: null
};
let inside = false;
let isMouseOver = false;
let timeout;

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
}

setReverb();

masterbus.connect(master);
lfo.connect(master.gain);
// lfo.start();
master.connect(analyser);
analyser.connect(c.destination);

window.onload = () => {
    let revBuffer;

    async function initBuffer() {
        buffer = await getBuffer(c, '/assets/audio/reverie.mp3'); 
        revBuffer = await getBuffer(c, '/assets/audio/reverie.mp3');
        Array.prototype.reverse.call(revBuffer.getChannelData(0));
        Array.prototype.reverse.call(revBuffer.getChannelData(1));
        loaded = true;
    }

    initBuffer();
    
    canvas.addEventListener('click', function(){
        const bus = c.createGain();
        if (!playing){
            source = c.createBufferSource();
            source.buffer = buffer;
            source.start(c.currentTime, timer);
            source.connect(bus);
            bus.gain.linearRampToValueAtTime(1.2, c.currentTime + 3);
            bus.connect(masterbus);
            playing = true;
            timerId = window.setInterval(() => {
                timer++;
            }, 1000);
            document.getElementById('header-container').className = "header-container fade-out";
        } else {
            bus.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
            source.stop(c.currentTime + 0.5);
            playing = false;
            window.clearInterval(timerId);
            document.getElementById('header-container').className = "header-container fadeIn";
        }
    });

    function setStart(){
        const bus = c.createGain();
        source = c.createBufferSource();
        source.buffer = buffer;
        source.start(c.currentTime, timer);
        source.connect(bus);
        bus.gain.linearRampToValueAtTime(1.2, c.currentTime + 1);
        bus.connect(masterbus);
        playing = true;
        timerId = window.setInterval(() => {
            timer++;
        }, 1000);
    }

    function playGrains() {
        const grain = new Grain(c, revBuffer, reverbBus, timer);
    }

 
    canvas.addEventListener('mousemove', (e) => {
        const radius = 200;
        mouse.x = e.x;
        mouse.y = e.y;
    });

    const aboutPage = document.getElementById("about-page");
    aboutPage.addEventListener('click', e => {
        aboutPage.className = "about-page fade-out";
        aboutPage.childNodes.forEach(node => {
            node.className += " fade-out";
        });
        document.getElementById('header-container').className += " fadeIn";
    });

};

const canvas = document.getElementById("sphere");
const sphereBack = document.getElementById("sphere-background");

sphereBack.addEventListener('mouseenter', e => {
    isMouseOver = true;
    playGrains();
    masterbus.gain.linearRampToValueAtTime(0, c.currentTime + 1);
});

sphereBack.addEventListener('mouseleave', e => {
    document.getElementById('header-container').className += " fadeIn";
    isMouseOver = false;
    masterbus.gain.linearRampToValueAtTime(1, c.currentTime + 1);
    window.clearTimeout(timeout);
});

let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

const ctx = canvas.getContext('2d');

function playGrains() {
    const grain = new Grain(c, buffer, reverbBus, timer);
    timeout = window.setTimeout(playGrains, Math.random() * 275);
}

let isGranulating = false;
// function granulate(){
//     if (loaded && inside && !isGranulating){          
//         isGranulating = true;
//         playGrains();
//         window.setTimeout(playGrains, Math.random() * 275);
//         masterbus.gain.linearRampToValueAtTime(0, c.currentTime + 1);
//     } else if (!inside){
//         isGranulating = false;
//         masterbus.gain.linearRampToValueAtTime(1.5, c.currentTime + 0.5);
//     } 
// }

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
let repulsedParticles = [];

class Particle {
    constructor({analyser, theta, phi, x, y, z, rad, timer}) {
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
        this.timer = timer || 0;

    }

    project() {
        const dataArray = new Float32Array(this.analyser.frequencyBinCount);        
        this.analyser.getFloatFrequencyData(dataArray);

        this.rad = this.rad || (Math.pow(dataArray[12] + 75, 3/2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65)); 
        rad = this.rad || (Math.pow(dataArray[12] + 75, 3 / 2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65));
        GLOBE_RADIUS = this.rad;
        this.rad = (rad < 150 && rad !== 2) ? 150 : this.rad;
        
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
        if (loaded){
            this.rotate();
        } else {
            this.phi = this.z < 0 ? this.phi + 1.01 * Math.sqrt(this.phi * 0.0002) : this.phi - 1.01 * Math.sqrt(this.phi * 0.0002);
        }
        this.project();
        //opacity based on distance
        ctx.globalAlpha = Math.abs(1 - this.z / width);

        ctx.beginPath();
        //x, y ,r, angle-start, angle-end
        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);

        ctx.fillStyle = 'rgb(0, 212, 212)';
        ctx.fill();
    }

    rotate() {
        this.theta = this.z < 0 ? this.theta + 0.03 : this.theta - 0.03;
        this.phi = this.z < 0 ? this.phi + 1.01 * Math.sqrt(this.phi * 0.0002) : this.phi - 1.01 * Math.sqrt(this.phi * 0.0002) ;
    }

    deflect() {
        // this.phi = this.phi + 0.5;
        this.theta = this.theta + 0.04;
        this.rad = this.rad + 8;
        this.project();

        ctx.globalAlpha = Math.abs(1 - this.z / width);

        ctx.beginPath();
        //x, y ,r, angle-start, angle-end
        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);

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
let replenish = [];

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
            inside = false;
            particles = [];
            for (let i = particles.length; i < density; i++) {
                particles.push(new Particle({ analyser }));
            }
        } else {
            const preParticles = Array.from(particles);
            particles = [];
            for (let i = 0; i < preParticles.length; i++) {
                if (mouse.x - preParticles[i].xProjected < 10 &&
                    mouse.x - preParticles[i].xProjected > -10 &&
                    mouse.y - preParticles[i].yProjected < 10 &&
                    mouse.y - preParticles[i].yProjected > -10) {
                    inside = true;
                   
                    repulsedParticles.push(new Particle({
                        analyser: analyser,
                        theta: preParticles[i].theta,
                        phi: preParticles[i].phi,
                        x: preParticles[i].x,
                        y: preParticles[i].y,
                        z: preParticles[i].z,
                    }));
                    particles.push(new Particle({ analyser, rad: preParticles[i].rad }));
                
                } else {
                    const rad = inside ? preParticles[i].rad : 0; 
                    particles.push(new Particle({
                        analyser: analyser, 
                        theta: preParticles[i].theta,
                        phi: preParticles[i].phi,
                        x: preParticles[i].x, 
                        y: preParticles[i].y, 
                        z: preParticles[i].z,
                        rad
                    }));
                }
            }  
        }
    } else {
    // load screen
        // if (!loadParticles[0].particles.length) {
        //     for (let j = 0; j  < loadParticles.length; j++) {
        //         for (let i = 0; i < density; i++) {
        //             loadParticles[j].particles.push(new Particle({ analyser, rad: loadParticles[j].saveRad }));
        //         } 
        //     }
        // } else {
        //     for (let j = 0; j < loadParticles.length; j++) {
        //         const preParticles = Array.from(loadParticles[j].particles);
        //         loadParticles[j].particles = [];
        //         const zoomSpeed = 25;
        //         loadParticles[j].saveRad = (loadParticles[j].saveRad <= 0) ? loadRad : loadParticles[j].saveRad - zoomSpeed;
                
        //         for (let i = 0; i < density; i++) {
        //             loadParticles[j].particles.push(new Particle({
        //                 analyser: analyser, 
        //                 rad: loadParticles[j].saveRad,
        //                 theta: preParticles[i].theta,
        //                 phi: preParticles[i].phi,
        //                 x: preParticles[i].x, 
        //                 y: preParticles[i].y, 
        //                 z: preParticles[i].z
        //             }));
        //         } 
        //     } 
        // }
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

        for (let i = 0; i < repulsedParticles.length; i++) {
            repulsedParticles[i].timer++;
            repulsedParticles[i].deflect();
        }
    }

    //garbage collect particles at 200 frames;
    repulsedParticles = repulsedParticles.filter(particle => particle.timer < 200);

    // granulate();
    window.requestAnimationFrame(() => render(ctx));
}

function init() {
    window.requestAnimationFrame(() => render(ctx));
}

init();
