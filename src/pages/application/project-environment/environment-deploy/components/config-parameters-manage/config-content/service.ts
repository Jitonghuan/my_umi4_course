import appConfig from '@/app.config';

// 获取版本接口
export const queryVersionApi = `${appConfig.apiPrefix}/appManage/config/version/list`;

// 获取版本明细
// export const queryVersionDetailApi = `${appConfig.apiPrefix}/appManage/config/version/listConfig`;

// 回退版本接口
export const doRestoreVersionApi = `${appConfig.apiPrefix}/appManage/config/version/restore`;

//新增单个配置
export const configAdd = `${appConfig.apiPrefix}/appManage/config/add`;

// 编辑单个配置
export const configUpdate = `${appConfig.apiPrefix}/appManage/config/update`;
