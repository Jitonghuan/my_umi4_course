// 日志告警接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:24
// https://come-future.yuque.com/sekh46/bbgc7f/meg8ls#EEbQv

import { addAPIPrefix } from '@/utils';

export const getEnvList = addAPIPrefix('/logManage/logSearch/env');

export const getMonitorList = addAPIPrefix('/logManage/alertrule/list');

export const getAppList = addAPIPrefix('/appManage/list');

export const getAlertRule = addAPIPrefix('/logManage/alertrule/options/list');

export const createRule = addAPIPrefix('/logManage/alertrule/create');

/** PUT 更新告警 */
export const updateRule = addAPIPrefix('/logManage/alertrule/update');

/** DELETE 删除告警 */
export const deleteRule = addAPIPrefix('/logManage/alertrule/delete');

/** PUT 告警开关 */
export const switchRule = addAPIPrefix('/logManage/alertrule/switch');
