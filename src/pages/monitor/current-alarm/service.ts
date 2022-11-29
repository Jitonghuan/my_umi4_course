import { postRequest, getRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';

/**
 * GET 静默列表
 */
export const getSilence = (data: any) => {
  const url = `${appConfig.apiPrefix}/monitorManage/alertCenter/currentAlerts/silence/list`;
  return getRequest(url, {data})
}


/**
 * GET 查看集群列表
 */
export const getCluster = () => {
  const url = `${appConfig.apiPrefix}/monitorManage/cluster`;
  return getRequest(url)
}

/**
 * GET 当前报警列表
 */
export const getCurrentAlerts = (data: any) => {
  const url = `${appConfig.apiPrefix}/monitorManage/alertCenter/currentAlerts/list`;
  return getRequest(url, {data})
}

/**
 * DELETE 删除静默
 */
export const delSilence = (data: any) => {
  const url = `${appConfig.apiPrefix}/monitorManage/alertCenter/currentAlerts/silence`;
  return delRequest(url, {data})
}

/**
 * POST 删除静默
 */
export const addSilence = (data: any) => {
  const url = `${appConfig.apiPrefix}/monitorManage/alertCenter/currentAlerts/silence`;
  return postRequest(url, {data})
}
