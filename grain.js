import { c, masterbus } from './virtual_synth.js';

class Grain {
    constructor(buffer) {
        this.now = c.currentTime;
        this.source = c.createBufferSource();
        this.source.buffer = buffer;
        this.attack = Math.random() * 0.3;
        this.sustain = Math.random() * 0.2;
        this.release = Math.random() * 0.05;
        this.playbackSampleStart = 25; //where in the audio file to start playing

        this.bus = c.createGain();
        this.source.connect(this.bus);
        this.bus.connect(masterbus);
        // this.bus.connect(convolver);

        this.playGrain();
    }

    playGrain() {
        this.source.start(c.currentTime, Math.random() * 0.5 + this.playbackSampleStart, this.attack + this.sustain + this.release);
        this.bus.gain.setValueAtTime(0, this.now);
        // value, endtime
        this.bus.gain.linearRampToValueAtTime(50, this.now + this.attack);
        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.01);
    }
}

export default Grain;