// api list
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:37

import { addAPIPrefix } from '@/utils';

/** POST 0、流量调度 */
export const clusterSwitch = addAPIPrefix('/opsManage/multiple/switch');

/** GET 1、集群同步-查询状态 */
export const deployState = addAPIPrefix('/opsManage/multiple/deployState');

/** POST 2、集群同步-MQ同步 */
export const MQDeploy = addAPIPrefix('/opsManage/multiple/MQDeploy');

/** POST 3、集群同步-配置同步 */
export const serverDeploy = addAPIPrefix('/opsManage/multiple/configServerDeploy');

/** POST 4、集群同步-应用同步 */
export const appDeploy = addAPIPrefix('/opsManage/multiple/appDeploy');

/** POST 5、集群同步-前端同步 */
export const frontDeploy = addAPIPrefix('/opsManage/multiple/frontendDeploy');

/** POST 7、集群同步-前端资源同步 */
export const frontSource = addAPIPrefix('/opsManage/multiple/frontendSourceDeploy');

///** POST 8、集群同步-前端资源同步 */
export const frontendVersion = addAPIPrefix('/opsManage/multiple/frontendVersionDeploy');

//** POST 9、应用同步 */
export const applySync = addAPIPrefix('/opsManage/multiple/appDeploy');

//** GET 10、应用比对 */
export const diffApp = addAPIPrefix('/opsManage/multiple/diffApp');

//** GET 11、 集群应用比对 */
export const diffClusterApp = addAPIPrefix('/opsManage/multiple/diffClusterApp');

//** GET 12、 操作日志 */
export const queryCluster = addAPIPrefix('/opsManage/multiple/log');
