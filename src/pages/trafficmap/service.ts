import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';
import { IRegionInfo } from './interface';

/**
 * 查询域
 * @param data
 * @returns
 */
export const getRegionList = (data: any) => {
  const url = addAPIPrefix('/trafficMap/region/list');
  return getRequest(url, { data: data });
};

/**
 * 创建域
 * @param data
 * @returns
 */
export const createRegion = (data: IRegionInfo) => {
  const url = addAPIPrefix('/trafficMap/region/create');
  return postRequest(url, { data: data });
};

/**
 * 获取域里面的应用
 * @param data
 * @returns
 */
export const getAppByRegion = (data: any) => {
  const url = addAPIPrefix('/trafficMap/region/listApp');
  return getRequest(url, { data: data });
};

/**
 * 编辑域
 * @param data
 * @returns
 */
export const updateRegion = (data: any) => {
  const url = addAPIPrefix('/trafficMap/region/update');
  return putRequest(url, { data: data });
};

/**
 * 删除域
 * @param id region id
 * @returns
 */
export const deleteRegion = (id: string) => {
  const url = addAPIPrefix(`/trafficMap/region/delete/${id}`);
  return delRequest(url, { data: { id: id } });
};

/**
 * 查询全局拓扑
 * @param data ：envCode  duration  step
 * @returns
 */
export const getTopoList = (data: any) => {
  const url = addAPIPrefix('/trafficMap/topology/list');
  return getRequest(url, {
    data: {
      envCode: data.envCode,
      duration: data.duration,
    },
  });
};

/**
 * 获取环境列表
 * @returns
 */
export const getEnvList = () => {
  const url = addAPIPrefix('/appManage/env/list');
  return getRequest(url, {
    data: { pageSize: 1000 },
  });
};

/**
 * 获取应用信息
 * @param data envCode  duration  appCode
 * @returns
 */
export const getAppMonitorInfo = (data: any) => {
  const url = addAPIPrefix('/trafficMap/topology/listAppMonInfo');
  return getRequest(url, { data: data });
};

export const listDangerousCalls = (data: any) => {
  const url = addAPIPrefix('/trafficMap/topology/listDangerousCalls');
  return getRequest(url, { data: data });
};

// 追踪部分

//追踪-获取应用列表
export const getApplicationList = (data: any) => {
  const url = 'http://127.0.0.1:4523/mock/837336/trafficMap/application/list';
  // const url = addAPIPrefix('/trafficMap/application/list');
  return getRequest(url, { data: data });
};

// 追踪-查看应用实例
export const getInstance = (data: any) => {
  const url = 'http://127.0.0.1:4523/mock/837336/trafficMap/application/instance/list';
  // const url = addAPIPrefix('/trafficMap/application/instance/list');
  return getRequest(url, { data: data });
};

// 追踪-链路追踪信息
export const getTrace = (data: any) => {
  const url = 'http://127.0.0.1:4523/mock/837336/trafficMap/tracing/info';
  // const url = addAPIPrefix('/trafficMap/tracing/search');
  return getRequest(url, { data: data });
};

// 追踪-查询链路详细信息
export const getTraceInfo = (data: any) => {
  const url = addAPIPrefix('/trafficMap/tracing/info');
  return getRequest(url, { data: data });
};

// 降噪-新增降噪配置
export const addNoise = (data: any) => {
  const url = 'http://127.0.0.1:4523/mock/837336/trafficMap/tracing/noiseReduction/create';
  // const url = addAPIPrefix('/trafficMap/tracing/noiseReduction/create');
  return postRequest(url, { data: data });
};

// 降噪-获取降噪配置列表
export const getNoiseList = (data: any) => {
  const url = 'http://127.0.0.1:4523/mock/837336/trafficMap/tracing/noiseReduction/list';
  // const url = addAPIPrefix('/trafficMap/tracing/noiseReduction/list');
  return getRequest(url, { data: data });
};

// 降噪-更新降噪配置
export const updataNoise = (data: any) => {
  const url = 'http://127.0.0.1:4523/mock/837336/trafficMap/tracing/noiseReduction/update';
  // const url = addAPIPrefix('/trafficMap/tracing/noiseReduction/update');
  return putRequest(url, { data: data });
};

// 降噪-删除降噪配置
export const deleteNoise = (data: any) => {
  const url = addAPIPrefix('/trafficMap/tracing/noiseReduction/update');
  return putRequest(url, { data: data });
};
