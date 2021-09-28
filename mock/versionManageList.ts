export default {
    'GET  /v1/deliverManage/deliverDeploy/list': {
      success: true,
      code: 1000,
      errorMsg: '',
      data: {  
        dataSource: [
          {
            "id": 4,
            "appCode": "hbos-sso",
            "appVersion": "1.0.0",
            "category": "HBOS",
            "deliverName": "hbos-sso",
            "deliverVersion":"release-1.0.0",
            "status": "2",
            "createUser": "东来",
            "modifyUser": "东来",
            "gmtCreate": "2021-04-14T17:15:42.344854+08:00",
            "gmtModify": "2021-04-14T17:15:42.344856+08:00"
            },
            {
            "id": 4,
            "appCode": "hbos-spc",
            "appVersion": "1.0.0",
            "category": "HBOS",
            "deliverName": "hbos-sso",
            "deliverVersion":"release-1.0.0",
            "status": "2",
            "createUser": "靳晓博",
            "modifyUser": "靳晓博",
            "gmtCreate": "2021-04-14T17:15:42.344854+08:00",
            "gmtModify": "2021-04-14T17:15:42.344856+08:00"
            }
        ],
        pageInfo: {
          pageIndex: 1,
          pageSize: 20,
          total: 2,
        },
      },
    },
  };
  