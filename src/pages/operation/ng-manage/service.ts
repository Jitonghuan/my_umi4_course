import { addAPIPrefix } from '@/utils';

/** 查看实例 */
export const queryNgList = addAPIPrefix('/opsManage/ngInstance/list');
/** 新增实例 */
export const createNg = addAPIPrefix('/opsManage/ngInstance/create');
/** 更新实例 */
export const updateNg = addAPIPrefix('/opsManage/ngInstance/update');
