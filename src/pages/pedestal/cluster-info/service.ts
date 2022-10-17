import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 集群概览-查询集群
export const getCluster = (data: any) => {
  const url = addAPIPrefix('/infraManage/cluster/list');
  return getRequest(url, { data: data });
};

// 集群概览-集群指标查询
export const getMetric = (data: any) => {
  const url = addAPIPrefix('/infraManage/cluster/metric/list');
  return getRequest(url, { data: data });
};

// 集群概览-导入集群
export const importCluster = (data: any) => {
  const url = addAPIPrefix('/infraManage/cluster/import');
  return postRequest(url, { data: data });
};

// 集群概览-更新集群
export const updateCluster = (data: any) => {
  const url = addAPIPrefix('/infraManage/cluster/update');
  return putRequest(url, { data: data });
};