import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 获取生产者列表
export const getProviders = (data: any) => {
    const url = addAPIPrefix('/configManage/registry/getProviders');
    return getRequest(url, { data: data });
};

// 获取消费者列表
export const getConsumers = (data: any) => {
    const url = addAPIPrefix('/configManage/registry/getConsumers');
    return getRequest(url, { data: data });
};

// 获取服务详情
export const getServiceDetail = (data: any) => {
    const url = addAPIPrefix('/configManage/registry/serviceDetail');
    return getRequest(url, { data: data });
};

// 查询服务的订阅实例
export const getSubscribers = (data: any) => {
    const url = addAPIPrefix('/configManage/registry/getSubscribers');
    return getRequest(url, { data: data });
};

// 编辑服务实例
export const updateServiceInstance = (data: any) => {
    const url = addAPIPrefix('/configManage/registry/updateServiceInstance');
    return postRequest(url, { data: data });
};

// 删除服务
export const delService = (data: any) => {
    const url = addAPIPrefix('/configManage/registry/deleteService');
    return delRequest(url, { data: data });
};