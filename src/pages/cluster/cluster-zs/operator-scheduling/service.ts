/**
 * @description: 集群流量切换接口
 * @name {muxi.jth}
 * @time {2021/12/1 10:33}
 */
import { addAPIPrefix } from '@/utils';

// 集群维度流量调度通用接口
export const switchCluster = addAPIPrefix('/opsManage/multiple/common/switchCluster');
// A、B集群用户和操作员查询
export const listClusterUser = addAPIPrefix('/opsManage/multiple/common/getMultipleClusterUser');
// A、B集群患或操作员新增
export const addMultipleClusterUser = addAPIPrefix('/opsManage/multiple/common/MultipleClusterByUser');
// A、B集群患或操作员删除

// 操作日志查询查询
