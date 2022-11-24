// api list
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/11/24 10:37
// https://come-future.yuque.com/sekh46/bbgc7f/vlkirb#oRCTM

import { addAPIPrefix } from '@/utils';

/** GET 流量地图 */
export const trafficMap = addAPIPrefix('/opsManage/multiple/map');

/** POST 集群维度流量调度通用接口 */
export const switchCluster = addAPIPrefix('/opsManage/multiple/common/switchCluster');

/** GET 操作日志查询 */
export const queryOperateLog = addAPIPrefix('/opsManage/multiple/queryOperateLog');

/** GET 集群应用比对 */
export const diffClusterApp = addAPIPrefix('/opsManage/k8s/multiple/diffClusterApp');

/** GET 集群应用同步查询 */
export const queryClusterApp = addAPIPrefix('/opsManage/k8s/multiple/queryClusterApp');

/** POST 集群应用同步 */
export const syncClusterApp = addAPIPrefix('/opsManage/k8s/multiple/syncClusterApp');

/** GET Nacos配置比对 */
export const configDiff = addAPIPrefix('/opsManage/k8s/multiple/configDiff');

/** POST Nacos同步 */
export const syncConfig = addAPIPrefix('/opsManage/k8s/multiple/syncConfig');

/** GET XXL-Job比对 */
export const xxlJobDiff = addAPIPrefix('/opsManage/k8s/multiple/xxlJobDiff');

/** POST XXL-Job同步 */
export const syncXxlJob = addAPIPrefix('/opsManage/k8s/multiple/syncXxlJob');

/** POST 前端资源同步 */
export const syncFrontendSource = addAPIPrefix('/opsManage/k8s/multiple/syncFrontendSource');

/** GET 集群同步完成 */
export const syncClusterOver = addAPIPrefix('/opsManage/k8s/multiple/syncClusterOver');

/** GET 任务状态查询 */
export const querySyncState = addAPIPrefix('/opsManage/k8s/multiple/querySyncState');

/** GET 获取天台应用列表 */
export const queryAppList = addAPIPrefix('/opsManage/k8s/multiple/queryAppList');

/** POST 集群同步-单应用比对 */
export const singleDiffApp = addAPIPrefix('opsManage/k8s/multiple/diffApp');

/** POST 集群同步-单应用同步 */
export const syncSingleApp = addAPIPrefix('/opsManage/k8s/multiple/syncSingleApp');

/** GET 获取 dashboard 页面地址 */
export const getDashboardUrl = addAPIPrefix('/opsManage/multiple/getDashboardUrl');

/** GET 获取 获取院区列表 */
export const getHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/getHospitalDistrictInfo');

/** GET 前端集群同步 - 获取前端应用 */
export const getAppList = addAPIPrefix('/appManage/list');

/** GET 前端集群同步 - 前端单应用比对 */
export const diffFeSingleApp = addAPIPrefix('/opsManage/k8s/multiple/diffFeApp');

/** POST 前端集群同步 - 前端单应用同步 */
export const syncSingleFeApp = addAPIPrefix('/opsManage/k8s/multiple/syncFeSingleApp');

/** GET 项目环境 */
export const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');

/** POST 新增机构信息 */
export const addHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/addHospitalDistrictInfo');

/** POST 编辑机构信息 */
export const updateHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/updateHospitalDistrictInfo');

/** POST 编辑机构信息 */
export const deleteHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/deleteHospitalDistrictInfo');
