// 用例管理相关接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/27 09:21
// @see https://come-future.yuque.com/sekh46/bbgc7f/vunnok#HNWBj

import { addAPIPrefix } from '@/utils';

/** GET 9、函数管理-函数列表 */
export const funcList = addAPIPrefix('/qc/autotest/funcList');

/** POST 10、用例管理-新增项目 */
export const addProject = addAPIPrefix('/qc/autotest/addProject');

/** POST 11、用例管理-修改项目 */
export const updateProject = addAPIPrefix('/qc/autotest/updateProject');

/** POST 12、用例管理-新增模块 */
export const addModule = addAPIPrefix('/qc/autotest/addModule');

/** POST 13、用例管理-修改模块 */
export const updateModule = addAPIPrefix('/qc/autotest/updateModule');

/** POST 14、用例管理-新增接口 */
export const addApi = addAPIPrefix('/qc/autotest/addApi');

/** POST 15、用例管理-更新接口 */
export const updateApi = addAPIPrefix('/qc/autotest/updateApi');

/** GET 16、用例管理-查询接口信息 */
export const getApiInfo = addAPIPrefix('/qc/autotest/getApiInfo');

/** GET 17、用例管理-查询接口目录树 */
export const getApiTree = addAPIPrefix('/qc/autotest/getApiTree');

/** POST 18、用例管理-保存用例 */
export const saveCaseInfo = addAPIPrefix('/qc/autotest/saveCaseInfo');

/** GET 19、用例管理-查询用例详情 */
export const getCaseInfo = addAPIPrefix('/qc/autotest/getCaseInfo');

/** GET 20、用例管理-查询用例列表 */
export const getCaseList = addAPIPrefix('/qc/autotest/getCaseList');

/** POST 21、用例管理-目录树节点删除 (type 0 项目、1 模块、2 接口) */
export const deleteApiTreeNode = addAPIPrefix('/qc/autotest/deleteApiTreeNode');

/** POST 22、用例管理-用例删除 */
export const deleteCaseById = addAPIPrefix('/qc/autotest/deleteCaseById');

/** POST 23、用例管理-用例执行 */
export const runCaseByIds = addAPIPrefix('/qc/autotest/runCaseByIds');

/** POST 24、用例管理-前置/后置用例查询 */
export const getPreCaseList = addAPIPrefix('/qc/autotest/getPreCaseList');

/** POST 25、用例管理-更新用例 */
export const updateCaseInfo = addAPIPrefix('/qc/autotest/updateCaseInfo');

/** GET 26、用例管理-项目列表 */
export const getProjects = addAPIPrefix('/qc/autotest/getProjects');

/** GET 27、查看应用列表 {  } */
export const getAppList = addAPIPrefix('/appManage/list');
