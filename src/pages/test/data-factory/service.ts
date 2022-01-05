// 数据工厂相关接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/14 14:51
// @see https://come-future.yuque.com/sekh46/bbgc7f/gvbhuh

import { addAPIPrefix } from '@/utils';

/** GET 数据列表查询*/
export const queryData = addAPIPrefix('/qc/dataFactory/queryData');

/** POST 数据生成接口*/
export const createData = addAPIPrefix('/qc/dataFactory/createData');

/** GET 数据模板查询 */
export const queryDataFactory = addAPIPrefix('/qc/dataFactory/queryDataFactory');

/** POST 创建数据模板 */
export const createDataFactory = addAPIPrefix('/qc/dataFactory/create');

/** POST 更新数据模板 */
export const updateDataFactory = addAPIPrefix('/qc/dataFactory/update');

/** POST 调试数据模板 */
export const debugTemplate = addAPIPrefix('/qc/dataFactory/debugTemplate');

/** POST 删除数据模板 */
export const delDataFactory = addAPIPrefix('/qc/dataFactory/delete');

/** GET 查询模板造数记录 */
export const getRecords = addAPIPrefix('/qc/dataFactory/getRecords');

/** GET 查询造数日志 */
export const getInstanceList = addAPIPrefix('/qc/dataFactory/getInstanceList');

/** POST 复制数据模板 */
export const copyDataFactory = addAPIPrefix('/qc/dataFactory/copyTemplate');
