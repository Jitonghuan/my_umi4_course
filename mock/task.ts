export default {
  ['GET /v1/qc/autotest/getReportTree']: {
    code: 2000,
    data: {
      platform: {
        httprunner_version: '2.5.7',
        platform: 'Linux-3.10.0-957.21.3.el7.x86_64-x86_64-with-glibc2.17',
        python_version: 'CPython 3.8.3',
      },
      record_id: 164,
      report_tree: [
        {
          children: [
            {
              children: [
                {
                  belongId: 4,
                  children: [
                    {
                      caseId: 19,
                      name: '查询个人建档档案信息【可执行-勿删】',
                      success: false,
                    },
                  ],
                  errorTotal: 1,
                  failTotal: 1,
                  name: '查询个人档案信息',
                  successTotal: 0,
                },
              ],
              errorTotal: 1,
              failTotal: 1,
              moduleId: 9,
              name: '模块4',
              successTotal: 0,
            },
            {
              children: [
                {
                  belongId: 2,
                  children: [
                    {
                      caseId: 15,
                      name: '登录设置【可执行-勿删】',
                      success: false,
                    },
                  ],
                  errorTotal: 1,
                  failTotal: 1,
                  name: '登录设置',
                  successTotal: 0,
                },
                {
                  belongId: 1,
                  children: [
                    {
                      caseId: 14,
                      name: '登录测试用例【可执行-勿删】',
                      success: false,
                    },
                  ],
                  errorTotal: 1,
                  failTotal: 1,
                  name: '登录接口',
                  successTotal: 0,
                },
              ],
              errorTotal: 2,
              failTotal: 2,
              moduleId: 6,
              name: '模块1',
              successTotal: 0,
            },
          ],
          errorTotal: 3,
          failTotal: 3,
          name: '测试项目 【大佬别删】',
          projectId: 26,
          successTotal: 0,
        },
      ],
      stat: {
        testcases: {
          fail: 3,
          success: 0,
          total: 3,
        },
        teststeps: {
          errors: 3,
          expectedFailures: 0,
          failures: 2,
          skipped: 0,
          successes: 1,
          total: 6,
          unexpectedSuccesses: 0,
        },
      },
      success: false,
      time: {
        duration: 0.040825605392456055,
        start_at: 1625792791.2846951,
      },
    },
    success: true,
  },
};
