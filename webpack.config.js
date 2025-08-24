const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Entry points matching your Vite config
const entryPoints = {
    'blocks': './src/Blocks/index.js',
    'admin': './src/AdminUI/index.js',
    'analytics': './src/Analytics/index.js',
    'frontend': './src/Frontend/index.js'
};

module.exports = {
    mode: 'production',
    entry: entryPoints,
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/[name].build.js',
        clean: false
    },
    optimization: {
        splitChunks: false, // Completely disable code splitting
        runtimeChunk: false,
    },
    externals: {
        // 🚨 Only externalize React/ReactDOM to stay compatible with WP’s React
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions']
                                }
                            }],
                            ['@babel/preset-react', {
                                throwIfNamespace: false
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: `@import "${path.resolve(__dirname, 'src/Shared/styles/variables.scss')}";`
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@shared': path.resolve(__dirname, 'src/Shared'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@components': path.resolve(__dirname, 'src/components')
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].build.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'static',
                    to: '.',
                    noErrorOnMissing: true
                }
            ]
        })
    ]
};
