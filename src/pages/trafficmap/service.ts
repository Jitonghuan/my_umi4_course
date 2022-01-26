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
