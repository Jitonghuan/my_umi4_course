import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 获取应用组
export const getAppType = (data: any) => {
    const url = addAPIPrefix('/infraManage/node/list');
    return getRequest(url, { data: data });
};

// 获取版本号
export const getVersion = (data: any) => {
    const url = addAPIPrefix('/infraManage/node/list');
    return getRequest(url, { data: data });
};

// 创建版本
export const createRelease = (data: any) => {
    const url = addAPIPrefix('/releaseManage/release/create');
    return postRequest(url, { data: data });
};

// 更新版本
export const updateRelease = (data: any) => {
    const url = addAPIPrefix('/releaseManage/release/update');
    return postRequest(url, { data: data });
};

// 获取版本列表
export const getReleaseList = (data: any) => {
    const url = addAPIPrefix('/releaseManage/release/list');
    return getRequest(url, { data: data });
};

// 版本关联需求/bug
export const demandRel = (data: any) => {
    const url = addAPIPrefix('/releaseManage/releaseDemandRel/create');
    return postRequest(url, { data: data });
};

// 版本移除需求/bug
export const deleteDemand = (data: any) => {
    const url = addAPIPrefix('/releaseManage/releaseDemandRel/delete');
    return postRequest(url, { data: data });
};