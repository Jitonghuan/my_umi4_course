import request, { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { FormValue } from './types';

/** 新建应用 */
export const createApp = (params: Omit<FormValue, 'id'>) =>
  postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });

/** 编辑应用 */
export const updateApp = (params: FormValue) =>
  request(`${ds.apiPrefix}/appManage/update`, {
    method: 'PUT',
    data: params,
  });

/** 查询应用分类数据 */
export const queryCategoryData = () =>
  getRequest(`${ds.apiPrefix}/appManage/category/list`, {
    data: {
      pageIndex: -1,
      pageSize: 100,
    },
  }).then((res: any) => {
    if (res.success) {
      return {
        list:
          res.data?.dataSource?.map((el: any) => {
            return {
              ...el,
              value: el.categoryCode,
              label: el.categoryName,
            };
          }) || [],
        // ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });

/** 获取应用组数据 */
export const queryBizData = (params: {
  //所属的应⽤分类CODE
  categoryCode: string;
}) =>
  getRequest(`${ds.apiPrefix}/appManage/group/list`, {
    data: {
      ...params,
      pageIndex: -1,
      pageSize: 100,
    },
  }).then((res: any) => {
    if (res.success) {
      return {
        list:
          res.data?.dataSource?.map((el: any) => {
            return {
              ...el,
              value: el.groupCode,
              label: el.groupName,
            };
          }) || [],
        // ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });

// 查询基础镜像
export const queryBaseImage = () =>
  getRequest(`${ds.apiPrefix}/appManage/baseImage/list`).then((resp: any) => {
    if (resp.success) {
      return {
        list:
          resp?.data?.map((el: any) => {
            return {
              ...el,
              value: el?.imageUrl,
              label: el?.imageName,
            };
          }) || [],
      };
    }

    return { list: [] };
  });
