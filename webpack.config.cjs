// webpack.config.cjs
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',  
  target: 'node',
  output: {
    filename: 'index.cjs',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.mjs'],
  },
};
