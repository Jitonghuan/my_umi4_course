import { addAPIPrefix } from '@/utils';

/** GET 0、获取当前访问量 */
export const getCurrentClusterTrafficData = addAPIPrefix('/opsManage/multiple/getCurrentClusterTrafficData');

/** GET 1、获取流量趋势 */
export const getCurrentClusterTrafficDataSet = addAPIPrefix('/opsManage/multiple/getCurrentClusterTrafficDataSet');

/** GET 2、获取B集群各院区流量数据 */
export const getBClusterEsData = addAPIPrefix('/opsManage/multiple/getBClusterEsData');
/** GET 3、获取AB集群各院区流量数据表格 */
export const getClustersEsDataTable = addAPIPrefix('/opsManage/multiple/getClustersEsDataTable');
