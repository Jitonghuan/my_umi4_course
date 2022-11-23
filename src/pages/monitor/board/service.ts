import { IGraphDataSource } from './interfaces';
import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';

const getRequestQuery = (params: any = {}) => {
  return Object.keys(params).reduce((prev, curr) => {
    if (params[curr]) {
      prev.append(curr, params[curr])
    }
    return prev

  }, new URLSearchParams()).toString()
}

/**
 * GET 查看集群列表
 */
export const getCluster = () => {
  const url = `${appConfig.apiPrefix}/monitorManage/cluster`;
  return getRequest(url)
}

/**
 * GET 查看大盘列表
 * @param data
 * @returns
 */
export const graphTableList = (data: any) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTable/list`;
  return getRequest(url, { data: data });
}

/**
 * POST 创建大盘
 * @param data：IGraphTable
 * @returns
 */
export const createGraphTable = (params: any, data: any) => {
  const { graphJson = {} } = data
  let url = `${appConfig.apiPrefix}/monitorManage/graphTable/create`;
  const queryString = getRequestQuery(params)
  url = queryString ? `${url}?${queryString}` : url
  return postRequest(url, { data: { ...graphJson } });
}

/**
 * PUT 更新大盘
 * @param data：IGraphTable
 * @returns
 */
export const updateGraphTable = (params: any, data: any) => {
  const { graphJson = {} } = data
  let url = `${appConfig.apiPrefix}/monitorManage/graphTable/update`;

  const queryString = getRequestQuery(params)
  url = queryString ? `${url}?${queryString}` : url
  return putRequest(url, { data: { ...graphJson } });
}

/**
 * DELETE 删除大盘
 * @param clusterCode
 * @param graphUuid
 * @returns
 */
export const delGraphTable = (clusterCode: number, graphUuid: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTable/delete/:graphUuid?clusterCode=${clusterCode}&graphUuid=${graphUuid}`;
  return delRequest(url);
}

/**
 * GET 查看大盘模版
 * @param dsType
 * @param keyword
 * @returns
 */
export const queryGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/list`

export const graphTemplateList = (dsType?: string, keyword?: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/list`;
  return getRequest(url, { data: { dsType, keyword } });
}

/**
 * GET 查看大盘数据源
 * @param clusterCode
 * @param dsType
 * @param keyword
 * @returns
 */
export const getGraphGraphDatasouceList = (data: any) => {
  // const data=
  const url = `${appConfig.apiPrefix}/monitorManage/graphDatasource/list`;
  return getRequest(url, { data: data });
}

/**
 * POST 创建大盘数据源
 * @param data：IGraphTable
 * @returns
 */
export const createGraphDatasouce = (data: IGraphDataSource) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphDatasource/create`;
  return postRequest(url, { data: data });
}


/**
 * PUT 更新大盘数据源
 * @param data：IGraphTable
 * @returns
 */
export const updateGraphDatasouce = (data: IGraphDataSource) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphDatasource/update`;
  return postRequest(url, { data: data });
}

/**
 * DELETE 删除大盘数据源
 * @param clusterCode
 * @param graphUuid
 * @returns
 */
export const delGraphDatasouce = (uuid: string | number) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphDatasource/delete/${uuid}`;
  return delRequest(url);
}

/**
 * GET 根据数据源类型获取数据源和模板
 * @param clusterCode
 * @param graphUuid
 * @returns
 */
export const graphTableInfo = (clusterCode: string, dsType: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTable/info`;
  return delRequest(url, { data: { clusterCode, dsType } });
}

/**
 * GET 获取监控大盘类别名称清单
 * @returns
 */
 export const getCategory = () => {
  const url = `${appConfig.apiPrefix}/monitorManage/graphTable/category/name/list`;
  return getRequest(url);
}

/**
 * POST 创建大盘模版
 * @param data：IGraphTable
 * @returns
 */
export const createGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/create`;
export const createGraphTemplate = (params: any, graphTemplateJson:any) => {
  let url = `${appConfig.apiPrefix}/monitorManage/graphTemplate/create`;

  const queryString = getRequestQuery(params)
  url = queryString ? `${url}?${queryString}` : url

  return postRequest(url, { data: { ...graphTemplateJson } });
}

/**
 * PUT 更新大盘模版
 * @param data：IGraphTable
 * @returns
 */
export const updateGraphTemplateUrl = `${appConfig.apiPrefix}/monitorManage/graphTemplate/update`
export const updateGraphTemplate = (params: any, graphTemplateJson:any) => {
  const queryString = getRequestQuery(params)
  const url = queryString ? `${updateGraphTemplateUrl}?${queryString}` : updateGraphTemplateUrl
  return putRequest(url, { data: { ...graphTemplateJson } });
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

