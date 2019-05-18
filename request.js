export const request = (context, filepath, response) => {

    const request = new XMLHttpRequest();
    let audioBuffer, source;

    request.open('GET', filepath, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            audioBuffer = buffer;
            source = context.createBufferSource();
            source.buffer = audioBuffer;
            console.log(response);
            return source;
        }, function (e) {
            console.log('loading failed' + e.err);
        });
    };
    
    request.send();

};