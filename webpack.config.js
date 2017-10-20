module.exports = {
    entry: __dirname + '/src/MainGame.ts',

    output: {
        filename: 'spayle.js',
        path: __dirname + '/build'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};