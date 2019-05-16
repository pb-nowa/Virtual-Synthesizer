
// const c = new AudioContext();

// const osc = c.createOscillator();
// osc.type  = "sine";
// osc.frequency.setValueAtTime(120, c.currentTime);
// osc.detune.setValueAtTime(100, c.currentTime + 1);
// osc.start();
// osc.stop(c.currentTime + 4);
// // osc.onended = () => {
// // };

// const play = (buffer, time) => {
//     const source = c.createBufferSource();
//     source.buffer = buffer;
//     source.connect(c.desination);
    
// };


const oscProp = {
    type: "sine",
    frequency: 440,
    playing: false,
};

const c = new AudioContext();
let osc;
const play = () => {
    if (oscProp.playing) {
        osc.stop();
        oscProp.playing = false;
        console.log("stopped");
    } else {
        osc = c.createOscillator();
        osc.type = oscProp.type;
        osc.frequency.setValueAtTime(oscProp.frequency, c.currentTime);
        osc.connect(c.destination);
        osc.start();
        oscProp.playing = true;
        console.log("playing");
    }
};
