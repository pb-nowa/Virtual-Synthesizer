const path = require('path');

module.exports = {
    entry: './virtual_synth.js',
    output: {
        publicPath: '/',
        filename: 'bundle.js',
        path: path.resolve(__dirname)
    }
};