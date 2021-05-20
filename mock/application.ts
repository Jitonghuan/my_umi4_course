const mockTableData = [
  {
    id: 1,
    appCode: 'appCode',
    appName: '应用名称',
    appType: 'frontend',
    owner: '8号',
    belong: 'gmc',
    categoryName: '医共体',
    createUser: '王安楠',
    modifyUser: '王安楠',
    gmtCreate: '2021-04-08T15:22:56.695415+08:00',
    gmtModify: '2021-04-08T15:22:56.695418+08:00',
  },
  {
    id: 2,
    appCode: 'appCode',
    appName: '应用名称',
    appType: 'backend',
    owner: '8号',
    belong: 'g3a',
    categoryName: '三甲',
    createUser: '王安楠',
    modifyUser: '王安楠',
    gmtCreate: '2021-04-08T15:22:56.695415+08:00',
    gmtModify: '2021-04-08T15:22:56.695418+08:00',
  },
];

export default {
  // 查询应用列表
  [`GET /v1/appManage/list`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: mockTableData,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 20,
      },
    },
  },
  // 新建应用
  [`POST /v1/appManage/create`]: {
    code: 1000,
    success: false,
    errorMsg: 'application is exist',
    data: {
      id: 1,
      categoryCode: 'gmc',
      categoryName: '医共体',
      createUser: '王安楠',
      modifyUser: '王安楠',
      gmtCreate: '2021-04-08T15:22:56.695415+08:00',
      gmtModify: '2021-04-08T15:22:56.695418+08:00',
    },
  },
  // 编辑应用
  [`PUT /v1/appManage/update`]: {
    code: 1000,
    success: true,
    errorMsg: '',
    data: {
      id: 1,
      categoryCode: 'gmc',
      categoryName: '医共体',
      createUser: '王安楠',
      modifyUser: '王安楠',
      gmtCreate: '2021-04-08T15:22:56.695415+08:00',
      gmtModify: '2021-04-08T15:22:56.695418+08:00',
    },
  },
  // 成员
  [`GET /v1/appManage/member/list`]: {
    code: 1000,
    success: true,
    errorMsg: '',
    data: {
      id: 1,
      appCode: 'gmc',
      owner: 'gmc',
      categoryName: '医共体',
      createUser: '王安楠',
      modifyUser: '王安楠',
      gmtCreate: '2021-04-08T15:22:56.695415+08:00',
      gmtModify: '2021-04-08T15:22:56.695418+08:00',
    },
  },
};
