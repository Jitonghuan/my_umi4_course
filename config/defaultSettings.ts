/**
 * 项目配置文件
 */

const appKey = 'matrix';

export default {
  appKey,
  primaryColor: '#1973CC',
  apiPrefix: `/v1`,
  pagePrefix: `/${appKey}`,
  isOpenPermission: true,
  // isOpenPermission: process.env.NODE_ENV !== 'development',
};
