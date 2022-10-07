const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      app: './src/index.js',
    },
    output: {
      path: path.join(__dirname, '/dist/build'),
      filename: 'index.bundle.js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
          },
        }),
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ]
  };
};
