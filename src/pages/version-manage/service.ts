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