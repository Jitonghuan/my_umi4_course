import ds from '@config/defaultSettings';

/* 用户退出接口 */
export const doLogoutApi = '/user_backend/v1/logout';

/* 用户信息接口 */
export const queryUserInfoApi = '/user_backend/v1/user/info';

/** 所有的业务系统查询 */
export const queryAllSystem = '/user_backend/v1/application/query';

/** 查询所属数据 */
export const queryCategoryData = `${ds.apiPrefix}/appManage/category/list`;

/** 获取业务线数据 */
export const queryBizData = `${ds.apiPrefix}/appManage/group/list`;

/** 获取环境接口 */
export const queryEnvData = `${ds.apiPrefix}/appManage/env/list`;

/** 获取权限数据 */
export const queryPermission = `${ds.apiPrefix}/rightManage/getUserMenus`;
