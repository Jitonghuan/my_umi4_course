export default {
  // 查看最新版本的配置
  [`GET /v1/appManage/config/listLatest`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: {
        configs: [
          {
            id: 1,
            key: 'test1',
            value: 'this is for test1',
            appCode: 'cops-appmanagement',
            type: 'boot',
            env: 'dev',
            createUser: '王安楠',
            modifyUser: '王安楠',
            gmtCreate: '2021-04-08T16:04:36+08:00',
            gmtModify: '2021-04-08T16:04:36+08:00',
          },
          {
            id: 2,
            key: 'test2',
            value: 'this is for test2',
            appCode: 'cops-appmanagement',
            type: 'boot',
            env: 'dev',
            configVersions: null,
            createUser: '王安楠',
            modifyUser: '王安楠',
            gmtCreate: '2021-04-08T16:04:36+08:00',
            gmtModify: '2021-04-08T16:04:36+08:00',
          },
        ],
        version: {
          id: 1,
          appCode: 'cops-appmanagement',
          type: 'boot',
          env: 'dev',
          versionNumber: '2021040816043621',
          isLatest: 0,
          createUser: '王安楠',
          modifyUser: '王安楠',
          gmtCreate: '2021-04-08T16:04:36+08:00',
          gmtModify: '2021-04-08T16:04:36+08:00',
        },
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 20,
      },
    },
  },
};
