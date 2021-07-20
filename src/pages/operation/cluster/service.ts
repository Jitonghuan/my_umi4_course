// 双集群管理相关接口
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/16 16:30

import { addAPIPrefix } from '@/utils';

/** POST 0、流量调度 */
export const clusterSwitch = addAPIPrefix('/opsManage/multiple/switch');

/** GET 1、集群同步-查询状态 */
export const deployState = addAPIPrefix('/v1/opsManage/multiple/deployState');

/** POST 2、集群同步-MQ同步 */
export const MQDeploy = addAPIPrefix('/v1/opsManage/multiple/MQDeploy');

/** POST 3、集群同步-配置同步 */
export const serverDeploy = addAPIPrefix('/v1/opsManage/multiple/configServerDeploy');

/** POST 4、集群同步-应用同步 */
export const appDeploy = addAPIPrefix('/v1/opsManage/multiple/appDeploy');

/** POST 5、集群同步-前端同步 */
export const frontDeploy = addAPIPrefix('/v1/opsManage/multiple/frontendDeploy');

///** GET 6、集群同步-流量地图 */
export const clusterMap = addAPIPrefix('/opsManage/multiple/map');
