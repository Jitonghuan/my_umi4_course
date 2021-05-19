export default {
  // 所属数据
  'GET /v1/appManage/category/list': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1,
          belongCode: 'gmc',
          belongName: '医共体',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
        {
          id: 2,
          belongCode: 'g3a',
          belongName: '三甲',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        total: 2,
      },
    },
  },

  // 环境接口
  'GET /v1/appManage/env/list': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1,
          envCode: 'dev',
          envName: '开发环境',
          belongId: 'g3a',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
        {
          id: 2,
          envCode: 'test',
          envName: '测试环境',
          belongId: 'g3a',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
        {
          id: 2,
          envCode: 'prod',
          envName: '生产环境',
          belongId: 'g3a',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        total: 2,
      },
    },
  },

  // 业务线接口
  'GET /v1/appManage/group/list': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1,
          lineCode: 'cis',
          lineName: 'cis',
          lineLeader: '秋年',
          leaderPhone: '12345678901',
          belong: 'g3a',
          signature: '/home/static/img/qiunian.png',
          jiraId: 'SJXM-CIS',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
        {
          id: 2,
          lineCode: 'mis',
          lineName: 'mis',
          lineLeader: '秋年',
          leaderPhone: '12345678901',
          belong: 'g3a',
          signature: '/home/static/img/qiunian.png',
          jiraId: 'SJXM-CIS',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        total: 2,
      },
    },
  },
};
