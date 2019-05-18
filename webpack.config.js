const path = require('path');

module.exports = {
    entry: './virtual_synth.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname)
    }
};