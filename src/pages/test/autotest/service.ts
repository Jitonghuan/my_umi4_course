// 自动化测试相关接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/27 09:21
// 二期接口 https://come-future.yuque.com/sekh46/bbgc7f/vunnok#HNWBj
// 三期接口 https://come-future.yuque.com/sekh46/bbgc7f/bg8qyo

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

/** POST 5、函数管理-新增函数 */
export const addFunc = addAPIPrefix('/qc/autotest/addFunc');

/** POST 6、函数管理-删除函数 */
export const delFunc = addAPIPrefix('/qc/autotest/delFunc');

/** POST 7、函数管理-修改函数 */
export const updateFunc = addAPIPrefix('/qc/autotest/updateFunc');

/** GET 8、函数管理-获取函数内容 */
export const getFunc = addAPIPrefix('/qc/autotest/getFunc');

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
export const getAppList = addAPIPrefix('/qc/others/app/search');

// -------------- 三期接口 ----------------

/** POST 1、场景管理-新增场景节点 */
export const addSceneNode = addAPIPrefix('/qc/autotest/addSceneNode');

/** POST 2、场景管理-更新场景节点 */
export const updateSceneNode = addAPIPrefix('/qc/autotest/updateSceneNode');

/** POST 3、场景管理-更新场景用例 */
export const updateSceneCases = addAPIPrefix('/qc/autotest/updateSceneCases');

/** POST 4、场景管理-复制场景 */
export const copyScene = addAPIPrefix('/qc/autotest/copyScene');

/** GET 5、场景管理-查询当前项目下的模块列表 */
export const getModulesByPro = addAPIPrefix('/qc/autotest/getModulesByPro');

/** GET 6、场景管理-查询场景列表, type = 3 的时候是获取用例列表 */
export const getSceneList = addAPIPrefix('/qc/autotest/getSceneList');

/** GET 7、场景管理-查询场景目录树 */
export const getSceneTree = addAPIPrefix('/qc/autotest/getSceneTree');

/** POST 8、场景管理-场景执行 */
export const executeScene = addAPIPrefix('/qc/autotest/executeScene');

/** POST 9、任务管理-新建任务 */
export const addTask = addAPIPrefix('/qc/autotest/addTask');

/** POST 10、任务管理-修改任务 */
export const updateTask = addAPIPrefix('/qc/autotest/updateTask');

/** POST 11、任务管理-删除任务 */
export const deleteTask = addAPIPrefix('/qc/autotest/deleteTask');

/** GET 12、任务管理-任务列表 */
export const getTaskList = addAPIPrefix('/qc/autotest/getTaskList');

/** GET 13、任务管理-任务详情 */
export const getTaskDetail = addAPIPrefix('/qc/autotest/getTaskDetail');

/** POST 14、任务管理-执行任务 */
export const executeTask = addAPIPrefix('/qc/autotest/executeTask');

/** GET 15、执行记录-报告列表 */
export const getRecordList = addAPIPrefix('/qc/autotest/getRecordList');

/** GET 16、执行记录-查询报告目录树 */
export const getReportTree = addAPIPrefix('/qc/autotest/getReportTree');

/** GET 17、执行记录-查询报告详情 */
export const getReportDetail = addAPIPrefix('/qc/autotest/getReportDetail');

/** GET 18、看板统计-最近一次任务执行情况 */
export const statisticOfLastRun = addAPIPrefix('/qc/autotest/statisticOfLastRun');

/** GET 19、看板统计-用例数据统计 */
export const statisticOfCaseData = addAPIPrefix('/qc/autotest/statisticOfCaseData');

/** GET 20、看板统计-任务近7天执行情况 */
export const statisticOfNearly7Days = addAPIPrefix('/qc/autotest/statisticOfNearly7Days');

/** GET 21、看板统计-近一月用例新增情况 */
export const statisticOfNewCase = addAPIPrefix('/qc/autotest/statisticOfNewCase');

/** POST 22、场景管理-删除场景 */
export const deleteScene = addAPIPrefix('/qc/autotest/deleteScene');

/** POST 23、场景管理-判断该用例是否被其他场景引用 */
export const caseHasUsedByScene = addAPIPrefix('/qc/autotest/caseHasUsedByScene');

/** GET 24、任务管理-查询所有项目下场景/用例 集合 */
export const getProjectsSuiteTree = addAPIPrefix('/qc/autotest/getProjectsSuiteTree');

// -------------- 迭代 1 接口 ----------------

/** POST 5、SQL管理-新增SQL */
export const addSql = addAPIPrefix('/qc/autotest/addSql');

/** POST 6、SQL管理-删除SQL */
export const deleteSql = addAPIPrefix('/qc/autotest/deleteSql');

/** POST 7、SQL管理-修改SQL */
export const modifySql = addAPIPrefix('/qc/autotest/modifySql');

/** GET 8、SQL管理-获取SQL内容 */
export const getSqlInfo = addAPIPrefix('/qc/autotest/getSqlInfo');

/** GET 9、SQL管理-SQL列表 */
export const getSqlList = addAPIPrefix('/qc/autotest/getSqlList');

/** GET 9、SQL管理-SQL和函数列表 */
export const getFuncSqlList = addAPIPrefix('/qc/autotest/getFuncSqlList');

/** POST YML转CASE */
export const ymlToCase = addAPIPrefix('/qc/autotest/ymlToCase');

/** POST CASE转YML */
export const caseToYml = addAPIPrefix('/qc/autotest/caseToYml');

/** POST 调试测试用例 */
export const debugYml = addAPIPrefix('/qc/autotest/debugYml');

/** POST 调试测试用例 */
export const getPreSavedVars = addAPIPrefix('/qc/autotest/getPreSavedVars');

/** POST 批量复制 */
export const copyCases = addAPIPrefix('/qc/autotest/copyCases');

/** POST 复制API */
export const copyApi = addAPIPrefix('/qc/autotest/copyApi');

/** GET 获取模块树 */
export const getModules = addAPIPrefix('/qc/autotest/getModules');

// 批量获取前置用例信息
export const getCaseInfoBatch = addAPIPrefix('/qc/autotest/getCaseInfoBatch');
