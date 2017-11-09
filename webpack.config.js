let path = require('path');

module.exports = {
    entry: __dirname + '/src/MainGame.ts',

    output: {
        filename: 'spayle.js',
        path: __dirname + '/build'
    },

    resolve: {
        extensions: ['.js', '.ts', '.d.ts'],
        alias: {
            'pixi': path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            'phaser-ce': path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
            'p2': path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js')
        }
    },

    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader'},
            { test: /pixi/, loader: 'expose-loader?PIXI'},
            { test: /phaser-ce/, loader: 'expose-loader?Phaser'}, //TODO: Still necessary?
            { test: /p2/, loader: 'expose-loader?p2'}
        ]
    }
};
