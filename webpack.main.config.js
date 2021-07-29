/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'src', 'library', 'ping.js'), to: path.join(__dirname, '.webpack', 'main')},
        { from: path.join(__dirname, 'src', 'library', 'portScanner.js'), to: path.join(__dirname, '.webpack', 'main')},
      ],
    }),
  ],
};