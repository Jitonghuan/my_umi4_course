import ds from '@config/defaultSettings';

/**
 * 查询左侧用例集数据
 */
export const queryAutoTextGroup = `${ds.apiPrefix}`;

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
