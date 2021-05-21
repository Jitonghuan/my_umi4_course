import request, { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
/** 通用接口 */
/** 根据应用分类code查询应用组列表 */
const queryAppGroupUrl = `${ds.apiPrefix}/appManage/group/list`;
/** 根据应用分类code查询应用组列表 */
export const queryAppGroupReq = (params: {
  //所属的应⽤分类CODE
  categoryCode: string;
}) =>
  getRequest(queryAppGroupUrl, {
    data: {
      ...params,
      pageIndex: 1,
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
        ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });
/** 通用接口结束 */

/** 发布功能相关 */

/** 查询发布功能列表 */
export const queryFunctionUrl = `${ds.apiPrefix}/publishManage/function/list`;
/** 删除发布功能 Method: DELETE */
export const deleteFuncUrl = `${ds.apiPrefix}/publishManage/function`;
export const deleteFunc = (params: { funcId: string }) =>
  getRequest(deleteFuncUrl, {
    method: 'DELETE',
    data: params,
  });

/** 发布功能结束 */

/** 发布计划相关 */
const queryDeployPlanUrl = `${ds.apiPrefix}/publishManage/plan/list`;
export const queryDeployPlanReq = (params: {
  id?: number; //发布功能的数据库⾃增ID
  planID?: string; //发布计划的UUID
  deployer?: string; //部署⼈---⽀持模糊搜索
  preDeployTime?: string; //预发布时间---⽀持模糊搜索
  appGroupCode?: string; //应⽤组CODE
  appCategoryCode?: string; //应⽤分类CODE
  deployStatus?: number; //发布状态0/1/2 未发布/已发布/已上线
  pageIndex?: number; //分⻚索引
  pageSize?: number; //分⻚⼤⼩
}) =>
  getRequest(queryDeployPlanUrl, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return (
        resp?.data?.dataSource?.map((el: any) => {
          return el.plan;
        }) || []
      );
    }
    return [];
  });

/** 发布申请相关 */
/** 查询发布申请列表api */
export const queryApplysUrl = `${ds.apiPrefix}/publishManage/apply/list`;
/** 发布申请结束 */
