//流水线管理接口
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/dikd9ayr1edqxoet#mk9PB
//2023/01/29 15:17
import { addAPIPrefix } from '@/utils';
///cicdTemplateObj/list

/* GET 1、 查询cicd模版  */

export const getCicdTemplateList = addAPIPrefix('/appManage/cicdTemplateObj/list');
/* GET 2、 更新cicd模版  */

export const updateCicdTemplate = addAPIPrefix('/appManage/cicdTemplateObj/update');