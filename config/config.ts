import { defineConfig } from 'umi';
import path from 'path';

import ds from './defaultSettings';
import routes from '../src/pages/routes.config';

export default defineConfig({
  /*—————————— 编译性能等配置 start ——————————*/
  nodeModulesTransform: {
    type: 'none',
  },

  plugins: [
    // path.resolve('./script/plugin')
  ],

  themeHbos: {
    bundleName: 'matrix', // 项目 bundleName，插件会使用这个 bundleName 来进行样式隔离
  },

  // 面向浏览器对象，开发环境默认支持 chrome
  targets:
    process.env.NODE_ENV === 'development'
      ? { chrome: 49, firefox: false, safari: false, edge: false, ios: false }
      : { chrome: 49, firefox: 64, safari: 10, edge: 13 },

  // 配置 external 资源外部依赖, react, react-dom
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  // 对照 externals ，默认引入 public 中的 react，react-dom 资源【内网，专网部署考虑】
  // scripts: [
  //   { src: `/${ds.appKey}/react.min.js` },
  //   { src: `/${ds.appKey}/react-dom.min.js` },
  // ],

  // 按需加载，当前配置，默认所有页面按需加载
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
      target: 'http://matrix-api-test.cfuture.shop/',
      // target: 'http://10.10.129.247:8080/',
      // target: 'http://10.10.129.177:8080/',
      // target: 'http://10.10.129.128:8080',
      // target: 'http://10.10.128.182:8081/', // 羁绊本地
      // target: 'http://10.10.130.108:8000', // 可乐本地
      // target: 'http://turing.cfuture.shop:8010', // 逍遥本地
      changeOrigin: true,
    },
  },

  // devServer: {
  //   open: true,
  // },

  // 路由
  routes: [
    {
      path: `${ds.loginPrefix}/login`,
      component: '../layouts/login',
    },
    {
      path: ds.pagePrefix,
      component: '../layouts/basic-layout/index',
      menuRoot: true,
      routes: [...routes],
    },
    {
      path: '/',
      redirect: `${ds.pagePrefix}/index`,
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
