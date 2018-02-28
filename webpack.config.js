const path = require('path');

module.exports = {
  entry: './src/scripts/main.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use:  {
          loader: 'file-loader',
          options: {
            name: "[name].[hash:20].[ext]",
            outputPath: 'assets/images/'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.png']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
