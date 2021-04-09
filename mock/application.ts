const mockTableData = [
  {
    id: 1,
    appName: 'appName',
    appType: 'appType',
    owner: 'owner',
  },
  {
    id: 2,
    appName: 'appName',
    appType: 'appType',
    owner: 'owner',
  },
  {
    id: 3,
    appName: 'appName',
    appType: 'appType',
    owner: 'owner',
  },
];

export default {
  // 查询应用列表
  [`POST /v1/application/list`]: {
    success: true,
    data: {
      dataSource: mockTableData,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 100,
      },
    },
  },
};
