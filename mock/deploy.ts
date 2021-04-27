export default {
  // 查看部署
  [`GET /v1/releaseManage/deploy/list`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 8,
          appCode: 'Matrix-lilan-behind',
          env: 'test',
          releaseBranch: 'release_test_2021042745455321',
          features:
            'feature_lilan_2021042745285621,feature_李澜_2021042745284521',
          unMergedFeatures: '',
          conflictFeature: 'feature_李澜_2021042745284521',
          mergeWebUrl:
            'http://gitlab.cfuture.shop/devops/cops-appmanagement/-/merge_requests/1525',
          deployStatus: 'conflict',
          hospitals: '',
          deployedHospitals: '',
          deployingHospital: '',
          deployingHosBatch: 0,
          tagName: '',
          jenkinsUrl: '',
          image: '',
          jarName: '',
          deployedTime: '',
          isClient: 0,
          isActive: 1,
          createUser: '李澜',
          modifyUser: 'matrix',
          gmtCreate: '2021-04-27T17:46:01+08:00',
          gmtModify: '2021-04-27T17:49:30+08:00',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 1,
      },
    },
  },
  // 查看feature部署情况
  [`GET /v1/releaseManage/branch/featureDeployed`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: [
      {
        id: 25,
        appCode: 'Matrix-lilan-behind',
        branchName: 'feature_lilan-test02_2021042743161621',
        branchEnv: 'feature',
        deployedEnv: 'dev,prod',
        desc: '测试',
        createUser: '李澜',
        modifyUser: '李澜',
        gmtCreate: '2021-04-27T15:16:32+08:00',
        gmtModify: '2021-04-27T15:30:23+08:00',
      },
      {
        id: 23,
        appCode: 'Matrix-lilan-behind',
        branchName: 'feature_lilan-test01_2021042742071221',
        branchEnv: 'feature',
        deployedEnv: 'dev,prod',
        desc: '',
        createUser: '李澜',
        modifyUser: '李澜',
        gmtCreate: '2021-04-27T14:07:20+08:00',
        gmtModify: '2021-04-27T15:30:23+08:00',
      },
    ],
  },
  // 创建部署
  [`POST /v1/releaseManage/deploy/create`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      id: 23,
      projectName: 'cops-appmanagement',
      env: 'dev',
      releaseBranch: 'release_dev_1608195809',
      features: '["test_123","test_456"]',
      unMergeFeatures: '["test_123","test_456"]', //未合并分支
      conflictFeature: '', //产生冲突的分支
      deployStatus: 'merging', //merging合并分支中,conflict有冲突，deploying发布中，deployed发布完成
      hospitals: '', //需要部署的医院  发到prod环境时，必须要带上
      deployedHospitals: '', //已经部署的医院
      createUser: '王安楠',
      modifyUser: '王安楠',
      gmtCreate: '2020-12-17 17:03:31',
      gmtModify: '2020-12-17 17:03:31',
      isClient: 0,
      isFrontend: 0,
    },
  },
  // 重试合并
  [`POST /v1/releaseManage/merge/retry`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },
  // 重新部署
  [`POST /v1/releaseManage/deploy/reDeploy`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },
  // 生产环境确认部署和继续部署
  [`POST /v1/releaseManage/deploy/confirmProd`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {},
  },
};
