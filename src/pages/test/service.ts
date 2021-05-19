import ds from '@config/defaultSettings';

/**
 * 查询左侧用例集数据
 * @param
 *    business 业务线
 */
export const queryAutoTextGroup = `${ds.apiPrefix}/qc/autotest/queryTestCaseGroup`;

/**
 * 自动化测试数据查询
 *
 * @param
 *    business 业务线
 *    searchText 搜索词
 *    preGroupName 用例集
 *    groupName 用例子集
 */
export const queryAutoTest = `${ds.apiPrefix}/qc/autotest/queryTestCase`;

/**
 * 自动化测试创建接口
 *
 * @param
 *    env 测试环境
 *    business 业务线
 *    preGroupName 用例集
 *    groupName 用例集名称
 *    caseList 测试用例 = [{ "groupName": "/cis/nurse", "caseName": "emergencyTriage" }]
 */
export const createAutoTest = `${ds.apiPrefix}/qc/autotest/create`;

/**
 * 自动化测试结果查询
 *
 * @param
 *    id
 *    startTime
 *    endTime
 *    business
 *    env
 *    result
 */
export const queryTestResult = `${ds.apiPrefix}/qc/autotest/queryTestResult`;

/** 添加质量控制任务 */
export const createQCTask = `${ds.apiPrefix}/qc/unittest/createQCTask`;

/** 查询质量控制任务列表*/
export const queryQCTaskList = `${ds.apiPrefix}/qc/unittest/queryQCTaskList`;

/** 执行检测任务 */
export const executeQCTask = `${ds.apiPrefix}/qc/unittest/executeQCTask`;

/** 查询单测覆盖检测记录列表*/
export const queryUnittestCoverCheckLogList = `${ds.apiPrefix}/qc/unittest/queryUnittestCoverCheckLogList`;

/** 查询代码质量检测记录列表*/
export const queryCodeQualityCheckLogList = `${ds.apiPrefix}/qc/codeQuality/queryCodeQualityCheckLogList`;
