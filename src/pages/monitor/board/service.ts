/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-12 19:13:58
 */
import ds from '@config/defaultSettings';

/**
 * 获取机构列表
 */
export const queryEnvLists = `${ds.apiPrefix}/monitor/env/list`;

/**
 * 资源使用率
 */
export const queryResUseData = `${ds.apiPrefix}/monitor/resource/clusterTotal`;

/**
 * 节点使用率
 */
export const queryNodeUseData = `${ds.apiPrefix}/monitor/resource/node`;

/**
 * 已安装大盘
 */
export const queryUseMarketData = `${ds.apiPrefix}/monitor/grafana/dashboard/list`;
