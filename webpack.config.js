const { resolve } = require('path');
const glob = require('glob');
const colors = require('colors');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const PurifyCssPlugin = require('purifycss-webpack');

const config = {};

config.entry = {
    app: './src/index.js'
};

config.output = {
    path: resolve(__dirname, './build'),
    filename: 'index.[hash].js'
};

config.pluginsDevelopment = [
    new HtmlWebpackPlugin({
        // template: 'src/index.html',
        // filename: 'index.html',
        // inject: 'body',
        // inject: false,
        // hash: true,
        // minify: {
        //     removeAttributeQuotes: true,
        //     collapseWithespace: true,
        //     minifyJS: true,
        //     minifyCSS: true,
        //     minifyURLs: true
        // }
    }),
    new PurifyCssPlugin({
        paths: glob.sync(resolve(__dirname, 'src/*.html'))
    }),
    new MiniCssExtractPlugin({
        filename: 'main.[contenthash].css'
    })
];

config.pluginsProduction = [
    new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body',
        //inject: false,
        //hash: true,
        minify: {
            removeAttributeQuotes: true,
            collapseWithespace: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardCOmments: { removeAll: true } },
        canPrint: true
    }),
    new PurifyCssPlugin({
        paths: glob.sync(resolve(__dirname, 'src/*.html'))
    }),
    new OptimizeJsPlugin({
        sourceMap: false
    }),
    new MiniCssExtractPlugin({
        filename: 'main.[contenthash].css'
    }),
    new WebpackMd5Hash()
]

config.module = {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                },
                'postcss-loader'
            ]
        },
        {
            test: /\.(jpe?g|png|gif|svg|pdf)$/,
            exclude: /node_modules/,
            loader: 'file-lodaer?name=image/[name].[ext]'
        }
    ]
}

config.optimization =  {
    splitChunks: {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'common',
                chunks: 'all'
            }
        }
    },
    minimizer: [
        new OptimizeCssAssetsPlugin(),
        new TerserPlugin({
            terserOptions: {
                ecma: undefined,
                warnings: false,
                parse: {},
                compress: {},
                mangle: true,
                module: false,
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: true
            }
        })
    ]
}


module.exports = env => {
    const environment = env || 'production';

    console.log(
        (`You are in _`.black + environment.red.bold + `_ environment`.black)
          .bgWhite
      );

    if(environment === 'production') {

        return {
            mode: environment,
            entry: config.entry,
            output: config.output,
            optimization: config.optimization,
            watch: false,
            module: config.module,
            plugins: config.pluginsProduction
        }
    }

    if(environment === 'development') {
        return {
            mode: environment,
            entry: config.entry,
            output: config.output,
            //optimization: config.optimization,
            watch: true,
            module: config.module,
            plugins: config.pluginsDevelopment
        }
    }
}




/* pkg.json

npm install --save-dev purifycss-webpack purify-css @babel/core @babel/preset-env babel-loader babel-preset-env colors css-loader file-loader html-webpack-plugin mini-css-extract-plugin node-loader node-sass optimize-css-assets-webpack-plugin optimize-js-plugin postcss-loader sass-loader style-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server webpack-md5-hash autoprefixer autoprefixer-cli


  "scripts": {
    "start": "webpack-dev-server --hot --env development",
    "build": "webpack --env production"
  },


*/

/* .babelrc

{
    "presets": [
        ["@babel/preset-env", {
            "targets": {
                "browsers": ["last 2 versions", "safari >= 7"]
            }
        }]
    ]
}

*/

/* postcss.config.js

    module.exports = {
        plugins: [require("autoprefixer"), require("cssnano")]
    };

*/