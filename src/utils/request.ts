import { sso } from '@cffe/vc-request';

// 默认使用组件库对针对后台项目登录模式设计的接口调用方案
const request = sso.request;
export const getRequest = sso.get;
export const postRequest = sso.post;

export const queryUserInfo = sso.queryUserInfo;
export const queryUserInfoApi = sso.queryUserInfoApi;
export const doLogout = sso.doLogout;
export const doLogoutApi = sso.doLogoutApi;

export default request;
