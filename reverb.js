// Implementation of Manfred Schoeder's Freeverb algorithmic reverb
// inspired by this article https://itnext.io/algorithmic-reverb-and-web-audio-api-e1ccec94621a
// Uses lowpass "comb" filters to simulate delay lines and allpass filters
// to simulate diffusion through the air

// First, define a composite node class to allow for multiple nodes to 
// be bundled together as one
class CompositeAudioNode {
    constructor(ctx, options) {
        this.context = ctx;
        this.input = ctx.createGain();
        this.output = this.context.createGain();
    }

    connect(connection) {
        this.output.connect(connection);
    }

    disconnect() {
        this.output.disconnect.apply(this.output, arguments);
    }
}

// Utility function for controlling multiple audio params as if they were one
// credit to https://gist.github.com/miselaytes-anton/7d795d6efcc7774b136c2b73dc38ed32

export function mergeParams(params) {
    const singleParam = params[0];
    const parameter = {};
    const audioNodeMethods = Object.getOwnPropertyNames(AudioParam.prototype)
        .filter(prop => typeof singleParam[prop] === 'function');

    audioNodeMethods.forEach(method => {
        parameter[method] = (...argums) => {
            const args = Array.prototype.slice.call(argums);
            params.forEach((param) => {
                singleParam[method].apply(param, args);
            });

        };
    });

    Object.defineProperties(parameter, {
        value: {
            get: function () {
                return singleParam.value;
            },
            set: function (value) {
                params.forEach(param => {
                    param.value = value;
                });
            }
        }
    });

    return parameter;
}

class LowPassComb extends CompositeAudioNode {
    constructor(ctx, options) {
        super(ctx, options);
        const { delayTime, resonance: gainValue, dampening: frequency } = options;
        this.lowPass = new BiquadFilterNode(ctx, { type: 'lowpass', frequency, Q: -3.0102999566398125 });
        this.delay = new DelayNode(ctx, { delayTime });
        this.gain = ctx.createGain();
        this.gain.gain.value = gainValue;

        this.input.connect(this.delay)
            .connect(this.lowPass)
            .connect(this.gain)
            .connect(this.input)
            .connect(this.output);
    }

    get resonance() {
        return this.gain.gain;
    }

    get dampening() {
        return this.delay.delayTime;
    }

    get delayTime() {
        return this.delay.delayTime;
    }
}

// https://github.com/Louis-C-Leon/SympleSynth/blob/master/synthesizer/reverb.js
class Reverb extends CompositeAudioNode {
    constructor(ctx, options) {
        super(ctx, options);
        const { roomSize: resonance, dampening, wetGain, dryGain } = options;
        const SAMPLE_RATE = 44100;
        const COMB_FILTER_TUNINGS = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116]
            .map(delayPerSecond => delayPerSecond / SAMPLE_RATE);
        const ALLPASS_FREQUENCIES = [225, 556, 441, 341];

        this.wet = ctx.createGain();
        this.wet.gain.setValueAtTime(wetGain, ctx.currentTime);
        this.dry = ctx.createGain();
        this.dry.gain.setValueAtTime(dryGain, ctx.currentTime);
        this.merger = ctx.createChannelMerger(2);
        this.splitter = ctx.createChannelSplitter(2);

        this.combFilters = COMB_FILTER_TUNINGS
            .map(delayTime => new LowPassComb(ctx, { dampening, resonance, delayTime }));
        const combLeft = this.combFilters.slice(0, 4);
        const combRight = this.combFilters.slice(4);
        this.allPassFilters = ALLPASS_FREQUENCIES
            .map(frequency => new BiquadFilterNode(ctx, { type: 'allpass', frequency }));
        this.input.connect(this.wet).connect(this.splitter);
        this.input.connect(this.dry).connect(this.output);

        combLeft.forEach(comb => {
            this.splitter.connect(comb.input, 0).connect(this.merger, 0, 0);
        });
        combRight.forEach(comb => {
            this.splitter.connect(comb.input, 1).connect(this.merger, 0, 1);
        });

        this.merger.connect(this.allPassFilters[0])
            .connect(this.allPassFilters[1])
            .connect(this.allPassFilters[2])
            .connect(this.allPassFilters[3])
            .connect(this.output);

        this.output.gain.value = 0.3;
    }

    get wetGain() {
        return this.wet.gain;
    }
    get dryGain() {
        return this.dry.gain;
    }
    get roomSize() {
        return mergeParams(this.combFilters.map(comb => comb.resonance));
    }
    get dampening() {
        return mergeParams(this.combFilters.map(comb => comb.dampening));
    }
}

export default Reverb;