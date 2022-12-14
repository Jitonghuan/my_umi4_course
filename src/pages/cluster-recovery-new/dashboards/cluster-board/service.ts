import { addAPIPrefix } from '@/utils';

/** GET 0、获取AB集群各院区流量数据 */
export const getClustersEsData = addAPIPrefix('/opsManage/multiple/common/getCurrentClusterTrafficData');

/** GET 1、获取A集群B集群各院区流量数据 */
export const getClusterEsData = addAPIPrefix('/opsManage/multiple/common/getCurrentClusterTrafficDataSet');

/** GET 2、获取B集群各院区流量数据 */
export const getBClusterEsData = addAPIPrefix('/opsManage/multiple/common/getCurrentClusterTrafficDataSet');
/** GET 3、获取AB集群各院区流量数据表格 */
export const getClustersEsDataTable = addAPIPrefix('/opsManage/multiple/common/getCurrentClusterTrafficData');
