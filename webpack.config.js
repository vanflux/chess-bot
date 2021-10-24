const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  entry: {
    content: './src/content/index.tsx',
    background: './src/background/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: (styleTag) => {
                wrappedJSObject.document.onreadystatechange = exportFunction((readyState) => {
                  if (wrappedJSObject.document.readyState === 'complete') {
                    wrappedJSObject.document.head.appendChild(styleTag);
                  }
                }, wrappedJSObject);
              },
            },
          },
          {
            loader: 'css-loader',
          },
        ]
      },
      {
        test: /\.ts|tsx$/,
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
    extensions: [".ts", ".tsx", ".js", ".jsx"]
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