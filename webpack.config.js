const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './client/index.js',

    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    plugins: [
        //new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/)
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/en$/)
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            }
        ]
    }
};


//
// module.exports = {
//     entry: './client/index.js',
//
//     output: {
//         path: __dirname + '/public',
//         filename: 'bundle.js'
//     },
//
//     module: {
//         loaders: [
//             {
//                 test: /\.js$/,
//                 loader: 'babel-loader',
//                 exclude: /node_modules/,
//                 query: {
//                     cacheDirectory: true,
//                     presets: ['es2015', 'react']
//                 }
//             },
//             {
//                 test: /\.css$/,
//                 use: ['style-loader', 'css-loader']
//             },
//             {
//                 test: /\.(png|woff|woff2|eot|ttf|svg)$/,
//                 loader: 'url-loader?limit=100000'
//             },
//             {
//                 test: /\.scss$/,
//                 loader: 'style-loader!css-loader!sass-loader'
//             }
//         ]
//     },
//
//     plugins: [
//         new UglifyJSPlugin()
//     ]
// };
