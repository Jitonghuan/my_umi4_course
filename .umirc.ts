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
    // 'link-color': '#1973CC', // 链接颜色
    // 'menu-item-height': '36px',
    // 'success-color': '#439D75', // 成功色
    // 'warning-color': '#D16F0D', // 警告色
    // 'error-color': '#CC4631', // 错误色
    // 'layout-body-background': '#D2D8E6', // 布局背景色
    // 'layout-header-background': '#0B4485',
    // 'layout-header-color': '#fff',
    // 'layout-header-height': '40px', // 布局头部高度
    // 'layout-header-padding': '0 20px', // 头部padding
    // 'menu-item-boundary-margin': '0px', // menu-item 边界margin
    // 'menu-item-vertical-margin': '0px', // menu-item 上下margin
    // 'menu-bg': 'transparent', // menu背景色
    // 'menu-item-color': '#000', // 文字颜色
    // 'menu-item-active-bg': '#D6E9FF', //  选中背景色
    // 'drawer-body-padding': '20px', // drawer padding
    // 'drawer-header-padding': '8px 20px', // drawer 头部padding
    // 'drawer-footer-padding-horizontal': '12px 20px', // drawer footer padding
    // 'drawer-header-close-size': '39px',
    // 'drawer-bg': '#F3F5FB',
    // 'table-header-bg': '#F3F5FB',
    // 'table-border-color': '#D2D8E6',
    // 'table-header-color': '#5F677A',
    // 'table-padding-vertical': '8px',
    // 'table-padding-horizontal': '8px',
  },

  // 项目配置
  publicPath: ds.publicPath,
  outputPath: `./dist${ds.publicPath}`,
  /*—————————— 项目属性配置 end ——————————*/
});
