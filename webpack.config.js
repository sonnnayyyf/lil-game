const path = require('path');

module.exports = {
    mode: 'development', // Set the mode to 'development' or 'production' as needed
    entry: './public/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        port: 9000,
        open: true
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": false,
            "os": false
        }
    }
};
