import { message } from 'antd';
import { request } from '@cffe/layout';
import type { RequestOptionsInit } from '@cffe/vc-request/es/base-request/type';

// const parseErrorMsg = (errorMsg: any) => {
//   if (typeof errorMsg === 'string') {
//     return errorMsg;
//   }
//   if (Array.isArray(errorMsg)) {
//     return errorMsg
//       .map((n) => {
//         return typeof n === 'string' ? n : n?.msg || n.message || 'unknown error';
//       })
//       .join('; ');
//   }
//   return errorMsg?.msg || errorMsg?.message || 'unknown error';
// };

// async function requestHandler(promise: Promise<IResponse<any>>, reserveError = false) {
//   return promise
//     .then((resp) => {
//       // 非登录失效报错
//       if (!resp.success) {
//         // message.error(parseErrorMsg(resp.errorMsg));
//         throw resp;
//       }

//       return resp;
//     })
//     .catch((resp) => {
//       if (![3002, 3001].includes(resp.code)) {
//         message.error(parseErrorMsg(resp.errorMsg));
//       }

//       throw reserveError ? resp : resp.errorMsg;
//     });
// }

// 默认使用组件库对针对后台项目登录模式设计的接口调用方案
const ssoRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, { body: { ...(options?.data || options?.params || {}) }, method: 'get' });
};

export const getRequest = ssoRequest;

/**
 * 删除请求，这里的传参实际是按照 POST 处理的 !!!
 * @param url
 * @param options
 * @param reserveError
 */
export const delRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, { body: options?.data || options?.params || {}, method: 'DELETE' });
};

export const postRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, { body: options?.data || options?.params || {}, method: 'post' });
};

export const putRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, { body: options?.data || options?.params || {}, method: 'PUT' });
};

export default ssoRequest;
