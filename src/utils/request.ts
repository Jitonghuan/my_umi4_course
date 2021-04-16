import {
  BusGetRequest,
  BusPostRequest,
  BusRequest,
} from '@cffe/fe-backend-component';

// 默认使用组件库对针对后台项目登录模式设计的接口调用方案
const request = BusRequest;
export const getRequest = BusGetRequest;
export const postRequest = BusPostRequest;

export default request;
