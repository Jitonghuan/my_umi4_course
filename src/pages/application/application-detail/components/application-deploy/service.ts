import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 获取应用组
export const appActiveReleases = (data: any) => {
    const url = addAPIPrefix('/releaseManage/appActiveReleases/list');
    return getRequest(url, { data: data });
};

// 版本发布
export const releaseDeploy = (data: any) => {
    const url = addAPIPrefix('/releaseManage/releaseDeploy/create');
    return postRequest(url, { data: data });
};