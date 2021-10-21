// 应用模版相关接口
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/27 10:52
// @see https://come-future.yuque.com/sekh46/bbgc7f/us83sd

import { addAPIPrefix } from '@/utils';

/** 环境名 */
export const envList = addAPIPrefix('/appManage/env/list');
/** 查看应用分类接口 */
export const appTypeList = addAPIPrefix('/appManage/category/list');

/** GET 1、应用模版-获取模版类型 */
export const tmplType = addAPIPrefix('/opsManage/appTemplate/listTmplType');

/** GET 2、应用模版-查看模版 */
export const tmplList = addAPIPrefix('/opsManage/appTemplate/list');

/** POST 3、应用模版-创建模版 */
export const create = addAPIPrefix('/opsManage/appTemplate/create');

/** PUT 4、应用模版-编辑模版 */
export const update = addAPIPrefix('opsManage/appTemplate/update');

/** DELETE 5、应用模版-删除模版 */
export const deleteTmpl = addAPIPrefix('opsManage/appTemplate/delete');

/** POST 6、应用模版-推送模版 */
export const pushTmpl = addAPIPrefix('/opsManage/appTemplate/push');

/** GET 7、应用模版-查看应用参数 */
export const paramsList = addAPIPrefix('/appManage/appTemplate/list');

/** PUT 8、应用模版-编辑应用参数 */
export const editParams = addAPIPrefix('/appManage/appTemplate/update');

// 查看应用/appManage/list
export const appList = addAPIPrefix('/appManage/list');

//  GET 查看操作日志
export const logList = addAPIPrefix('/opsManage/opLog/list');

//  GET 分类型推送模版
export const customPush = addAPIPrefix('/opsManage/appTemplate/customPush');
