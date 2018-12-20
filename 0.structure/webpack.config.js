const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');//추가

module.exports = {
  // 개발, 배포용 구분(development, production)
  mode: 'development',
  
  // 파일을 읽어들이기 시작
  entry: {
    app: '파일경로',
    jun: '파일경로',
  },

  // 파일 결과물 설정
  output: {
    path: '/dist',  // output으로 나올 경로
    filename: '[name].js', // app.js / vendor.js         filename:'[name].[chunkhash].js'
    publicPath: '/',  // 파일들이 위치할 서버상의 경로
  },

  // 모든 파일을 모듈로 이해
  // 자바스크립트 외의 파일형식을 webpack이 이해하도록 변경(loader)
  module: {
    rules: [
      {
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
      },
      {//여기서 부터 css,html 및 기타 파일 번들링
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', // 이 플러그인 실패시 대신 작동할 플러그인
          use: 'css-loader' // css-loader를 거친 후 extract-text-webpack-plugin으로 파일을 추출(use)
        }),
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        // limit(byte)보다 작은 파일들은 base64인코딩해서 인라인화
        options: {
        name: '[hash].[ext]', // [name].[ext]
        limit: 10000,
        }
      }
    ],
  },

  // 압축, 핫 리로딩등 효과적 번들링
  plugins: [
    new webpack.LoaderOptionsPlugin({ // 로더들에게 옵션을 넣어준다
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
    new ManifestPlugin({ //ouput의 path경로에 assets.json이 생긴다(app.청크해시값.js)
      fileName: 'assets.json',
      basePath: '/'
    })
  ],

  // 최적화 관련 플러그인
  optimization: {
    minimize: true/false,
    // 청크간 겹치는 패키지들을 별도의 파일로 추출
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    },
    concatenateModules: true,
  },

  //웹팩이 알아서 경로나 확장자를 설정
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
};
