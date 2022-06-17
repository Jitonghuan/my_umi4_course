import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';


// 新增依赖规则
export const addRule = (data: any) => {
    const url = addAPIPrefix('/appManage/dependencyManage/addRule');
    return postRequest(url, { data: data });
};

// 获取依赖规则列表
export const getRuleList = (data: any) => {
    const url = addAPIPrefix('/appManage/dependencyManage/getRuleList');
    return getRequest(url, { data: data });
};

// 降噪-更新降噪配置
export const updateRule = (data: any) => {
    const url = addAPIPrefix('/appManage/dependencyManage/updateRule');
    return putRequest(url, { data: data });
};