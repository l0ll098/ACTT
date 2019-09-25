'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    mode: 'none',
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        libraryTarget: 'this',
        path: path.join(__dirname, 'lib')
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: [nodeExternals()]
};
