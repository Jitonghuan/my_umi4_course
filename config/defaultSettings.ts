/**
 * 工程项目配置文件
 * @description 工程项目配置文件
 * @author yyf
 * @create 2020-12-15 11:13
 */
import { IConfigFromPlugins } from '@@/core/pluginConfig.d';

interface IDefaultSettings extends IConfigFromPlugins {
  /** 主题色 */
  primaryColor?: string;
  /** 接口前缀 */
  apiPrefix: string;
  /** 页面前缀 */
  pagePrefix: string;
  /** 静态资源前缀 */
  publicPath?: string;
  /** 登录页面前缀配置 */
  loginPrefix: string;
}

// 应用关键字
const appKey = 'matrix';

// 抽离配置
const FEConfig: globalConfig = {
  title: 'Matrix',
  favicon: `/${appKey}/favicon.png`,
  logo: `/${appKey}/logo.png`,
  copyright: '2021 来未来',
};

export default {
  ...FEConfig,
  appKey,
  // 项目配置
  primaryColor: '#1973CC',
  loginPrefix: '/user_module',
  apiPrefix: `/v1`,
  pagePrefix: `/${appKey}`,
  // publicPath: `/${appKey}/`,
} as IDefaultSettings;
