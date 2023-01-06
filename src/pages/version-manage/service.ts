import { addAPIPrefix } from '@/utils';
import { getRequest, postRequest, } from '@/utils/request';

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
//release/getMerge
export const getMergeList = (id: number) => {
    const url = addAPIPrefix('/releaseManage/release/getMerge');
    return getRequest(url, { data: { id } });
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

// 版本需求列表
export const releaseDemandRel = (data: any) => {
    const url = addAPIPrefix('/releaseManage/releaseDemandRel/list');
    return getRequest(url, { data: data });
};
// 版本应用列表
export const releaseAppRel = (data: any) => {
    const url = addAPIPrefix('/releaseManage/releaseAppRel/list');
    return getRequest(url, { data: data });
};

// 版本应用列表
export const releasePublish = (id: number) => {
    const url = addAPIPrefix('/releaseManage/release/pack');
    return postRequest(url, { data: { id } });
};

///release/download
export const downLoadUrl = addAPIPrefix('/releaseManage/release/download');
//合并版本
export const mergeReleaseUrl = addAPIPrefix('/releaseManage/release/merge');
export const releaseMerge = (params: { id: number, mergedId: number }) => {
    return postRequest(mergeReleaseUrl, { data: params });
};

///releaseDownload/list
export const releaseDownloadListUrl = addAPIPrefix('/releaseManage/releaseDownload/list');
export const getReleaseDownloadList = (releaseId: number) => {
    return getRequest(releaseDownloadListUrl, { data: { releaseId } });
};

// 版本详情-新增配置/sql
export const addConfig = (params: any) => {
    const url = addAPIPrefix('/releaseManage/appPublish/add');
    return postRequest(url, { data: params });
};

// 配置/sql接口
export const getDataUrl = addAPIPrefix('/releaseManage/noDeployPublish/list');
export const getDataList = (params: any) => {
    return getRequest(getDataUrl, { data: params });
};

// 编辑 配置/sql接口
export const editUrl = addAPIPrefix('/releaseManage/appPublish/edit');
export const editData = (params: any) => {
    return postRequest(editUrl, { data: params });
};

// 查询应用
export const getAppUrl = addAPIPrefix('/appManage/list');
export const getAppList = (params: any) => {
    return getRequest(getAppUrl, { data: params });
};


