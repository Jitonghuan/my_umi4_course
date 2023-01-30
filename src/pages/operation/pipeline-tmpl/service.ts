//流水线管理接口
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/dikd9ayr1edqxoet#mk9PB
//2023/01/17 10:50
import { addAPIPrefix } from '@/utils';

/* GET 1、 查询cicd模版  */

export const getCicdTemplateList = addAPIPrefix('/opsManage/cicdTemplate/list');

/* POST 2、 添加 */

export const createCicdTemplate = addAPIPrefix('/opsManage/cicdTemplate/create');

/* POST 3、修改 */

export const updateCicdTemplate = addAPIPrefix('/opsManage/cicdTemplate/update');

/* POST 4、 删除 */

export const deleteCicdTemplate = addAPIPrefix('/opsManage/cicdTemplate/delete');

export const pushCicdTemplate = addAPIPrefix('/opsManage/cicdTemplate/push');


/** 查看应用分类接口 */
export const appTypeList = addAPIPrefix('/appManage/category/list');