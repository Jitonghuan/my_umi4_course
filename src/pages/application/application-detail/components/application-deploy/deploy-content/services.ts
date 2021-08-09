// services
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/09 09:32

import { addAPIPrefix } from '@/utils';

/** GET 获取应用运行和变更状态 */
export const queryApplicationStatus = addAPIPrefix('/releaseManage/queryApplicationStatus');

/** GET 获取发布版本历史列表 */
export const queryHistoryVersions = addAPIPrefix('/releaseManage/queryHistoryVersions');

/** POST 发布回滚 */
export const rollbackApplication = addAPIPrefix('/releaseManage/rollbackApplication');

/** POST 应用重启 */
export const restartApplication = addAPIPrefix('/releaseManage/restartApplication');
