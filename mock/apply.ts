export default {
  // 查询应用列表
  [`GET /v1/releaseManage/apply/list`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1463,
          applyId: '9a24a4b3-10af-4d7a-84fb-0fbb124bd231',
          processInstanceId: '4540263d-e397-42b8-898d-7027f17e2777',
          lineCode: 'cis',
          belong: 'gmc',
          title: '医共体急诊页面发布申请-20210423',
          deployType: 'daily',
          emergencyType: '',
          deployEnv: 'tiantai,weishan',
          deployUser: '南婷',
          deployDate: '2021-04-23',
          deployFuncCount: 1,
          applyUser: '李澜',
          ifFuncRegression: false,
          ifCr: false,
          ifDdl: false,
          applyStatus: 1,
          createUser: '李澜',
          modifyUser: '李澜',
          gmtCreate: '2021-04-23 12:24:32',
          gmtModify: '2021-04-23 12:24:32',
          lineName: 'cis',
        },
        {
          id: 1461,
          applyId: '5c9a46de-57a9-490f-b934-89f7b313034d',
          processInstanceId: 'b89f8d6d-6042-41b8-a1e9-489bfe1022dd',
          lineCode: 'scm',
          belong: 'gmc',
          title: '血库bug-修复数据解析问题',
          deployType: 'emergency',
          emergencyType: 'bugfix',
          deployEnv: 'tiantai,weishan',
          deployUser: '张华荣',
          deployDate: '2021-04-23',
          deployFuncCount: 2,
          applyUser: '何飞',
          ifFuncRegression: true,
          ifCr: false,
          ifDdl: false,
          applyStatus: 1,
          createUser: '何飞',
          modifyUser: '何飞',
          gmtCreate: '2021-04-23 10:13:39',
          gmtModify: '2021-04-23 10:13:39',
          lineName: 'scm',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 20,
      },
    },
  },
  // 查询机构列表
  [`GET /v1/releaseManage/deploy/env/list`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          id: 1,
          envCode: 'tiantai',
          envName: '天台',
        },
        {
          id: 2,
          envCode: 'weishan',
          envName: '巍山',
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 20,
      },
    },
  },

  // 查询计划列表
  [`GET /v1/releaseManage/deploy/plan/list`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      dataSource: [
        {
          plan: {
            id: 2979,
            planId: 'e8a33085-bcec-4b45-9661-b04312760885',
            appCode: 'metric-center',
            lineCode: 'cfdata',
            sysCode: 'cfdata',
            belong: 'g3a',
            deployType: 'backend',
            version: '',
            deployRelease: '',
            dependency: '',
            configs: '',
            DDL: '',
            DML: '',
            develop: '金辉',
            test: '金辉',
            deploy: '金辉',
            preDeployTime: '2021-04-16 19:54',
            deployTime: '',
            deployStatus: 0,
            changeType: 'func',
            createUser: '金辉',
            modifyUser: '金辉',
            gmtCreate: '2021-04-16 17:54:30',
            gmtModify: '2021-04-16 17:54:30',
          },
          funcIds: [2817],
        },
        {
          plan: {
            id: 2841,
            planId: '95e23347-ba37-4d2e-8103-c82de329bff3',
            appCode: 'big-screen',
            lineCode: 'cfdata',
            sysCode: 'cfdata',
            belong: 'g3a',
            deployType: 'backend',
            version: '',
            deployRelease: '',
            dependency: '',
            configs: '',
            DDL: '',
            DML: '',
            develop: '周志华，邹辉林',
            test: '周志华，邹辉林',
            deploy: '邹辉林',
            preDeployTime: '2021-04-13 21:00',
            deployTime: '',
            deployStatus: 0,
            changeType: 'func',
            createUser: '邹辉林',
            modifyUser: '邹辉林',
            gmtCreate: '2021-04-13 21:00:17',
            gmtModify: '2021-04-13 21:00:17',
          },
          funcIds: [2693],
        },
        {
          plan: {
            id: 2796,
            planId: '6efda196-a087-4617-ac0c-a02c6363c888',
            appCode: 'g3a-metric-parent',
            lineCode: 'cfdata',
            sysCode: 'cfdata',
            belong: 'g3a',
            deployType: 'backend',
            version: '',
            deployRelease: '',
            dependency: '',
            configs: '',
            DDL: '',
            DML: '',
            develop: '金辉',
            test: '金辉',
            deploy: '金辉',
            preDeployTime: '2021-04-08 19:00',
            deployTime: '',
            deployStatus: 0,
            changeType: 'func',
            createUser: '金辉',
            modifyUser: '金辉',
            gmtCreate: '2021-04-08 11:38:14',
            gmtModify: '2021-04-08 11:38:14',
          },
          funcIds: [2629],
        },
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 20,
      },
    },
  },
  // 查询发布申请详情
  [`GET /v1/releaseManage/apply/detail`]: {
    success: true,
    code: 1000,
    errorMsg: '',
    data: {
      base: {
        id: 1505,
        applyId: 'be3186cd-0c7a-4950-b003-10a74a3f576a',
        processInstanceId: '2eb733ac-d4cc-43bb-a5bf-df8848c4273b',
        lineCode: 'mis',
        belong: 'gmc',
        title: 'MIS20210429日常需求',
        deployType: 'daily',
        emergencyType: '',
        deployEnv: 'tiantai,weishan',
        deployUser: '徐佳栋、严冬军',
        deployDate: '2021-04-29',
        deployFuncCount: 5,
        applyUser: '杨宇辉',
        ifFuncRegression: false,
        ifCr: false,
        ifDdl: false,
        applyStatus: 3,
        createUser: '杨宇辉',
        modifyUser: '杨宇辉',
        gmtCreate: '2021-04-29 15:47:40',
        gmtModify: '2021-04-29 15:47:40',
      },
      plans: [
        {
          id: 3317,
          planId: '306ca35f-bbc1-4149-90a1-b811623d6ad6',
          appCode: 'gmc-medicare',
          lineCode: 'mis',
          sysCode: 'mis',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs: '',
          DDL: '',
          DML: '',
          develop: '徐佳栋',
          test: '木一',
          deploy: '徐佳栋',
          preDeployTime: '2021-04-29 18:00',
          deployTime: '',
          deployStatus: 0,
          changeType: 'func',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:24:37',
          funcs: [
            {
              id: 3163,
              funcId: '383323e3-1c81-47c7-9c8f-3e3194543ba3',
              funcName: '医保药品对照下发',
              lineCode: 'base',
              sysCode: '基础服务',
              coverageRange: '医保药品对照下发',
              resolveNeeds: '医保药品对照下发',
              risks: '',
              preDeployTime: '2021-04-29 18:00',
              deployTime: '',
              deployStatus: 0,
              demandId: '',
              belong: 'gmc',
              envs: 'tiantai',
              createUser: '王彬',
              modifyUser: '王彬',
              gmtCreate: '2021-04-29 11:00:18',
              gmtModify: '2021-04-29 11:00:18',
            },
            {
              id: 3177,
              funcId: '4c8112a3-f62b-4c44-998b-cc5568d93a9a',
              funcName: '一般诊疗费匹配失败',
              lineCode: 'mis',
              sysCode: '医保平台',
              coverageRange: '医保平台',
              resolveNeeds: '缺陷修复',
              risks: '',
              preDeployTime: '2021-04-29 18:00',
              deployTime: '',
              deployStatus: 0,
              demandId: 'YGTMIS-739',
              belong: 'gmc',
              envs: 'tiantai,weishan',
              createUser: '杨宇辉',
              modifyUser: '杨宇辉',
              gmtCreate: '2021-04-29 13:59:44',
              gmtModify: '2021-04-29 13:59:44',
            },
            {
              id: 3178,
              funcId: '204f55c9-0070-4edf-9f66-69a5a9db7521',
              funcName: '医疗保障基金结算清单更改',
              lineCode: 'mis',
              sysCode: '医保平台',
              coverageRange: '医保清单审核',
              resolveNeeds: '医疗保障基金结算清单更改',
              risks: '',
              preDeployTime: '2021-04-29 18:00',
              deployTime: '',
              deployStatus: 0,
              demandId: 'YGTMIS-621',
              belong: 'gmc',
              envs: 'tiantai,weishan',
              createUser: '杨宇辉',
              modifyUser: '杨宇辉',
              gmtCreate: '2021-04-29 13:59:44',
              gmtModify: '2021-04-29 13:59:44',
            },
          ],
        },
        {
          id: 3318,
          planId: 'd64cf49e-e00a-4511-94d3-caf0066eee40',
          appCode: 'gmc-outpatient-charge',
          lineCode: 'mis',
          sysCode: 'mis',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs:
            '# 定时任务配置\nxxl.job.admin.addresses=http://172.16.2.86:8849/xxl-job-admin\nxxl.job.executor.appname=${spring.application.name}\nxxl.job.executor.port=9999\nxxl.job.executor.logpath=logs/xxl-job/jobhandler\nxxl.job.executor.logretentiondays=30',
          DDL: '',
          DML: '',
          develop: '徐佳栋',
          test: '木一',
          deploy: '东来（巍山）',
          preDeployTime: '2021-04-29 18:00',
          deployTime: '',
          deployStatus: 0,
          changeType: 'config',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:29:38',
          funcs: null,
        },
        {
          id: 3319,
          planId: 'a0bf43f7-cc7c-4911-93e8-13d58abe1d34',
          appCode: 'gmc-hospitalized-settlement',
          lineCode: 'mis',
          sysCode: '住院结算',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs:
            '# 定时任务配置\nxxl.job.admin.addresses=http://172.16.2.86:8849/xxl-job-admin\nxxl.job.executor.appname=${spring.application.name}\nxxl.job.executor.port=9999\nxxl.job.executor.logpath=logs/xxl-job/jobhandler\nxxl.job.executor.logretentiondays=30',
          DDL: '',
          DML: '',
          develop: '徐佳栋',
          test: '木一',
          deploy: '东来（巍山）',
          preDeployTime: '2021-04-29 18:18',
          deployTime: '',
          deployStatus: 0,
          changeType: 'config',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:30:07',
          funcs: null,
        },
        {
          id: 3320,
          planId: '47f1db0d-04c9-4278-ad21-fc288d90d343',
          appCode: 'gmc-outpatient-charge',
          lineCode: 'mis',
          sysCode: 'mis',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs: '',
          DDL: '',
          DML: '',
          develop: '徐佳栋',
          test: '木一',
          deploy: '徐佳栋',
          preDeployTime: '2021-04-29 18:30',
          deployTime: '',
          deployStatus: 0,
          changeType: 'func',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:30:54',
          funcs: [
            {
              id: 3178,
              funcId: '204f55c9-0070-4edf-9f66-69a5a9db7521',
              funcName: '医疗保障基金结算清单更改',
              lineCode: 'mis',
              sysCode: '医保平台',
              coverageRange: '医保清单审核',
              resolveNeeds: '医疗保障基金结算清单更改',
              risks: '',
              preDeployTime: '2021-04-29 18:00',
              deployTime: '',
              deployStatus: 0,
              demandId: 'YGTMIS-621',
              belong: 'gmc',
              envs: 'tiantai,weishan',
              createUser: '杨宇辉',
              modifyUser: '杨宇辉',
              gmtCreate: '2021-04-29 13:59:44',
              gmtModify: '2021-04-29 13:59:44',
            },
          ],
        },
        {
          id: 3321,
          planId: 'ed8ca009-54ad-443c-afa4-fa5eb3c8a85c',
          appCode: 'gmc-hospitalized-settlement',
          lineCode: 'mis',
          sysCode: '住院结算',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs: '',
          DDL: '',
          DML: '',
          develop: '徐佳栋',
          test: '木一',
          deploy: '徐佳栋',
          preDeployTime: '2021-04-29 18:00',
          deployTime: '',
          deployStatus: 0,
          changeType: 'func',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:31:52',
          funcs: [
            {
              id: 3178,
              funcId: '204f55c9-0070-4edf-9f66-69a5a9db7521',
              funcName: '医疗保障基金结算清单更改',
              lineCode: 'mis',
              sysCode: '医保平台',
              coverageRange: '医保清单审核',
              resolveNeeds: '医疗保障基金结算清单更改',
              risks: '',
              preDeployTime: '2021-04-29 18:00',
              deployTime: '',
              deployStatus: 0,
              demandId: 'YGTMIS-621',
              belong: 'gmc',
              envs: 'tiantai,weishan',
              createUser: '杨宇辉',
              modifyUser: '杨宇辉',
              gmtCreate: '2021-04-29 13:59:44',
              gmtModify: '2021-04-29 13:59:44',
            },
          ],
        },
        {
          id: 3322,
          planId: '0e18c6fd-d526-402f-9c55-74d0580c15e0',
          appCode: 'gmc-outpatient-charge',
          lineCode: 'mis',
          sysCode: 'mis',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs: '',
          DDL:
            "\n-- auto-generated definition\ncreate table biz_outpatient_settle_voucher_upload\n(\n    id                    bigint auto_increment\n        primary key,\n    settle_id             bigint               null comment '结算id',\n    voucher_status        tinyint(2) default 1 null comment '医保结算清单上传状态 1 待审核  2 已审核    3上传中  4 已上传   5 上传失败 6撤销中 7已撤销  8 撤销失败',\n    settle_serial_id      varchar(50)          null comment '结算流水号',\n    medicare_register_id  varchar(50)          null comment '就诊登记id',\n    voucher_serial_number varchar(50)          null comment '结算清单流水号',\n    is_lock               tinyint(2)           null comment '锁定标识',\n    approval_id           bigint               null comment '审批人',\n    approval_time         datetime(3)          null comment '审批时间',\n    upload_time           datetime(3)          null comment '上传时间',\n    revoke_time           datetime(3)          null comment '撤销时间',\n    upload_count          int                  null comment '上传次数',\n    create_by             bigint               not null comment '创建记录人',\n    gmt_create            datetime(3)          not null comment '创建记录时间',\n    modify_by             bigint               not null comment '修改记录人',\n    gmt_modify            datetime(3)          not null comment '修改记录时间',\n    active                tinyint(1) default 1 not null comment '是否有效 0-无效 1-有效',\n    gmc_id                bigint     default 1 null comment '医共体id',\n    voucher_type          tinyint(2)           null comment '1 门诊 2 住院',\n    new_column            int                  null\n)\n    comment '结算清单上传表';\n\n-- auto-generated definition\ncreate index voucher_settle_id_index\n    on biz_outpatient_settle_voucher_upload (settle_id);\n",
          DML:
            "alter table biz_outpatient_settle_master add COLUMN voucher_status tinyint(4) DEFAULT null comment '医保结算清单上传状态 1 待审核  2 已审核    3上传中  4 已上传   5 上传失败 6撤销中 7已撤销  8 撤销失败';\n",
          develop: '徐佳栋',
          test: '木一',
          deploy: '徐佳栋',
          preDeployTime: '2021-04-29 18:32',
          deployTime: '',
          deployStatus: 0,
          changeType: 'database',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:33:30',
          funcs: null,
        },
        {
          id: 3323,
          planId: '31b6a44e-5e47-4e2d-9a12-c511ba9172ef',
          appCode: 'gmc-hospitalized-settlement',
          lineCode: 'mis',
          sysCode: '住院结算',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs: '',
          DDL:
            "\n\n-- auto-generated definition\ncreate table biz_inhospital_settle_voucher_upload\n(\n    id                    bigint auto_increment\n        primary key,\n    settle_id             bigint               null comment '结算id',\n    voucher_status        tinyint(2) default 1 null comment '医保结算清单上传状态 1 待审核  2 已审核    3上传中  4 已上传   5 上传失败 6撤销中 7已撤销  8 撤销失败',\n    settle_serial_id      varchar(50)          null comment '结算流水号',\n    medicare_register_id  varchar(50)          null comment '就诊登记id',\n    voucher_serial_number varchar(50)          null comment '结算清单流水号',\n    is_lock               tinyint(2)           null comment '锁定标识',\n    approval_id           bigint               null comment '审批人',\n    approval_time         datetime(3)          null comment '审批时间',\n    upload_time           datetime(3)          null comment '上传时间',\n    revoke_time           datetime(3)          null comment '撤销时间',\n    upload_count          int                  null comment '上传次数',\n    create_by             bigint               not null comment '创建记录人',\n    gmt_create            datetime(3)          not null comment '创建记录时间',\n    modify_by             bigint               not null comment '修改记录人',\n    gmt_modify            datetime(3)          not null comment '修改记录时间',\n    active                tinyint(1) default 1 not null comment '是否有效 0-无效 1-有效',\n    gmc_id                bigint     default 1 null comment '医共体id',\n    voucher_type          tinyint(2)           null comment '1 门诊 2 住院',\n    new_column            int                  null\n)\n    comment '结算清单上传表';\n\n-- auto-generated definition\ncreate index voucher_settle_id_index\n    on biz_inhospital_settle_voucher_upload (settle_id);",
          DML:
            "alter table biz_inhospital_settle_master add COLUMN voucher_status tinyint(4) DEFAULT null comment '医保结算清单上传状态 1 待审核  2 已审核    3上传中  4 已上传   5 上传失败 6撤销中 7已撤销  8 撤销失败';\n",
          develop: '徐佳栋',
          test: '木一',
          deploy: '徐佳栋',
          preDeployTime: '2021-04-29 18:00',
          deployTime: '',
          deployStatus: 0,
          changeType: 'database',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 14:34:46',
          funcs: null,
        },
        {
          id: 3325,
          planId: '998da0a5-0943-47ce-b12b-634da17b6e4c',
          appCode: 'gmc-medicare',
          lineCode: 'mis',
          sysCode: 'mis',
          belong: 'gmc',
          deployType: 'backend',
          version: '',
          deployRelease: '',
          dependency: '',
          configs: '',
          DDL:
            "\n-- auto-generated definition\ncreate table biz_settle_voucher_upload_log\n(\n    id             bigint           auto_increment     primary key,\n    settle_id      bigint               null comment '结算id',\n    type           tinyint              null comment '操作类型 1上传 2 撤销',\n    status         tinyint              null comment '上传状态  0 上传成功   1上传失败 2 撤销成功  3 撤销失败',\n    settle_serial_id      varchar(50)          null comment '结算流水号',\n    medicare_register_id  varchar(50)          null comment '就诊登记id',\n    upload_message text                 null comment '上传报文',\n    error_message  text                 null comment '异常信息',\n    res_msg text                 null comment '返回信息',\n    create_by      bigint               not null comment '创建记录人',\n    gmt_create     datetime(3)          not null comment '创建记录时间',\n    modify_by      bigint               not null comment '修改记录人',\n    gmt_modify     datetime(3)          not null comment '修改记录时间',\n    active         tinyint(1) default 1 not null comment '是否有效 0-无效 1-有效',\n    gmc_id         bigint     default 1 null comment '医共体id'\n)\n    comment '结算清单上传日志表';",
          DML: '',
          develop: '徐佳栋',
          test: '木一',
          deploy: '徐佳栋',
          preDeployTime: '2021-04-29 18:46',
          deployTime: '',
          deployStatus: 0,
          changeType: 'database',
          createUser: '徐佳栋',
          modifyUser: '徐佳栋',
          gmtCreate: '徐佳栋',
          gmtModify: '2021-04-29 15:46:26',
          funcs: null,
        },
      ],
    },
  },
};
