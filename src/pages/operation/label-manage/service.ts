// 标签管理相关接口
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/12/06 10:56
// @see https://come-future.yuque.com/sekh46/bbgc7f/qt3ewh

import { addAPIPrefix } from '@/utils';

/** GET 标签管理列表接口  */
export const getTagList = addAPIPrefix('/opsManage/tagManage/getTagList');
/** POST 新增标签接口 */
export const createTag = addAPIPrefix('/opsManage/tagManage/createTag');
/** PUT 编辑标签接口 */
export const updateTag = addAPIPrefix('opsManage/tagManage/updateTag');
/** DELETE 删除标签 */
export const deleteTag = addAPIPrefix('opsManage/tagManage/deleteTag');
/** POST 绑定标签 */
export const bindTag = addAPIPrefix('/opsManage/tagManage/bindTag');
/** POST 解绑标签 */
export const unBindTag = addAPIPrefix('/opsManage/tagManage/unBindTag');
/** GET 获取应用标签 */
export const getAppTag = addAPIPrefix('/opsManage/tagManage/getAppTag');
/** POST 应用绑定标签 */
export const bindAppTag = addAPIPrefix('/opsManage/tagManage/bindAppTag');
/** DELETE 应用删除标签 */
export const delAppTag = addAPIPrefix('/opsManage/tagManage/delAppTag');

// 获取未绑定指定标签的应用(用于绑定标签)
export const getUnBindTagApp = addAPIPrefix('/opsManage/tagManage/getUnBindTagApp');
//获取已绑定指定标签的应用(用于解绑标签)
export const getBindedTagApp = addAPIPrefix('/opsManage/tagManage/getBindedTagApp');

/** 查看应用分类接口 */
export const appTypeList = addAPIPrefix('/appManage/category/list');
