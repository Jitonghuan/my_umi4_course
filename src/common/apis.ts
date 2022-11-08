// 全局公共接口
// 这里存在一些全局通用接口，比如用户、环境、枚举等
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/24 14:32
import appConfig from '@/app.config';
import { addAPIPrefix } from '@/utils';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';

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
// export const queryEnvTypeData = `${appConfig.apiPrefix}/appManage/env/listType`;
export const queryEnvTypeData = `${appConfig.apiPrefix}/appManage/env/listAppEnvType`;

/** 获取权限数据 */
export const queryPermission = `${appConfig.apiPrefix}/rightManage/getUserMenus`;

/** 获取应用环境类型 */
export const listAppEnvType = `${appConfig.apiPrefix}/appManage/env/listAppEnvType`;
// `http://c2f.apex.cfuture.shop/kapi/apex-osc/org/getStaffOrgList`
/** POST 获取所属组织数据 */
// export const getStaffOrgList = `${matrixConfigData?.domainName}/kapi/apex-osc/org/getStaffOrgList`;

/** POST 获取所属部门数据 */
// export const getStaffDeptList = `${matrixConfigData?.domainName}/kapi/apex-osc/dept/getStaffDeptList`;

/** POST 切换部门确认接口 */
// export const chooseDept = `${matrixConfigData?.domainName}/kapi/apex-sso/chooseDept`;

/* ---------------站内系统消息接口--------------- */

/** GET 查询未读消息数接口 */
export const unreadNumApi = `${appConfig.apiPrefix}/adminManage/systemNotice/unreadNum`;

/** GET 查询所有系统消息 */
export const systemNoticeListApi = `${appConfig.apiPrefix}/adminManage/systemNotice/list`;

/** POST 批量更新为已读 */
export const readListApi = `${appConfig.apiPrefix}/adminManage/systemNotice/list/read`;

/** POST 发送系统消息 */
export const sendSystemNoticeApi = `${appConfig.apiPrefix}/adminManage/systemNotice/send`;

/** DELETE 删除系统通知  */
export const deleteSystemNoticeApi = `${appConfig.apiPrefix}/adminManage/systemNotice/delete`;

/** GET 获取Matrix配置信息  */
export const getMatrixEnvConfig = `${appConfig.apiPrefix}/adminManage/matrixEnvConfig`;

/* GET 获取CHANGE LOG */
export const getLatestChangelog = `${appConfig.apiPrefix}/adminManage/changelog/latest`;
/* GET 查询文章  */

export const getInfoList = `${appConfig.apiPrefix}/adminManage/post/list`;

// 当前页面按钮权限
export const getBtnPermission = (data: any) => {
    const url = addAPIPrefix('/rightManage/getUserPermissions');
    return getRequest(url, { data: data });
};


