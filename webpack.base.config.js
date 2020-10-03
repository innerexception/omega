const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
        { test: /\.tsx?$/, include: path.join(__dirname, './'), loader: 'ts-loader' },
        {
            test: /\.css$/,
            use: [{
                    loader: "style-loader"
                },
                {
                    loader: "css-loader"
                }
            ]
        },
        {
            test: /sw.(j|t)s$/,
            use: [{
                loader: 'file-loader',
            }]
        },
        {
            test: /\.(png|svg|jpg|gif|mp3)$/,
            use: [{
                loader: 'file-loader',
                options: {
                  outputPath: './',
                },
              }]
        },
        { test: /\.(eot|ttf|svg)$/, use: ['url-loader?limit=1000000'] },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ gameName: '', template: 'index.html' })
  ]
}