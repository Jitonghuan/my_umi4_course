// 函数管理相关接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/27 09:21
// @see https://come-future.yuque.com/sekh46/bbgc7f/vunnok#HNWBj

import { addAPIPrefix } from '@/utils';

/** POST 5、函数管理-新增函数 */
// TODO 数据怎么加密？
export const addFunc = addAPIPrefix('/qc/autotest/addFunc');

/** POST 6、函数管理-删除函数 */
export const delFunc = addAPIPrefix('/qc/autotest/delFunc');

/** POST 7、函数管理-修改函数 */
// TODO 数据怎么加密？
export const updateFunc = addAPIPrefix('/qc/autotest/updateFunc');

/** GET 8、函数管理-获取函数内容 */
export const getFunc = addAPIPrefix('/qc/autotest/getFunc');

/** GET 9、函数管理-函数列表 */
// TODO 返回数据中没有分页信息
export const funcList = addAPIPrefix('/qc/autotest/funcList');
