class Grain {
    constructor(c, buffer, reverbBus, startTime) {
        this.context = c;
        this.now = this.context.currentTime;
        this.source = this.context.createBufferSource();
        this.source.buffer = buffer;
        this.attack = Math.random() * 0.3;
        this.sustain = Math.random() * 0.2;
        this.release = Math.random() * 0.05;
        this.playbackSampleStart = startTime; //where in the audio file to start playing

        this.bus = this.context.createGain();
        // this.source.connect(this.bus);
        this.source.connect(reverbBus);
        this.bus.gain.setValueAtTime(1, this.now);
        this.bus.connect(this.context.destination);

        // this.bus.connect(convolver);

        this.playGrain();
    }

    playGrain() {
        this.source.start(this.now, Math.random() * 0.5 + this.playbackSampleStart, this.attack + this.sustain + this.release);
        this.bus.gain.setValueAtTime(0, this.now);
        // value, endtime
        this.bus.gain.linearRampToValueAtTime(4, this.now + this.attack);
        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.01);
    }
}

export default Grain;