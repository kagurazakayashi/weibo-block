const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const uglifyJSPlugin = new UglifyJSPlugin();
module.exports = {
    optimization:{
        minimize: true
    },
    entry: './src/weiboblock.ts',
    // devtool: 'inline-source-map',
    output: {
        filename: 'weiboblock.js',
        path: path.resolve(__dirname, 'dist'),
        environment: {
            arrowFunction: false
        }
    },
    target: ['web', 'es5'],
    module: {
        rules: [{
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: ['.ts'],
    },
    // plugins: [
    //   uglifyJSPlugin,
    // ],
};
