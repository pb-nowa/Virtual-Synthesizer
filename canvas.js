const canvas = document.getElementById("sphere");

let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

const ctx = canvas.getContext('2d');

function onResize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
}
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

window.addEventListender('resize', onResize);

onResize();

let PERSPECTIVE = width * 0.8;
let PROJECTION_CENTER_X = width / 2;
let PROJECTION_CENTER_Y = height / 2;
const particles = [];

class Particle {
    constructor() {
        this.x = (Math.random() - 0.5) * width; // Give a random x position
        this.y = (Math.random() - 0.5) * height; // Give a random y position
        this.z = Math.random() * width; // Give a random z position
        this.radius = 10; // Size of our element in the 3D world

        this.xProjected = 0; // x coordinate on the 2D world
        this.yProjected = 0; // y coordinate on the 2D world
        this.scaleProjected = 0;
    }

    //transforms the 3d coordinates into 2d coordinates
    project() {
        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
    }

    draw() {
        this.project();
        //opacity based on distance
        ctx.globalAlpha = Math.abs(1 - this.z / width);
        ctx.fillRect(this.xProjected - this.radius,
            this.yProjected - this.radius,
            this.radius * 2 * this.scaleProjected,
            this.radius * 2 * this.scaleProjected
        );
    }
}

for (let i = 0; i < 800; i++) {
    particles.push(new Particle());
}

function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}

window.requestAnimationFrame(render);