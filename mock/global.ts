export default {
  // 所属数据
  'GET /v1/orgManage/belong/list': {
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
  'GET /v1/orgManage/env/list': {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1,
          lineCode: 'cis',
          sysCode: 'cis',
          sysName: 'cis',
          belong: 'g3a',
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T15:22:56.695415+08:00',
          gmtModify: '2021-04-08T15:22:56.695418+08:00',
        },
        {
          id: 2,
          lineCode: 'cis',
          sysCode: 'cis',
          sysName: 'cis',
          belong: 'g3a',
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
  'GET /v1/orgManage/buLine/list': {
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
