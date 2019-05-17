const path = require('path');

module.exports = {
    entry: './audio_context.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname)
    }
};