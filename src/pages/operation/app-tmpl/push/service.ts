import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';
/** 根据应用分类code查询应用组列表 */
const queryAppGroupUrl = `${appConfig.apiPrefix}/appManage/group/list`;
/** 根据应用分类code查询应用组列表 */
export const queryAppGroupReq = (params: {
  //所属的应⽤分类CODE
  categoryCode: string;
}) =>
  getRequest(queryAppGroupUrl, {
    data: {
      ...params,
      pageIndex: 1,
      pageSize: 800,
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
      };
    }

    return { list: [] };
  });
