// 双集群管理相关接口
// 接口文档  https://come-future.yuque.com/sekh46/bbgc7f/dnkgfm#J4UiL
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/16 16:30

import { addAPIPrefix } from '@/utils';

/** POST 0、流量调度 */
export const clusterSwitch = addAPIPrefix('/opsManage/multiple/switch');

/** GET 1、集群同步-查询状态 */
export const deployState = addAPIPrefix('/opsManage/multiple/deployState');

/** POST 2、集群同步-MQ对比 */
export const MqDiff = addAPIPrefix('/opsManage/multiple/MqDiff');

/** POST 3、集群同步-MQ同步 */
export const MQDeploy = addAPIPrefix('/opsManage/multiple/MQDeploy');

/** GET 4、集群同步-配置对比 */
export const ServerDif = addAPIPrefix('/opsManage/multiple/configServerDiff');

/** POST 5、集群同步-配置同步 */
export const serverDeploy = addAPIPrefix('/opsManage/multiple/configServerDeploy');

/** POST 6、集群同步-应用同步 */
export const appDeploy = addAPIPrefix('/opsManage/multiple/appDeploy');

/** POST 7、集群同步-前端资源同步 */
export const frontSource = addAPIPrefix('/v1/opsManage/multiple/frontendSourceDeploy');

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
