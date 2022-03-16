// 应用的运行时配置信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/23 14:58

import logo from '@/assets/imgs/logo.svg';
import favicon from '@/assets/imgs/favicon.png';
import { baseRoutePath } from './routes.config';

/** 是否是本地开发环境 */
const IS_LOCAL = process.env.NODE_ENV === 'development';

// @ts-ignore
const BUILD_ENV = window.BUILD_ENV || 'dev';

let envType = BUILD_ENV === 'prod' ? 'prod' : 'dev';
envType = window.location.href.includes('fygs') ? 'fygs' : envType;
envType = window.location.href.includes('zslnyy') ? 'zslnyy' : envType;
envType = window.location.href.includes('base-poc') ? 'base-poc' : envType;

const domainName: any = {
  'base-poc': 'http://c2f.apex-base-poc.cfuture.shop',
  zslnyy: 'http://c2f.apex-zslnyy.cfuture.shop',
  fygs: 'http://c2f.apex-fygs.seenew.info:180',
  prod: 'http://c2f.apex.cfuture.shop',
  dev: 'http://c2f.apex-dev.cfuture.shop',
};

export default {
  /** 站点图标 */
  favicon,

  /** 页面Logo */
  logo,

  /** 默认标题 */
  title: 'Matrix',

  /** 路由前缀，需在 route.config 中修改 */
  pagePrefix: baseRoutePath,

  /** 接口前缀 */
  apiPrefix: '/v1',

  /** 是否开启菜单权限权限，本地开发时关闭校验 */
  isOpenPermission: !IS_LOCAL,

  /**
   * 导航栏图标库，取自 http://iconfont.cn，可根据实际情况自行替换链接
   * 查看具体示例请看 /demo/icon-list 页面
   */
  menuIconUrl: '//at.alicdn.com/t/font_2040858_koauyaochzp.js',

  isLocal: IS_LOCAL,
  // 当前环境
  BUILD_ENV,
  // apex 地址
  apexDomainName: domainName[envType],
  // webSocket 地址
  wsPrefix: window.location.href.includes('fygs')
    ? 'ws://matrix-fygs.seenew.info:180'
    : window.location.href.includes('zslnyy')
    ? 'ws://matrix-zslnyy.cfuture.shop'
    : window.location.href.includes('base-poc')
    ? 'ws://matrix-base-poc.cfuture.shop'
    : 'ws://matrix-api.cfuture.shop',
};
