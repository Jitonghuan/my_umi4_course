// 日志告警接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:24

import { addAPIPrefix } from '@/utils';

export const getEnvList = addAPIPrefix('/logManage/logSearch/env');

export const getMonitorList = addAPIPrefix('/logManage/alertrule/list');

export const getAppList = addAPIPrefix('/appManage/list');
