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

  ['GET /v1/qc/autotest/getReportDetail']: {
    "success": true,
    "code": 2000,
    "data": [
      {
        "name": "据病区查询床位列表",
        "status": "success",
        "attachment": "",
        "meta_datas": {
          "name": "据病区查询床位列表",
          "data": [
            {
              "request": {
                "url": "http://tt-poc-his.seenew.info/app-sys-manage/bedManage/queryBedByArea",
                "method": "POST",
                "headers": "{\n  \"User-Agent\": \"python-requests/2.24.0\",\n  \"Accept-Encoding\": \"gzip, deflate\",\n  \"Accept\": \"*/*\",\n  \"Connection\": \"keep-alive\",\n  \"Authorization\": \"Bearer 5dde9870-a499-4c8f-8bb5-111c5c68811c\",\n  \"Content-Type\": \"application/json; charset=UTF-8\",\n  \"k1\": \"1\",\n  \"k2\": \"29531\",\n  \"webUrl\": \"http://gmc-test.cfuture.shop/basis/BedMaintain?k=1-99897828607-XN3142\",\n  \"Content-Length\": \"38\"\n}",
                "body": "{\n  &#34;areaId&#34;: &#34;29533&#34;,\n  &#34;locationType&#34;: 0\n}"
              },
              "response": {
                "ok": true,
                "url": "http://tt-poc-his.seenew.info/app-sys-manage/bedManage/queryBedByArea",
                "status_code": 200,
                "reason": "",
                "cookies": "{}",
                "encoding": "UTF-8",
                "headers": "{\n  \"Server\": \"nginx/1.18.0\",\n  \"Date\": \"Tue, 06 Jul 2021 08:30:47 GMT\",\n  \"Content-Type\": \"application/json;charset=UTF-8\",\n  \"Transfer-Encoding\": \"chunked\",\n  \"Connection\": \"keep-alive\",\n  \"traceid\": \"DUBBO-DEFAULT\",\n  \"Access-Control-Expose-Headers\": \"traceid\",\n  \"X-Application-Context\": \"app-sys-manage:tt-poc:8080\",\n  \"X-Content-Type-Options\": \"nosniff\",\n  \"X-XSS-Protection\": \"1; mode=block\",\n  \"Cache-Control\": \"no-cache, no-store, max-age=0, must-revalidate\",\n  \"Pragma\": \"no-cache\",\n  \"Expires\": \"0\",\n  \"X-Frame-Options\": \"DENY\"\n}",
                "content_type": "application/json;charset=UTF-8",
                "body": "{\n  \"code\": 2000,\n  \"message\": \"success\",\n  \"body\": {\n    \"bedInfoDTOS\": [\n      {\n        \"bedInfoId\": 2690878974305,\n        \"bedLocationId\": 997906,\n        \"bedNumber\": \"203189\",\n        \"areaId\": 29533,\n        \"areaName\": \"自动化测试病区\",\n        \"bedStatus\": 1,\n        \"bedUseStatus\": \"0\",\n        \"defaultBedTypeId\": 41,\n        \"nowBedTypeId\": 41,\n        \"sortNumber\": 1,\n        \"roomId\": 1007,\n        \"roomLocationId\": 29534,\n        \"roomNumber\": \"可乐\",\n        \"nowBedTypeName\": \"普通\",\n        \"genderLimit\": 0,\n        \"isolationState\": 0,\n        \"virtualBed\": 0,\n        \"frontTargetProperties\": 1\n      }\n    ],\n    \"bedCountDTO\": {\n      \"allNum\": 1,\n      \"occupyNum\": 0,\n      \"freeNum\": 1\n    }\n  }\n}"
              }
            }
          ],
          "stat": {
            "response_time_ms": 86.68,
            "elapsed_ms": 84.922,
            "content_size": 482
          },
          "validators": {
            "validate_extractor": [
              {
                "comparator": "equals",
                "check": "content.code",
                "check_value": 2000,
                "expect_value": 2000,
                "check_result": "pass"
              },
              {
                "comparator": "string_equals",
                "check": "${get_list_dict_value($bedValue, bedNumber, $bedNumber, bedStatus)}",
                "check_value": "1",
                "expect_value": 1,
                "check_result": "pass"
              }
            ]
          },
          "caseId": 439
        },
        "meta_datas_expanded": [
          {
            "name": "据病区查询床位列表",
            "data": [
              {
                "request": {
                  "url": "http://tt-poc-his.seenew.info/app-sys-manage/bedManage/queryBedByArea",
                  "method": "POST",
                  "headers": "{\n  \"User-Agent\": \"python-requests/2.24.0\",\n  \"Accept-Encoding\": \"gzip, deflate\",\n  \"Accept\": \"*/*\",\n  \"Connection\": \"keep-alive\",\n  \"Authorization\": \"Bearer 5dde9870-a499-4c8f-8bb5-111c5c68811c\",\n  \"Content-Type\": \"application/json; charset=UTF-8\",\n  \"k1\": \"1\",\n  \"k2\": \"29531\",\n  \"webUrl\": \"http://gmc-test.cfuture.shop/basis/BedMaintain?k=1-99897828607-XN3142\",\n  \"Content-Length\": \"38\"\n}",
                  "body": "{\n  &#34;areaId&#34;: &#34;29533&#34;,\n  &#34;locationType&#34;: 0\n}"
                },
                "response": {
                  "ok": true,
                  "url": "http://tt-poc-his.seenew.info/app-sys-manage/bedManage/queryBedByArea",
                  "status_code": 200,
                  "reason": "",
                  "cookies": "{}",
                  "encoding": "UTF-8",
                  "headers": "{\n  \"Server\": \"nginx/1.18.0\",\n  \"Date\": \"Tue, 06 Jul 2021 08:30:47 GMT\",\n  \"Content-Type\": \"application/json;charset=UTF-8\",\n  \"Transfer-Encoding\": \"chunked\",\n  \"Connection\": \"keep-alive\",\n  \"traceid\": \"DUBBO-DEFAULT\",\n  \"Access-Control-Expose-Headers\": \"traceid\",\n  \"X-Application-Context\": \"app-sys-manage:tt-poc:8080\",\n  \"X-Content-Type-Options\": \"nosniff\",\n  \"X-XSS-Protection\": \"1; mode=block\",\n  \"Cache-Control\": \"no-cache, no-store, max-age=0, must-revalidate\",\n  \"Pragma\": \"no-cache\",\n  \"Expires\": \"0\",\n  \"X-Frame-Options\": \"DENY\"\n}",
                  "content_type": "application/json;charset=UTF-8",
                  "body": "{\n  \"code\": 2000,\n  \"message\": \"success\",\n  \"body\": {\n    \"bedInfoDTOS\": [\n      {\n        \"bedInfoId\": 2690878974305,\n        \"bedLocationId\": 997906,\n        \"bedNumber\": \"203189\",\n        \"areaId\": 29533,\n        \"areaName\": \"自动化测试病区\",\n        \"bedStatus\": 1,\n        \"bedUseStatus\": \"0\",\n        \"defaultBedTypeId\": 41,\n        \"nowBedTypeId\": 41,\n        \"sortNumber\": 1,\n        \"roomId\": 1007,\n        \"roomLocationId\": 29534,\n        \"roomNumber\": \"可乐\",\n        \"nowBedTypeName\": \"普通\",\n        \"genderLimit\": 0,\n        \"isolationState\": 0,\n        \"virtualBed\": 0,\n        \"frontTargetProperties\": 1\n      }\n    ],\n    \"bedCountDTO\": {\n      \"allNum\": 1,\n      \"occupyNum\": 0,\n      \"freeNum\": 1\n    }\n  }\n}"
                }
              }
            ],
            "stat": {
              "response_time_ms": 86.68,
              "elapsed_ms": 84.922,
              "content_size": 482
            },
            "validators": {
              "validate_extractor": [
                {
                  "comparator": "equals",
                  "check": "content.code",
                  "check_value": 2000,
                  "expect_value": 2000,
                  "check_result": "pass"
                },
                {
                  "comparator": "string_equals",
                  "check": "${get_list_dict_value($bedValue, bedNumber, $bedNumber, bedStatus)}",
                  "check_value": "1",
                  "expect_value": 1,
                  "check_result": "pass"
                }
              ]
            },
            "caseId": 439
          }
        ],
        "response_time": "86.68"
      }
    ]
  }
};
