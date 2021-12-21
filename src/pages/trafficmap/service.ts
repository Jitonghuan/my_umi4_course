import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, putRequest } from '@/utils/request';
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
  return getRequest(url, { data: data });
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
  const url = addAPIPrefix('/trafficMap/region/delete:id');
  return delRequest(url, { data: { id: id } });
};
