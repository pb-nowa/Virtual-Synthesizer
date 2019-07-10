import { width, height } from './canvas';

const PERSPECTIVE = width * 0.8;
const PROJECTION_CENTER_X = width / 2;
const PROJECTION_CENTER_Y = height / 2;
const PARTICLE_RADIUS = 1.6;
let rad = 2;
let r = 0;
let g = 212;
let b = 212;
let color = [r, g, b];

class Particle {
    static isLoaded() {
        return Particle.prototype._loaded;
    }

    constructor({ analyser, theta, phi, z, rad, timer, ctx }) {
        this.analyser = analyser;
        this.ctx = ctx;
        this.theta = theta || Math.random() * 2 * Math.PI;
        this.phi = phi || Math.acos((Math.random() * 2) - 1);

        this.scaleProjected = z || 0;
        this.rad = rad || 0;
        this.timer = timer || 0;
    }

    project() {
        const dataArray = new Float32Array(this.analyser.frequencyBinCount);
        this.analyser.getFloatFrequencyData(dataArray);

        this.rad = this.rad || (Math.pow(dataArray[12] + 75, 3 / 2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65));
        rad = this.rad || (Math.pow(dataArray[12] + 75, 3 / 2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65));
        this.rad = (rad < 150 && rad !== 2) ? 150 : this.rad;

        // Projection translation from 2d to 3d from:
        // https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas
        this.x = this.rad * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = this.rad * Math.cos(this.phi);
        this.z = this.rad * Math.sin(this.phi) * Math.sin(this.theta) + this.rad;

        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
    }

    draw() {
        if (Particle.isLoaded()) {
            this.rotate();
        } else {
            this.phi = this.z < 0 ? this.phi + 1.01 * Math.sqrt(this.phi * 0.0002) : this.phi - 1.01 * Math.sqrt(this.phi * 0.0002);
        }
        this.project();
        //opacity based on distance
        this.ctx.globalAlpha = Math.abs(1 - this.z / width);

        this.ctx.beginPath();
        //x, y ,r, angle-start, angle-end
        this.ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);

        this.ctx.fillStyle = `rgb(${color})`;
        this.ctx.fill();
    }

    rotate() {
        this.theta = this.z < 0 ? this.theta + 0.03 : this.theta - 0.03;
        this.phi = this.z < 0 ? this.phi + 1.01 * Math.sqrt(this.phi * 0.0002) : this.phi - 1.01 * Math.sqrt(this.phi * 0.0002);
    }

    deflect() {
        this.theta = this.theta + 0.04;
        this.rad = this.rad + 8;
        this.project();

        this.ctx.globalAlpha = Math.abs(1 - this.z / width);

        this.ctx.beginPath();
        //x, y ,r, angle-start, angle-end
        this.ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);

        this.ctx.fillStyle = `rgb(${color})`;
        this.ctx.fill();
    }
}

Particle.prototype._loaded = false;
Particle.prototype.loaded = () => {
    Particle.prototype._loaded = true;
};

export default Particle;