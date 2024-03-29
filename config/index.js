// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/', // webpack编译输出的发布路径
    staticPath:'./static/',          //请根据自己路径配置更改
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report //npm run build --report`
  },
  dev: {
    env: require('./dev.env'), // 'development'
    port: 8016,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
  	proxyTable : {
        // 在 build/dev-server.js 中设置了
        // '/api': {
        //     target: 'http://localhost:9090/',//代理地址
        //     changeOrigin: true,//是否允许开启代理
        //     pathRewrite: {//代理地址重写
        //         '^/api': '' // 将前缀 '/api' 转为 '/'
        //     }
        // }
    },
    context: [ //代理路径e
        '/api'
    ],
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
