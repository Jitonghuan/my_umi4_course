//管理员页面接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/ig72yd
//2022/06/14 13:50
import { addAPIPrefix } from '@/utils';

/* GET 1、查询文章  */

export const getInfoList = addAPIPrefix('/adminManage/post/list');

/* POST 2、 新增文章 */

export const createInfo = addAPIPrefix('/adminManage/post/create');

/* PUT 3、 编辑文章 */

export const updateInfo = addAPIPrefix('/adminManage/post/update');

/* DELETE 4、 删除文章 */

export const deleteInfo = addAPIPrefix('/adminManage/post/delete');
