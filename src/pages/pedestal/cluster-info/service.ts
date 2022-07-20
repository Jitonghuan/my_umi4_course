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
