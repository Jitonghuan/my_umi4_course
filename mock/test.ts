export default {
  // 用例集组查询接口

  // 自动化测试接口
  'GET /v1/qc/autotest/queryTestCase': {
    success: true,
    data: [
      {
        id: '1',
        caseName: 'emergencyTriage',
        groupName: '/cis/nurse',
        caseLabel: '用例标签',
      },
      {
        id: '2',
        caseName: 'emergencyTriage',
        groupName: '/cis/nurse',
        caseLabel: '用例标签',
      },
    ],
  },
};
