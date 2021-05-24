import ds from '@config/defaultSettings';

const origin = 'http://turing.cfuture.shop:8010';

/**
 * 查询左侧用例集数据
 * @param
 *    business 业务线
 */
export const queryAutoTextGroup = `${origin}${ds.apiPrefix}/qc/autotest/queryTestCaseGroup`;

/**
 * 自动化测试数据查询
 *
 * @param
 *    business 业务线
 *    searchText 搜索词
 *    preGroupName 用例集
 *    groupName 用例子集
 */
export const queryAutoTest = `${origin}${ds.apiPrefix}/qc/autotest/queryTestCase`;

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
export const createAutoTest = `${origin}${ds.apiPrefix}/qc/autotest/create`;

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
export const queryTestResult = `${origin}${ds.apiPrefix}/qc/autotest/queryTestResult`;

/** 添加质量控制任务 */
export const createQCTask = `${origin}${ds.apiPrefix}/qc/qualitycontrol/createQCTask`;

/** 查询质量控制任务列表*/
export const queryQCTaskList = `${origin}${ds.apiPrefix}/qc/qualitycontrol/queryQCTaskList`;

/** 执行检测任务 */
export const executeQCTask = `${origin}${ds.apiPrefix}/qc/qualitycontrol/executeQCTask`;

/** 查询单测覆盖检测记录列表*/
export const queryUnittestCoverCheckLogList = `${origin}${ds.apiPrefix}/qc/qualitycontrol/queryUnittestCoverCheckLogList`;

/** 查询代码质量检测记录列表*/
export const queryCodeQualityCheckLogList = `${origin}${ds.apiPrefix}/qc/qualitycontrol/queryCodeQualityCheckLogList`;

/** 数据工厂名称查询 */
export const queryDataFactoryName = `${origin}${ds.apiPrefix}/qc/dataFactory/queryDataFactory`;

/** 数据生成接口*/
export const createDataFactory = `${origin}${ds.apiPrefix}/qc/dataFactory/createData`;

/** 数据工厂列表查询*/
export const queryDataFactoryList = `${ds.apiPrefix}/qc/dataFactory/queryData`;
