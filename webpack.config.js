const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  entry: {
    content: './src/content/app.ts',
    background: './src/background/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    extensions: ['.ts'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        "manifest.json",
        { from: "icons", to: "icons" },
      ],
    }),
  ],
};