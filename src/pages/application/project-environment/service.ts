import appConfig from '@/app.config';

/** POST 新增项目环境 */
export const createProjectEnv = `${appConfig.apiPrefix}/releaseManage/projectEnv/create`;

/** PUT 编辑项目环境 */
export const updateProjectEnv = `${appConfig.apiPrefix}/releaseManage/projectEnv/update`;

/** DELETE 删除项目环境 */
export const deleteProjectEnv = `${appConfig.apiPrefix}/releaseManage/projectEnv/delete`;

/** GET 查询项目环境 */
export const queryProjectEnvList = `${appConfig.apiPrefix}/releaseManage/projectEnv/list`;

/** GET 查询应用 */
export const queryAppsList = `${appConfig.apiPrefix}/releaseManage/projectEnv/apps/list`;

/** 查看应用分类接口 */
export const appTypeList = `${appConfig.apiPrefix}/appManage/category/list`;

/** 查看基准环境 */
export const queryEnvList = `${appConfig.apiPrefix}/appManage/env/list`;
