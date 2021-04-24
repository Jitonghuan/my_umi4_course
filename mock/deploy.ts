export default {
  // 查看部署
  [`POST /v1/releaseManage/deploy/list`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1361,
          appName: 'cops-appmanagement',
          env: 'prod',
          releaseBranch: 'release_prod_1619077800',
          features:
            'feature_lilan-test02_1619077500,feature_lilan-test01_1619074868,feature_xiugai-git-03_1617776419,feature_xiugai-lilan-git_1617776361',
          unMergeFeatures: 'feature_xiugai-lilan-git_1617776361',
          conflictFeature: 'feature_xiugai-git-03_1617776419',
          mergeWebUrl:
            'http://gitlab.cfuture.shop/devops/cops-appmanagement/-/merge_requests/1511',
          deployStatus: 'mergeErr',
          hospitals: 'tiantai,weishan',
          deployedHospitals: '',
          deployingHospital: 'tiantai',
          deployingHosBatch: 1,
          tagName: 'v20210422155029',
          jenkinsUrl: '',
          isClient: 0,
          isFrontend: 0,
          createUser: '李澜',
          modifyUser: '聂强',
          gmtCreate: '2021-04-22 15:50:08',
          gmtModify: '2021-04-23 11:07:42',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 20,
      },
    },
  },
  // 查看feature部署情况
  [`GET /v1/releaseManage/branch/featureDeployed`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      deployed: [
        {
          id: 1694,
          createUser: '李澜',
          modifyUser: '李澜',
          gmtCreate: '2021-04-22 15:01:14',
          gmtModify: '2021-04-23 11:21:08',
          projectName: 'cops-appmanagement',
          branchName: 'feature_lilan-test01_1619074868',
          branchEnv: 'feature',
          deployedEnv: 'test,prod,dev',
          desc: '测试',
        },
        {
          id: 1692,
          createUser: '李澜',
          modifyUser: '李澜',
          gmtCreate: '2021-04-07 14:20:26',
          gmtModify: '2021-04-23 11:21:08',
          projectName: 'cops-appmanagement',
          branchName: 'feature_xiugai-git-03_1617776419',
          branchEnv: 'feature',
          deployedEnv: 'prod,dev',
          desc: '',
        },
        {
          id: 1691,
          createUser: '李澜',
          modifyUser: '李澜',
          gmtCreate: '2021-04-07 14:19:27',
          gmtModify: '2021-04-23 11:21:08',
          projectName: 'cops-appmanagement',
          branchName: 'feature_xiugai-lilan-git_1617776361',
          branchEnv: 'feature',
          deployedEnv: 'prod,dev',
          desc: '',
        },
      ],
      unDeployed: [
        {
          id: 1702,
          createUser: '李澜',
          modifyUser: '李澜',
          gmtCreate: '2021-04-22 15:45:15',
          gmtModify: '2021-04-23 11:21:53',
          projectName: 'cops-appmanagement',
          branchName: 'feature_lilan-test02_1619077500',
          branchEnv: 'feature',
          deployedEnv: 'prod',
          desc: '',
        },
      ],
    },
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
