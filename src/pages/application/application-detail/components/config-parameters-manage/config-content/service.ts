import ds from '@config/defaultSettings';

// 获取版本接口
export const queryVersionApi = `${ds.apiPrefix}/appManage/config/version/list`;

// 获取版本明细
// export const queryVersionDetailApi = `${ds.apiPrefix}/appManage/config/version/listConfig`;

// 回退版本接口
export const doRestoreVersionApi = `${ds.apiPrefix}/appManage/config/version/restore`;
