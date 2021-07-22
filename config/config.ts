// umi config
// @see https://umijs.org/zh-CN/config

import { defineConfig } from 'umi';
import path from 'path';

import ds from './defaultSettings';
import routes from '../src/pages/routes.config';

const publicPathPrefix = {
  dev: '',
  test: 'https://come2future-web.oss-cn-hangzhou.aliyuncs.com/dev/fe-matrix-front/matrix-front',
  prod: 'https://come2future-web.oss-cn-hangzhou.aliyuncs.com/prod/fe-matrix-front/matrix-front',
}[process.env.BUILD_ENV || 'dev'];

export default defineConfig({
  /*—————————— 编译性能等配置 start ——————————*/
  nodeModulesTransform: {
    type: 'none',
  },

  plugins: [
    // path.resolve('./script/plugin')
  ],

  themeHbos: {
    bundleName: ds.appKey, // 项目 bundleName，插件会使用这个 bundleName 来进行样式隔离
  },

  // 面向浏览器对象，开发环境默认支持 chrome
  targets:
    process.env.NODE_ENV === 'development'
      ? { chrome: 49, firefox: false, safari: false, edge: false, ios: false }
      : { chrome: 49, firefox: 64, safari: 10, edge: 13 },

  publicPath: `${publicPathPrefix}/${ds.appKey}/`,

  // 配置 external 资源外部依赖, react, react-dom
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },

  // HTML 中以 <script> 方式引用的资源
  scripts: [
    { src: `${publicPathPrefix}/${ds.appKey}/react.min.js` },
    { src: `${publicPathPrefix}/${ds.appKey}/react-dom.min.js` },
  ],

  // dynamicImport: {},

  // split chunk TODO
  /*—————————— 编译性能和工程配置 end ——————————*/

  /*—————————— 项目属性配置 start ——————————*/
  // 文件 hash 后缀
  hash: true,

  // 路由类型，browser hash
  history: { type: 'browser' },

  // 全局变量
  define: {
    NODE_ENV: process.env.NODE_ENV,
  },

  alias: {
    '@config': path.join(__dirname, '../config'),
  },

  // 代理
  proxy: {
    '/user_backend': {
      target: 'http://60.190.249.92/',
      changeOrigin: true,
    },
    '/v1': {
      // target: 'http://matrix-test.cfuture.shop/',
      // target: 'http://matrix-api-test.cfuture.shop/',
      // target: 'http://10.10.129.247:8080/',
      // target: 'http://10.10.129.177:8080/',
      // target: 'http://10.10.129.128:8080',
      // target: 'http://10.10.128.182:8081/', // 羁绊本地
      // target: 'http://10.10.130.108:8000', // 可乐本地
      // target: 'http://turing.cfuture.shop:8010', // 逍遥本地
      target: 'https://release.zy91.com:4443/futuredog',
      changeOrigin: true,
    },
  },

  devServer: {
    port: 9091,
  },

  // 路由
  routes: [
    {
      path: `/${ds.appKey}`,
      component: '../layouts/basic-layout/index',
      menuRoot: true,
      routes: [...routes],
    },
    {
      path: '/',
      redirect: `/${ds.appKey}/index`,
    },
  ],

  // 主题
  theme: {
    '@primary-color': ds.primaryColor,
  },

  // 项目配置
  outputPath: `./dist/${ds.appKey}/`,
  /*—————————— 项目属性配置 end ——————————*/
});
