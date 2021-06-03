export default {
  // 用例集组查询接口
  'GET /v1/qc/autotest/queryTestCaseGroup': {
    success: true,
    data: [
      {
        preGroupName: 'CIS',
        groups: [
          {
            groupCode: '0',
            groupName: 'nurse',
          },
          {
            groupCode: '1',
            groupName: 'doctor',
          },
        ],
      },
      {
        preGroupName: 'MIS',
        groups: [
          {
            groupCode: '2',
            groupName: 'billing',
          },
        ],
      },
    ],
  },

  // 自动化测试接口
  'GET /v1/qc/autotest/queryTestCase': (req, res) => {
    res.send({
      success: true,
      data: {
        dataSource: [
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
        pageInfo: {
          pageIndex: Number(req.query.pageIndex),
          pageSize: 10,
          total: 200,
        },
      },
    });
  },

  // 自动化测试创建接口
  'POST /v1/qc/autotest/create': {
    success: true,
  },

  // 自动化测试结果查询
  'GET /v1/qc/autotest/queryTestResult': (req, res) => {
    res.send({
      success: true,
      data: {
        pageInfo: {
          pageIndex: Number(req.query.pageIndex),
          pageSize: 10,
          total: 200,
        },
        dataSource: [
          {
            id: '1',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 1,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
          {
            id: '2',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 2,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 2,
          },
          {
            id: '3',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
          {
            id: '4',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
          {
            id: '5',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
          {
            id: '6',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
          {
            id: '7',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },

          {
            id: '8',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
          {
            id: '9',
            name: '预住院患者入院申请单新增',
            group: '/cis/nurse',
            status: 3,
            env: 'poc',
            business: 'gmc',
            startTime: '2021-01-22 22:10:33',
            endTime: '2021-01-22 23:10:33',
            passNum: '5',
            failNum: '5',
            skipNum: '5',
            errorNum: '5',
            buildType: 1,
          },
        ],
      },
    });
  },
};
