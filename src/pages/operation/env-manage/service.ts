// 应用模版相关接口
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/26 10:42
// @see https://come-future.yuque.com/sekh46/bbgc7f/fka64k#Ny5fk

import { addAPIPrefix } from '@/utils';

/** 查看应用分类接口 */
export const appTypeList = addAPIPrefix('/appManage/category/list');

/** 新增环境 */
export const createEnv = addAPIPrefix('/appManage/env/create');

/** 查看环境 */
export const queryEnvList = addAPIPrefix('/appManage/env/list');

/** 编辑环境 */
export const updateEnv = addAPIPrefix('/appManage/env/update');

/** 删除环境 */
export const deleteEnv = addAPIPrefix('/appManage/env/delete');

// 查看应用/appManage/list
export const appList = addAPIPrefix('/appManage/list');

/** 应用绑定环境 */
export const pushAppEnv = addAPIPrefix('/appManage/env/pushAppEnv');

/** 查询NGINX 实例 */
export const queryNGList = addAPIPrefix('/opsManage/ngInstanceNoBindEnv/list');

/** 查看实例 */
export const queryNgListDetail = addAPIPrefix('/opsManage/ngInstance/list');

/** GET 获取当前环境已封网和未封网应用 */
export const getAppEnvList = addAPIPrefix('/appManage/env/appList');

/** POST 应用环境封网（应用粒度） */
export const blockAppEnv = addAPIPrefix('/appManage/env/blockAppEnv');

/*  POST 新增审批白名单接口  */
export const applyWhiteList = addAPIPrefix('/appManage/env/applyWhiteList');

/* GET   新增查询审批白名单列表 */
export const getApplyWhiteList = addAPIPrefix('/appManage/env/applyWhiteList');
