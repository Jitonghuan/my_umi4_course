// 应用工程配置
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/10 15:41

import { defineConfig } from 'umi';
import routes, { baseRoutePath } from '../src/routes.config';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import path from 'path';

// 资源引用的根路径，此变量与项目在 nginx 中匹配前缀相关，如果
const sourceRoot = '/';

const { VERSION, NODE_ENV, BUILD_ENV } = process.env;

const publicPathPrefix = NODE_ENV === 'development' ? '/' : !VERSION ? `${sourceRoot}` : `${sourceRoot}${VERSION}/`;

// 更多配置查看: https://umijs.org/zh-CN/config
export default defineConfig({
  // -----------------------------------------------------------------
  // ------------------- 可以根据实际情况修改的配置项 -------------------

  // 文件依赖路径别名，默认支持 @/ 指向 src/
  alias: {
    '@/': path.resolve(__dirname, 'src/'),
  },

  // lessLoader: {
  //   modifyVars: { '@primary-color': '#1973CC' },
  //   javascriptEnabled: true,
  //   relativeUrls: true,
  // },

  chainWebpack(memo: any) {
    memo.plugin('monaco-editor').use(MonacoWebpackPlugin, []);
    return memo;
  },
  mfsu: false,
  // 本地开发请求代理规则
  proxy: {
    '/user_backend': {
      target: 'http://60.190.249.92/',
      changeOrigin: true,
    },
    '/v1': {
      target: 'http://matrix-test.cfuture.shop/',
      // target: 'http://matrix.cfuture.shop/',
      // target: 'http://matrix-api-test.cfuture.shop/',
      // target: 'http://10.10.129.38:8081',//青枫本地
      // target: 'http://10.10.129.128:8080/', // 羁绊本地
      // target: 'http://10.10.130.108:8000', // 可乐本地
      // target: 'http://turing.cfuture.shop:8010', // 逍遥本地
      // target: 'https://release.zy91.com:4443/futuredog',
      // target: 'http://10.10.129.165:8080',//木南本地
      // target: 'http://10.10.129.159:8080',//时雨本地
      // target: 'http://10.10.129.24:8080',//习习本地
      // target: 'http://10.10.131.222:8080',//不辣本地
      headers: {
        "Connection": "keep-alive",
      },
      changeOrigin: true,
    },
  },
  plugins: [
    require.resolve("@hbos/umi-plugin-theme-hbos")
  ],


  // 路由配置
  routes: [
    {
      path: baseRoutePath,
      component: '@/layouts/basic-layout/index',
      exact: false,
      routes: [...routes],
    },
    {
      path: `/*`,
      redirect: '/matrix/index',
    },
  ],

  // less 主题变量
  theme: {
    '@primary-color': '#1973CC',
  },

  // ------------------------------------------------------------
  // ------------------- 以下配置项请勿随意修改 -------------------
  // ------------------------------------------------------------

  // 默认是 browser 路由
  history: { type: 'browser' },

  // 文件 hash 后缀 （ hash: true ）
  hash: NODE_ENV === 'development',

  themeHbos: {
    // 项目 bundleName，插件会使用这个 bundleName 来进行样式隔离
    bundleName: 'matrix',
    globalStyle: true,
  },

  // 面向浏览器对象，开发环境默认支持 chrome
  targets: { chrome: 65 },

  publicPath: publicPathPrefix,

  // 配置 external 资源外部依赖, react, react-dom
  externals: NODE_ENV === 'development' ? {} : {
    react: 'React',
    'react-dom': 'ReactDOM',
    ReactDOM: 'ReactDOM',
    reactDom: 'window.ReactDOM'
  },

  // HTML 中以 <script> 方式引用的资源
  headScripts: NODE_ENV === 'development' ? [] : [
    { src: `${publicPathPrefix}react.min.js` },
    { src: `${publicPathPrefix}react-dom.min.js` },
    `window.BUILD_ENV = "${BUILD_ENV}"`
  ],

  extraBabelPlugins: [
    [
      require.resolve('babel-plugin-import'),
      {
        "libraryName": "@cffe/h2o-design",
        "libraryDirectory": "lib/components",
      },
      '@cffe/h2o-design',
    ]
  ]
});
