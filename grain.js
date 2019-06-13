class Grain {
    constructor(c, buffer, reverbBus, startTime) {
        this.context = c;
        this.now = this.context.currentTime;
        this.source = this.context.createBufferSource();
        this.source.buffer = buffer;
        this.attack = Math.random() * 0.3;
        this.sustain = Math.random() * 0.2;
        this.release = Math.random() * 0.05;
        this.playbackSampleStart = startTime; 

        this.bus = this.context.createGain();
        // this.source.connect(this.bus);
        this.source.connect(reverbBus);
        this.bus.connect(this.context.destination);

        this.playGrain();
    }

    playGrain() {
        this.source.start(this.now, Math.random() * 0.5 + this.playbackSampleStart + 3, this.attack + this.sustain + this.release);
        this.bus.gain.setValueAtTime(0, this.now);
        
        this.bus.gain.linearRampToValueAtTime(100, this.now + this.attack);
        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.0025);
    }
}

export default Grain;