import { defineConfig } from 'umi';
import path from 'path';

import ds from './config/defaultSettings';
import { getRoutes } from './config/routes.base';
import routes from './src/pages/routes.config';
import proxy from './src/pages/proxy';

export default defineConfig({
  /*—————————— 编译性能等配置 start ——————————*/
  nodeModulesTransform: {
    type: 'none',
  },

  plugins: [
    // path.resolve('./script/plugin')
  ],

  // 面向浏览器对象，开发环境默认支持 chrome
  targets:
    process.env.NODE_ENV === 'development'
      ? {
          chrome: 49,
          firefox: false,
          safari: false,
          edge: false,
          ios: false,
        }
      : {
          // umi 默认支持浏览器
          chrome: 49,
          firefox: 64,
          safari: 10,
          edge: 13,
        },

  // 配置 external 资源外部依赖, react, react-dom
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  // 对照 externals ，默认引入 public 中的 react，react-dom 资源【内网，专网部署考虑】
  scripts: [
    { src: `${ds.publicPath}react.min.js` },
    { src: `${ds.publicPath}react-dom.min.js` },
  ],

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
    '@config': path.join(__dirname, './config'),
  },

  // 代理
  proxy,

  // devServer: {
  //   open: true,
  // },

  // 路由
  routes: getRoutes(ds.pagePrefix, routes, ds),

  // 主题
  theme: {
    '@primary-color': ds.primaryColor,
  },

  // 项目配置
  publicPath: ds.publicPath,
  outputPath: `./dist${ds.publicPath}`,
  /*—————————— 项目属性配置 end ——————————*/
});
