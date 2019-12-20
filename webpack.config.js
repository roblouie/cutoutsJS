const path = require('path');

module.exports = {
  entry: ['./src/scripts/main.ts', './src/index.html', './src/main.css'],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(html|css)/,
        loader: 'file-loader?name=[name].[ext]'
      },
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
      },
      {
        test: /\.wav$/,
        use:  {
          loader: 'file-loader',
          options: {
            name: "[name].[hash:20].[ext]",
            outputPath: 'assets/audio/'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.png', '.wav']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
