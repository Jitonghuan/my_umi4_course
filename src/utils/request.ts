import { request } from '@cffe/layout';

interface RequestOptionsInit {
  data?: any;
  params?: any;
  hideToast?: boolean;
}

// 默认使用组件库对针对后台项目登录模式设计的接口调用方案
const ssoRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, {
    body: { ...(options?.data || options?.params || {}) },
    method: 'get',
    hideToast: options?.hideToast,
  });
};

export const getRequest = ssoRequest;

/**
 * 删除请求，这里的传参实际是按照 POST 处理的 !!!
 * @param url
 * @param options
 * @param reserveError
 */
export const delRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, {
    body: options?.data || options?.params || {},
    method: 'DELETE',
    hideToast: options?.hideToast,
  });
};

export const postRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, { body: options?.data || options?.params || {}, method: 'post', hideToast: options?.hideToast });
};

export const putRequest = (url: string, options?: RequestOptionsInit, reserveError?: boolean) => {
  return request(url, { body: options?.data || options?.params || {}, method: 'PUT', hideToast: options?.hideToast });
};

export default ssoRequest;
