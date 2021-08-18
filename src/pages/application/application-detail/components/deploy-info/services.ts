// services
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/09 09:32
// https://modao.cc/app/5b7aabe3b24533a5d4e809c6ac218d37d2ae7f52?simulator_type=device&sticky#screen=skronwj7q4wih70

import { addAPIPrefix } from '@/utils';

/** GET 获取部署信息 */
export const queryDeployList = addAPIPrefix('/releaseManage/deploy/list');

/** 获取应用大类的环境列表 */
export const queryAppEnvs = addAPIPrefix('/monitorManage/app/env');

/** GET 获取应用运行和变更状态 */
export const queryApplicationStatus = addAPIPrefix('/releaseManage/queryApplicationStatus');

/** GET 获取发布版本历史列表 */
export const queryHistoryVersions = addAPIPrefix('/releaseManage/queryHistoryVersions');

/** POST 发布回滚 */
export const rollbackApplication = addAPIPrefix('/releaseManage/rollbackApplication');

/** POST 应用重启 */
export const restartApplication = addAPIPrefix('/releaseManage/restartApplication');

/** GET 获取应用变更记录列表 */
export const queryRecentChangeOrder = addAPIPrefix('/releaseManage/queryRecentChangeOrder');
