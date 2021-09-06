// SQL管理相关接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/27 09:21
// @see https://come-future.yuque.com/sekh46/bbgc7f/vunnok#HNWBj

import { addAPIPrefix } from '@/utils';

/** POST 5、SQL管理-新增SQL */
export const addSql = addAPIPrefix('/qc/autotest/addSql');

/** POST 6、SQL管理-删除SQL */
export const deleteSql = addAPIPrefix('/qc/autotest/deleteSql');

/** POST 7、SQL管理-修改SQL */
export const modifySql = addAPIPrefix('/qc/autotest/modifySql');

/** GET 8、SQL管理-获取SQL内容 */
export const getSqlInfo = addAPIPrefix('/qc/autotest/getSqlInfo');

/** GET 9、SQL管理-SQL列表 */
export const getSqlList = addAPIPrefix('/qc/autotest/getSqlList');
