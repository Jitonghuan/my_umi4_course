//用户列表页面接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/bs7aq6
//2022/06/30 10:20
import { addAPIPrefix } from '@/utils';
import appConfig from '@/app.config';
/* GET  1、 查询用户列表 */
export const getUserList = addAPIPrefix('/adminManage/user/list');
/* PUT 2、 更新用户信息 */
export const updateUser = addAPIPrefix('/adminManage/user/update');
/* POST 3、新增用户角色 */
export const createUserRole = addAPIPrefix('/adminManage/user/role/create');
/* PUT 4、更新用户角色 */
export const updateUserRole = addAPIPrefix('/adminManage/user/role/update');
/* DELETE 5、 删除用户角色 */
export const deleteUserRole = addAPIPrefix('/adminManage/user/role/delete');
/* POST 6、 新增用户信息 */
export const createUser = addAPIPrefix('/adminManage/user/create');

/** 获取应用组数据 */
export const queryBizData = `${appConfig.apiPrefix}/appManage/group/list`;

/** 查询应用分类数据 */
export const queryCategoryData = `${appConfig.apiPrefix}/appManage/category/list`;
