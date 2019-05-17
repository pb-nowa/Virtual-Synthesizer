export const reverb = c.createConvolver();
let source, hallBuffer;

const request = new XMLHttpRequest();
request.open('GET', 'assets/audio/hall.wav', true);
request.responseType = "arraybuffer";
request.onload = function () {
    c.decodeAudioData(request.response, function (buffer) {
        hallBuffer = buffer; 
        source = c.createBufferSource();
        source.buffer = hallBuffer;
        console.log('reverb loaded');
    }, function (e) {
        console.log('loading failed' + e.err);
    });
};
request.send();

reverb.buffer = hallBuffer;
