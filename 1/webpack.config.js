const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');//추가

module.exports = {
  mode: 'development',
  entry: {
    app: '파일경로',
    jun: '파일경로',
  },
  output: {
    path: '/dist',
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env', {
                targets: { node: 'current' }, // 노드일 경우만
                modules: 'false'
              }
            ],
            '@babel/preset-react',
            '@babel/preset-stage-0'
          ],
        },
        exclude: ['/node_modules'],
      },{//여기서 부터 css,html 및 기타 파일 번들링
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
      },{
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
        name: '[hash].[ext]',
        limit: 10000,
      },
    }],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // 아래 EnvironmentPlugin처럼 할 수도 있다.
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']), // 요즘은 위의 DefinePlugin보다 이렇게 하는 추세이다.
    //추가
    new ExtractTextPlugin({
      filename: 'app.css',
    }),
  ],
  optimization: {
    minimize: true/false,
    splitChunks: {},
    concatenateModules: true,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
};
