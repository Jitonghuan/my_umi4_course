// api list
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:37
// https://come-future.yuque.com/sekh46/bbgc7f/dnkgfm

import { addAPIPrefix } from '@/utils';

/** GET 流量地图 */
export const trafficMap = addAPIPrefix('/opsManage/multiple/map');

/** POST 流量调度 */
export const trafficScheduling = addAPIPrefix('/opsManage/multiple/switch');

/** GET 集群同步-单应用对比 */
export const singleAppDiff = addAPIPrefix('/opsManage/multiple/appDiff');

/** POST 集群同步-单应用发布 */
export const singleAppDeploy = addAPIPrefix('/opsManage/multiple/appDeploy');

/** GET 集群同步-MQ对比 */
export const mqDiff = addAPIPrefix('/opsManage/multiple/mqDiff');

/** POST 集群同步-MQ Topic同步 */
export const deployTopic = addAPIPrefix('/opsManage/multiple/deployTopic');

/** POST 集群同步-MQ Group同步 */
export const deployGroup = addAPIPrefix('/opsManage/multiple/deployGroup');

/** GET 集群同步-配置对比 */
export const configServerDiff = addAPIPrefix('/opsManage/multiple/configServerDiff');

/** POST 集群同步-配置同步 */
export const configServerDeploy = addAPIPrefix('/opsManage/multiple/configServerDeploy');

/** POST 集群同步-应用同步 */
export const appDeploy = addAPIPrefix('/opsManage/multiple/deployClusterApp');

/** GET 集群同步-集群应用发布查询 */
export const queryClusterApp = addAPIPrefix('/opsManage/multiple/queryClusterApp');

/** POST 集群同步-前端资源同步 */
export const frontendSourceDeploy = addAPIPrefix('/opsManage/multiple/frontendSourceDeploy');

/** GET 集群同步-获取前端资源同步状态 */
export const queryFrontendSource = addAPIPrefix('/opsManage/multiple/queryFrontendSource');

/** POST 集群同步-前端版本同步 */
export const frontendVersionDeploy = addAPIPrefix('/opsManage/multiple/frontendVersionDeploy');

/** POST 集群同步-完成同步 */
export const clusterDeployOver = addAPIPrefix('/opsManage/multiple/clusterDeployOver');

/** GET 集群应用比对 */
export const diffClusterApp = addAPIPrefix('/opsManage/multiple/diffClusterApp');

/** GET 任务状态查询 */
export const queryWorkState = addAPIPrefix('/opsManage/multiple/queryWorkState');

/** GET 获取浙一应用列表 */
export const queryAppList = addAPIPrefix('/opsManage/multiple/queryAppList');

/** GET 操作日志 */
export const queryOperateLog = addAPIPrefix('/opsManage/multiple/queryOperateLog');

/** GET 获取 dashboard 页面地址 */
export const getDashboardUrl = addAPIPrefix('/opsManage/multiple/getDashboardUrl');
