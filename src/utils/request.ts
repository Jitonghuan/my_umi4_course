import { message } from 'antd';
import { sso } from '@cffe/vc-request';
import { IRequestParams, IResponse } from '@cffe/vc-request/es/service';

const parseErrorMsg = (errorMsg: any) => {
  if (typeof errorMsg === 'string') {
    return errorMsg;
  }
  if (Array.isArray(errorMsg)) {
    return errorMsg
      .map((n) => {
        return typeof n === 'string'
          ? n
          : n?.msg || n.message || 'unknown error';
      })
      .join('; ');
  }
  return errorMsg?.msg || errorMsg?.message || 'unknown error';
};

// 默认使用组件库对针对后台项目登录模式设计的接口调用方案
const request = (url: string, params?: IRequestParams | undefined) => {
  return new Promise<IResponse>((resolve, reject) => {
    sso
      .request(url, params)
      .then((resp) => {
        if (!resp.success) {
          message.error(parseErrorMsg(resp.errorMsg));
          reject(resp);
          return;
        }

        resolve(resp);
      })
      .catch((resp) => {
        if (![3002, 3001].includes(resp.code)) {
          message.error(parseErrorMsg(resp.errorMsg));
        }
        reject(resp);
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
        // 非登录失效报错
        if (!resp.success) {
          message.error(parseErrorMsg(resp.errorMsg));
          reject(resp);
          return;
        }

        resolve(resp);
      })
      .catch((resp) => {
        if (![3002, 3001].includes(resp.code)) {
          message.error(parseErrorMsg(resp.errorMsg));
        }
        reject(resp.errorMsg);
      });
  });
};

export const queryUserInfo = sso.queryUserInfo;
export const queryUserInfoApi = sso.queryUserInfoApi;
export const doLogout = sso.doLogout;
export const doLogoutApi = sso.doLogoutApi;

export default request;
