import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

// 获取版本信息列表
export const appActiveReleases = (data: any) => {
    const url = addAPIPrefix('/releaseManage/appActiveReleases/list');
    return getRequest(url, { data: data });
};
///releaseDeploy/check
export const checkReleaseDeploy = (appCode: string) => {
    const url = addAPIPrefix('/releaseManage/releaseDeploy/check');
    return getRequest(url, { data: {appCode} });
};

// 版本发布
export const releaseDeploy = (data: any) => {
    const url = addAPIPrefix('/releaseManage/releaseDeploy/create');
    return postRequest(url, { data: data });
};
///appPublish/list
export const appPublishListUrl = addAPIPrefix('/releaseManage/appPublish/list');
export const getAppPublishList = (appCode: string) => {
    const url = addAPIPrefix('/releaseManage/appPublish/list');
    return getRequest(url, { data: {appCode} });
};

