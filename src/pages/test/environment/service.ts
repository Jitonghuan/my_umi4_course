// 环境管理相关接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/27 09:21
// @see https://come-future.yuque.com/sekh46/bbgc7f/vunnok#HNWBj

import { addAPIPrefix } from '@/utils';

/** GET 0、获取应用管理 */
export const envCodeList = addAPIPrefix('/appManage/env/list');

/** POST 1、环境管理-新增环境 */
export const addEnv = addAPIPrefix('/qc/autotest/addEnv');

/** POST 2、环境管理-更新环境 */
export const updateEnvInfo = addAPIPrefix('/qc/autotest/updateEnvInfo');

/** GET 3、环境管理-查询环境（未使用，环境列表返回数据已经是完整的） */
export const getEnvInfo = addAPIPrefix('/qc/autotest/getEnvInfo');

/** GET 4、环境管理-环境列表 */
export const envList = addAPIPrefix('/qc/autotest/envList');
