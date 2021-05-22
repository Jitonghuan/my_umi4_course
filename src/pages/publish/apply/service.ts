import ds from '@config/defaultSettings';
import { queryBizData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';

/** 根据所属，查询业务线列表 */
export const queryBizDataReq = (params: { belong: string }) =>
  getRequest(queryBizData, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return (
        resp?.data?.dataSource?.map((el: any) => {
          return {
            ...el,
            value: el.lineCode,
            label: el.lineName,
          };
        }) || []
      );
    }
    return [];
  });

const queryDeployEnvUrl = `${ds.apiPrefix}/releaseManage/deploy/env/list`;
/** 根据业务线，查询机构列表 */
export const queryDeployEnvReq = (params: { belong: string }) =>
  getRequest(queryDeployEnvUrl, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return (
        resp?.data?.dataSource?.map((el: any) => {
          return {
            ...el,
            value: el.envCode,
            label: el.envName,
          };
        }) || []
      );
    }
    return [];
  });

/** 根据业务线，查询发布计划 */
const queryPublishPlanUrl = `${ds.apiPrefix}/releaseManage/deploy/plan/list`;
export const queryPublishPlanReq = (params: { lineCode: string }) =>
  getRequest(queryPublishPlanUrl, {
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

const querApplyDetailUrl = `${ds.apiPrefix}/releaseManage/apply/detail`;
/** 根据发布申请id查询发布申请详情 */
export const querApplyDetailReq = (params: { id: number | string }) =>
  getRequest(querApplyDetailUrl, {
    data: params,
  }).then((resp) => {
    if (resp.success) {
      return resp?.data || {};
    }
    return {};
  });
