/*
 * @Author: your name
 * @Date: 2022-02-23 13:40:30
 * @LastEditTime: 2022-03-02 15:38:44
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/operation/env-manage/service.ts
 */
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
