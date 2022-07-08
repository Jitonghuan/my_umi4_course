import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';


// 集群概览-查询集群
export const getCluster = (data: any) => {
    const url = addAPIPrefix('/infraManage/cluster/list');
    return getRequest(url, { data: data });
};

// 节点查询
export const getNode = (data: any) => {
    const url = addAPIPrefix('/infraManage/node/list');
    return getRequest(url, { data: data });
};

// 节点列表-更新标签
export const nodeUpdate = (data: any) => {
    const url = addAPIPrefix('/infraManage/node/update');
    return postRequest(url, { data: data });
};

// 节点排空
export const nodeDrain = (data: any) => {
    const url = addAPIPrefix('/infraManage/node/drain');
    return postRequest(url, { data: data });
};

//新增节点
export const addNode = (data: any) => {
    const url = addAPIPrefix('/infraManage/node/add');
    return postRequest(url, { data: data });
};

// 获取资源详情列表
export const getResourceList = (data: any) => {
    const url = addAPIPrefix('/infraManage/resource/list');
    return getRequest(url, { data: data });
};