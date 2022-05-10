// 应用的运行时配置信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/23 14:58

import logo from '@/assets/imgs/logo.svg';
import favicon from '@/assets/imgs/favicon.png';
import { baseRoutePath } from './routes.config';
import { domainName, wsPrefixName, LogoName, waterMarkName } from './envType.config';

/** 是否是本地开发环境 */
const IS_LOCAL = process.env.NODE_ENV === 'development';

// @ts-ignore
const BUILD_ENV = window.BUILD_ENV || 'dev';
console.log(' BUILD_ENV ', BUILD_ENV);

//判断是否为司内Matrix环境
let href = window.location.href;
function getPrivateMethods(type: boolean) {
  if (type) {
    if (href.includes('matrix-local') || href.includes('matrix-test') || href.includes('matrix.cfuture')) {
      return 'public';
    } else {
      return 'private';
    }
  } else {
    if (
      href.includes('matrix-local') ||
      href.includes('matrix-test') ||
      href.includes('matrix.cfuture') ||
      href.includes('matrix-base-poc')
    ) {
      return 'public';
    } else {
      return 'private';
    }
  }
}

const PRIVATE_METHODS = getPrivateMethods(false);
const IS_Matrix = getPrivateMethods(true);

let envType = BUILD_ENV === 'prod' ? 'prod' : 'dev';
envType = window.location.href.includes('matrix-bf-daily') ? 'bf-daily' : envType;
envType = window.location.href.includes('matrix-fygs') ? 'fygs' : envType;
envType = window.location.href.includes('matrix-zslnyy') ? 'zslnyy' : envType;
envType = window.location.href.includes('matrix-base-poc') ? 'base-poc' : envType;
envType = window.location.href.includes('matrix-zsdata') ? 'zsdata' : envType;
envType = window.location.href.includes('matrix.gushangke') ? 'gushangke' : envType;

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
  wsPrefix: wsPrefixName[envType],
  // logo 名字
  logoName: LogoName[envType] || '',
  // 水印
  waterMarkName: waterMarkName[envType] || '',
  //是否为司内Matrix环境
  PRIVATE_METHODS: PRIVATE_METHODS,
  IS_Matrix: IS_Matrix,
};
