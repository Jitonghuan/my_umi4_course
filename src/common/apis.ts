// 全局公共接口
// 这里存在一些全局通用接口，比如用户、环境、枚举等
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/24 14:32

import appConfig from '@/app.config';

/* 用户退出接口 */
export const doLogoutApi = '/user_backend/v1/logout';

/* 用户信息接口 */
export const queryUserInfoApi = '/user_backend/v1/user/info';

/** 所有的业务系统查询 */
export const queryAllSystem = '/user_backend/v1/application/query';

/** 查询应用分类数据 */
export const queryCategoryData = `${appConfig.apiPrefix}/appManage/category/list`;

/** 获取应用组数据 */
export const queryBizData = `${appConfig.apiPrefix}/appManage/group/list`;

/** 业务模块 */
export const queryBizModuleData = `${appConfig.apiPrefix}/orgManage/buSys/list`;

/** 获取环境类型接口 */
export const queryEnvTypeData = `${appConfig.apiPrefix}/appManage/env/listType`;

/** 获取权限数据 */
export const queryPermission = `${appConfig.apiPrefix}/rightManage/getUserMenus`;
