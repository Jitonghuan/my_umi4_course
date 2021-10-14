import { addAPIPrefix } from '@/utils';

/** GET 0、获取AB集群各院区流量数据 */
export const getClustersEsData = addAPIPrefix('/opsManage/multiple/getClustersEsData');

/** GET 1、获取A集群各院区流量数据 */
export const getAClusterEsData = addAPIPrefix('/opsManage/multiple/getAClusterEsData');

/** GET 2、获取B集群各院区流量数据 */
export const getBClusterEsData = addAPIPrefix('/opsManage/multiple/getBClusterEsData');
/** GET 3、获取AB集群各院区流量数据表格 */
export const getClustersEsDataTable = addAPIPrefix('/opsManage/multiple/getClustersEsDataTable');
