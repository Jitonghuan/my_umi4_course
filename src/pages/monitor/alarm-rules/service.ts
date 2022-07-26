/*
 * @Author: muxi.jth
 * @Date: 2021-12-27 14:57:56
 * @LastEditTime: 2021-12-27 16:02:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/logger/alarm-rules/service.ts
 */

import { addAPIPrefix } from '@/utils';

export const getEnvList = addAPIPrefix('/logManage/logSearch/env');

export const getEnvListByAppCode = addAPIPrefix('/monitorManage/app/env');

export const getMonitorList = addAPIPrefix('/logManage/alertrule/list');

export const getAppList = addAPIPrefix('/appManage/list');
/** GET 集群环境查询 */
export const getEnvCodeList = addAPIPrefix('/monitorManage/rules/envCodeList');

export const ruleCheckName = addAPIPrefix('/logManage/alertrule/checkName');
