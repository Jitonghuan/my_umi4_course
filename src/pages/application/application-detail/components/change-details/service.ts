import { addAPIPrefix } from '@/utils';

/** GET 0、查询应用变更次数 */
export const changeDetailList = addAPIPrefix('/appManage/changeDetail/list');

/** GET 1、查询应用文件修改排名 */
export const listRanking = addAPIPrefix('/appManage/changeDetail/fileChange/listRanking');

/** GET 2、查询应用文件修改人员排名 */
export const listUserRanking = addAPIPrefix('/appManage/changeDetail/fileChange/listUserRanking');
/** GET 3、查询应用文件修改人员排名 */

/** GET 获取环境名 */
export const envList = addAPIPrefix('/appManage/env/list');

/** GET 4、查询应用文件修改人员排名 */
