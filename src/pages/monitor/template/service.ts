import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';


export interface IGraphTemplate {
  dsType: string;
  graphTemplateName: string;
  graphTemplateJson: string;
  graphTemplateDescribe: string;
}

/**
 * GET 查看大盘模版
 * @param dsType
 * @param keyword
 * @returns
 */
export const queryGraphTemplateUrl=`${appConfig.apiPrefix}/monitorManage/graphTemplate/list`
export const graphTemplateList = (dsType?: string, keyword?: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/list`;
  return getRequest(url, { data: { dsType, keyword } });
}

/**
 * POST 创建大盘模版
 * @param data：IGraphTable
 * @returns
 */
export const createGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/create`;
export const createGraphTemplate = (data: IGraphTemplate) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/create`;
  return postRequest(url, { data: data });
}

/**
 * PUT 更新大盘模版
 * @param data：IGraphTable
 * @returns
 */
export const updateGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/update`
export const updateGraphTemplate = (data: IGraphTemplate) => {
  return putRequest(updateGraphTemplateUrl, { data: data });
}

/**
 * DELETE 删除大盘模版
 * @param clusterCode
 * @param graphUuid
 * @returns
 */
 export const deleteGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/delete`
export const delGraphTemplate = (id: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/delete:${id}`;
  return delRequest(url, { data: { id } });
}
