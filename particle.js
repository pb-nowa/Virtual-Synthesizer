class Particle {
    constructor(analyser) {
        this.analyser = analyser;
        let bufferLength = this.analyser.frequencyBinCount;

        var timeFrequencyData = new Uint8Array(this.analyser.fftSize);
        var timeFloatData = new Float32Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(timeFrequencyData);
        this.analyser.getFloatTimeDomainData(timeFloatData);

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

        const r = 70;
        const g = 255;
        const b = 140;
        const rgbString = "rgba(" + r + "," + g + "," + b + ")";
        
        ctx.beginPath();
        //x, y ,r, angle-start, angle-end
        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = 'rgb(0, 212, 212)';
        ctx.fill();
    }

}

export default Particle;