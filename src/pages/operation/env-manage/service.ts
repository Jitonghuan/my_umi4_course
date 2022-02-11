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