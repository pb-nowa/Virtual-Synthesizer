window.AudioContext = window.AudioContext || window.webkitAudioContext;

export const c = new AudioContext();
export const master = c.createGain();
export const masterbus = c.createGain();

export const delay = new DelayNode(c, {
    delayTime: 0.4,
    maxDelayTime: 0.4,
});

export const hipass = new BiquadFilterNode(c, {
    type: 'highpass',
    frequency: 0,
});

export const lopass = new BiquadFilterNode(c, {
    type: 'lowpass',
    frequency: 10000,
});



masterbus.connect(master);
master.connect(delay);
// master.connect(reverb);

master.connect(c.destination);
// reverb.connect(c.destination);
delay.connect(c.destination);

