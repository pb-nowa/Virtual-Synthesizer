import Grain from './grain.js';
import canvas from './canvas';
import aboutPage from './about_page';
import { play, pause, draw } from './images';
import { getBuffer } from './get_buffer';
import Particle from './particle';


window.AudioContext = window.AudioContext || window.webkitAudioContext;


const ctx = canvas.getContext('2d');
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

window.addEventListener('resize', onResize);
onResize();


let playing = false;
let timer = 1;
let timerId;
let source;
let buffer;
let mouse = {
    x: null,
    y: null
};
let isMouseOver = false;
let timeout;

const c = new AudioContext();
const master = c.createGain();
const masterbus = c.createGain();
const reverbBus = c.createGain();
let Q = 1;

const bandpass = new BiquadFilterNode(c, {
    type: 'bandpass',
    frequency: 500,
    Q: Q,
    gain: 200,
});

const notch = new BiquadFilterNode(c, {
    type: 'notch',
    frequency: 1500,
    Q: 100,
});

const analyser = new AnalyserNode(c, {
    fftSize: 2048,
    maxDecibles: -30,
    minDecibels: -100,
    smoothingTimeConstant: 0.97
});


let convolver;

function playGrains() {
    const grain = new Grain(c, buffer, reverbBus, timer);
    timeout = window.setTimeout(playGrains, Math.random() * 275);
}

async function setReverb() {
    convolver = c.createConvolver();
    convolver.buffer = await getBuffer(c, '/assets/audio/large_hall.wav');
    
    reverbBus.connect(convolver)
    .connect(bandpass)
    .connect(notch)
    .connect(master);
    reverbBus.gain.setValueAtTime(2, c.currentTime);
}

setReverb();

masterbus.connect(master);
master.connect(analyser);
analyser.connect(c.destination);

let revBuffer;

async function initBuffer() {
    [buffer, revBuffer] = await Promise.all([
        getBuffer(c, '/assets/audio/reverie.mp3'), 
        getBuffer(c, '/assets/audio/reverie.mp3')]
    );

    // Array.prototype.reverse.call(revBuffer.getChannelData(0));
    // Array.prototype.reverse.call(revBuffer.getChannelData(1));
    Particle.prototype.loaded();
}


initBuffer();



canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function onResize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}

canvas.addEventListener('click', function() {
    const bus = c.createGain();

    if (!playing) {
        source = c.createBufferSource();
        source.buffer = buffer;
        source.start(c.currentTime, timer);
        source.connect(bus);

        bus.gain.linearRampToValueAtTime(1.2, c.currentTime + 3);
        bus.connect(masterbus);

        playing = true;

        timerId = window.setInterval(() => {
            if (!isMouseOver) timer++;
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


let particles = [];
let repulsedParticles = [];
let density = 30;
let inside = false;

const sphereBack = document.getElementById("sphere-background");

sphereBack.addEventListener('mouseenter', e => {
    isMouseOver = true;
    if (playing) {
        playGrains();
        masterbus.gain.linearRampToValueAtTime(0, c.currentTime + 1);
    }
});

sphereBack.addEventListener('mouseleave', e => {
    document.getElementById('header-container').className += " fadeIn";
    isMouseOver = false;
    if (playing) {
        masterbus.gain.linearRampToValueAtTime(1, c.currentTime + 1);
        window.clearTimeout(timeout); 
    }
});

sphereBack.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});



const render = (params) => {
    console.log(Particle.isLoaded());
    const { ctx } = params;

    ctx.clearRect(0, 0, width, height);

    //play and pause button
    if (Particle.isLoaded()) {
        if (playing) {
            draw(ctx, pause, width / 2 - 37.5, height - 105, 75, 50);
        } else {
            draw(ctx, play, width / 2 - 75, height - 130, 150, 100);
        }

        density = 1300;

        if (!particles.length) {
            inside = false;
            particles = [];
            for (let i = particles.length; i < density; i++) {
                particles.push(new Particle({ analyser, ctx }));
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
                        ctx,
                        analyser: analyser,
                        theta: preParticles[i].theta,
                        phi: preParticles[i].phi,
                        z: preParticles[i].z,
                    }));
                    particles.push(new Particle({ ctx, analyser, rad: 0 }));

                } else {
                    particles.push(new Particle({
                        ctx,
                        analyser: analyser,
                        theta: preParticles[i].theta,
                        phi: preParticles[i].phi,
                        z: preParticles[i].z,
                    }));
                }
            }
        }
    } 


    for (let i = 0; i < particles.length; i++) {
        particles[i].project();
    }

    //sort particles by their z index 
    particles.sort((dot1, dot2) => {
        return dot1.sizeProjection - dot2.sizeProjection;
    });

    if (Particle.isLoaded()) {
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
    window.requestAnimationFrame(() => render({ ctx }));
};

const init = (ctx) => {
    window.requestAnimationFrame(() => render({ ctx }));
};



init(ctx);