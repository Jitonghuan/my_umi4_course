export default {
    'GET /v1/deliverManage/versionManage/list': {
  
      success: true,
      code: 1000,
      errorMsg: "",
      data: {
        dataSource: {
            configs: [
              {
                "id": 1197,
                "value": "key: value",
                "appCode": "hbos-dtc-demo",
                "envCode": "",
                "createUser": "",
                "modifyUser": "",
                "gmtCreate": "2021-10-11T15:45:36+08:00",
                "gmtModify": "2021-10-11T15:45:36+08:00"
              }
            ],
            version: {
              "id": 220,
              "appCode": "hbos-dtc-demo",
              "envCode": "hbos-dev",
              "versionNumber": "2021/1011/154536-3303",
              "isLatest": 0,
              "createUser": "姬同欢",
              "modifyUser": "姬同欢",
              "gmtCreate": "2021-10-11T15:45:36+08:00",
              "gmtModify": "2021-10-11T15:45:36+08:00"
            }
          },
          pageInfo: {
            "pageIndex": 1,
            "pageSize": 20,
            "total": 1
          }      
      }
      },
    };
  