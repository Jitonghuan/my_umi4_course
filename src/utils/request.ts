import { message } from 'antd';
import { sso } from '@cffe/vc-request';
import { IRequestParams, IResponse } from '@cffe/vc-request/es/service';

// 默认使用组件库对针对后台项目登录模式设计的接口调用方案
const request = (url: string, params?: IRequestParams | undefined) => {
  return new Promise<IResponse>((resolve, reject) => {
    sso
      .request(url, params)
      .then((resp) => {
        if (!resp.success) {
          message.error(resp.errorMsg);
          reject(resp);
          return;
        }

        resolve(resp);
      })
      .catch((e) => {
        message.error(e.errorMsg);
        reject(e);
      });
  });
};
export const getRequest = request;

export const postRequest = (
  url: string,
  params?: IRequestParams | undefined,
) => {
  return new Promise<IResponse>((resolve, reject) => {
    sso
      .post(url, params)
      .then((resp) => {
        if (!resp.success) {
          message.error(resp.errorMsg);
          reject(resp);
          return;
        }

        resolve(resp);
      })
      .catch((e) => {
        message.error(e.errorMsg);
        reject(e.errorMsg);
      });
  });
};

export const queryUserInfo = sso.queryUserInfo;
export const queryUserInfoApi = sso.queryUserInfoApi;
export const doLogout = sso.doLogout;
export const doLogoutApi = sso.doLogoutApi;

export default request;
