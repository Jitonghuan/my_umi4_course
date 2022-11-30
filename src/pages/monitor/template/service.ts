import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';
import { message } from '@cffe/h2o-design';

export interface IGraphTemplate {
  dsType: string;
  graphTemplateName: string;
  graphTemplateJson?: string;
  graphTemplateDescribe: string;
}

const getRequestQuery = (params: any = {}) => {
  return Object.keys(params)
    .reduce((prev, curr) => {
      if (params[curr]) {
        prev.append(curr, params[curr]);
      }
      return prev;
    }, new URLSearchParams())
    .toString();
};

/**
 * GET 查看大盘模版
 * @param dsType
 * @param keyword
 * @returns
 */
export const queryGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/list`;
export const graphTemplateList = (dsType?: string, keyword?: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/list`;
  return getRequest(url, { data: { dsType, keyword, pageSize: -1 } });
};

export const queryRuleTemplatesList = () => {
  const url = `${appConfig.apiPrefix}/monitorManage/ruleTemplates/list`;
  return getRequest(url, { data: { pageSize: -1 } });
};

/**
 * POST 创建大盘模版
 * @param data：IGraphTable
 * @returns
 */
export const createGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/create`;
export const createGraphTemplate = (params: any, graphTemplateJson: any) => {
  let url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/create`;

  const queryString = getRequestQuery(params);
  url = queryString ? `${url}?${queryString}` : url;

  return postRequest(url, { data: { ...graphTemplateJson } });
};

/**
 * PUT 更新大盘模版
 * @param data：IGraphTable
 * @returns
 */
export const updateGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/update`;
export const updateGraphTemplate = (params: any, graphTemplateJson: any) => {
  const queryString = getRequestQuery(params);
  const url = queryString ? `${updateGraphTemplateUrl}?${queryString}` : updateGraphTemplateUrl;
  return putRequest(url, { data: { ...graphTemplateJson } });
};

/**
 * DELETE 删除大盘模版
 * @param clusterCode
 * @param graphUuid
 * @returns
 */
export const deleteGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/delete`;
export const delGraphTemplate = (id: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/delete:${id}`;
  return delRequest(url, { data: { id } });
};

/**
 * POST 一键应用报警模版
 * @returns
 */
export const applyTemplate = (data: any) => {
  const url = `${appConfig.apiPrefix}/monitorManage/alertCenter/monitorRuleTemplate/apply`;
  return postRequest(url, { data });
};
