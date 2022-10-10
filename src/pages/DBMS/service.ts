/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-10-10 13:51:30
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-10 14:01:19
 * @FilePath: /fe-matrix/src/pages/DBMS/service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* 数据变更管理接口文档 https://come-future.yuque.com/sekh46/bbgc7f/eh25u4#Wm5mi */
import { addAPIPrefix } from '@/utils';
import appConfig from '@/app.config';
/* 权限 */
/* GET  1、 查询权限列表 */
export const queryPrivListApi = `${appConfig.dmpApiPrefix}/dmp/user/priv/list`;
/* DELETE 2、 删除权限 */
export const delPrivApi = `${appConfig.dmpApiPrefix}/dmp/user/priv`;
/* PUT 3、 更新用户信息 */

/* POST 4、新增用户角色 */

/* PUT 5、更新用户角色 */


/* POST 6、 新增用户信息 */