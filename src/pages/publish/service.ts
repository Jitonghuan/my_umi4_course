import request, { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { IFuncItem, IPlanItem } from './typing';
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
/** 根据应用分类code查询发布环境列表 */
const queryEnvsUrl = `${ds.apiPrefix}/appManage/env/list`;
export const queryEnvsReq = (params: {
  //所属的应⽤分类CODE
  categoryCode: string;
}) =>
  getRequest(queryEnvsUrl, {
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
              value: el.envCode,
              label: el.envName,
            };
          }) || [],
        ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });

/** 根据应用分类code查询发布环境列表 */
export const queryJiraUrl = `${ds.apiPrefix}/publishManage/issue/list`;
/** 通用接口结束 */

/** 发布功能相关 */

/** 查询发布功能列表 */
export const queryFunctionUrl = `${ds.apiPrefix}/publishManage/function/list`;
export const queryFunctionReq = (params: {
  id?: number; // 发布功能的数据库⾃增ID
  appCategoryCode?: string; // 应⽤分类CODE
  appGroupCode?: string; // 应⽤组CODE
  funcName?: string;
  funcId?: string;
}) =>
  getRequest(queryFunctionUrl, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return resp?.data?.dataSource || [];
    }
    return [];
  });
/** 新增发布功能 */
export const addFuncUrl = `${ds.apiPrefix}/publishManage/function/create`;
export const addFuncReq = (params: IFuncItem) =>
  postRequest(addFuncUrl, {
    data: params,
  });
/** 批量新增发布功能 */
export const addFuncMultiUrl = `${ds.apiPrefix}/publishManage/function/multiCreate`;
export const addFuncMultiReq = (params: IFuncItem[]) =>
  postRequest(addFuncMultiUrl, {
    data: params,
  });
/** 修改发布功能 */
export const updateFuncUrl = `${ds.apiPrefix}/publishManage/function/update`;
export const updateFuncReq = (params: IFuncItem) =>
  postRequest(updateFuncUrl, {
    method: 'PUT',
    data: params,
  });

/** 删除发布功能 Method: DELETE */
export const deleteFuncUrl = `${ds.apiPrefix}/publishManage/function`;
export const deleteFunc = (params: { funcId: string }) =>
  request(`${deleteFuncUrl}/${params.funcId}`, {
    method: 'DELETE',
  });

/** 发布功能结束 */

/** 发布计划相关 */
/** 查询发布计划列表 */
export const queryPublishPlanUrl = `${ds.apiPrefix}/publishManage/plan/list`;
export const queryPublishPlanReq = (params: {
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
  getRequest(queryPublishPlanUrl, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return resp?.data?.dataSource || [];
    }
    return [];
  });
/** 新增发布计划 */
export const addPublishPlanUrl = `${ds.apiPrefix}/publishManage/plan/create`;
export const addPublishPlanReq = (params: IPlanItem) =>
  postRequest(addPublishPlanUrl, {
    data: params,
  });
export const addPublishPlanMultiUrl = `${ds.apiPrefix}/publishManage/plan/multiCreate`;
export const addPublishPlanMultiReq = (params: { plan: IPlanItem; funcIds: any[] }) =>
  postRequest(addPublishPlanMultiUrl, {
    data: [params],
  });

/** 修改发布计划 */
export const updatePublishPlanUrl = `${ds.apiPrefix}/publishManage/plan/update`;
export const updatePublishPlanReq = (params: IFuncItem) =>
  postRequest(updatePublishPlanUrl, {
    method: 'PUT',
    data: params,
  });

/** 删除发布计划 Method: DELETE */
export const deletePublishPlanUrl = `${ds.apiPrefix}/publishManage/plan`;
export const deletePublishPlanReq = (params: { planId: string }) =>
  request(`${deletePublishPlanUrl}/${params.planId}`, {
    method: 'DELETE',
  });
/** 发布计划结束 */

/** 发布申请相关 */
/** 查询发布申请列表api */
export const queryApplysUrl = `${ds.apiPrefix}/publishManage/apply/list`;
export const queryApplysReq = (params: {
  id?: string;
  title?: string; //申请标题
  deployDate?: string; // 发布时间
  appGroupCode?: string; //应⽤组CODE
  appCategoryCode?: string; //应⽤分类CODE
  deployStatus?: number; //申请状态 0/1/2/3 申请中/申请通过/申请拒绝/撤回
  deployType?: number; //部署类型 frontend/backend
  pageIndex?: number; //分⻚索引
  pageSize?: number; //分⻚⼤⼩
}) =>
  getRequest(queryApplysUrl, {
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
/** 新增发布申请 */
export const addPublishApplyUrl = `${ds.apiPrefix}/publishManage/apply/create`;
export const addPublishApplyReq = (params: { applyInfo: any; planIds: any[] }) =>
  postRequest(addPublishApplyUrl, {
    data: params,
  });
/** 获取发布申请的关联信息 */
const getApplyRelInfo = `${ds.apiPrefix}/publishManage/apply/getApplyRelInfo`;
export const getApplyRelInfoReq = (params: { id: string }) =>
  getRequest(getApplyRelInfo, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return resp?.data || {};
    }
    return {};
  });
/** 发布申请结束 */
