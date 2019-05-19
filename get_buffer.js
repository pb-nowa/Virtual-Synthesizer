export const getBuffer = (ctx, impulseURL) => {
    return fetch(impulseURL)
    .then( res => res.arrayBuffer())
    .then( arrayBuffer => ctx.decodeAudioData(arrayBuffer)
    );
};