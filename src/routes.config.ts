type IRouteItem = {
  path: string;
  name?: string;
  icon?: string;
  component: string;
  routes?: IRouteItem[];
};

/** 基础路由前缀 */
export const baseRoutePath = '/matrix';

export default [
  {
    path: baseRoutePath,
    redirect: `${baseRoutePath}/application`,
  },
  {
    path: 'index',
    // name: '首页',
    icon: 'icon-poc_index',
    component: '@/pages/index',
  },
  {
    path: `${baseRoutePath}/application`,
    redirect: `${baseRoutePath}/application/all`,
  },
  {
    path: `${baseRoutePath}/pedestal`,
    redirect: `${baseRoutePath}/pedestal/storage-manage/storage-dashboard`,
  },
  {
    path: `${baseRoutePath}/publish`,
    redirect: `${baseRoutePath}/publish/function`,
  },
  {
    path: `${baseRoutePath}/test`,
    redirect: `${baseRoutePath}/test/data-factory/template`,
  },
  {
    path: `${baseRoutePath}/monitor`,
    redirect: `${baseRoutePath}/monitor/board`,
  },
  {
    path: `${baseRoutePath}/ticket`,
    redirect: `${baseRoutePath}/ticket/list`,
  },
  {
    path: `${baseRoutePath}/order`,
    redirect: `${baseRoutePath}/order/list`,
  },
  {
    path: `${baseRoutePath}/code`,
    redirect: `${baseRoutePath}/code/rank`,
  },
  {
    path: `${baseRoutePath}/test/scripts`,
    redirect: `${baseRoutePath}/test/scripts/functions`,
  },
  {
    path: `${baseRoutePath}/test/autotest`,
    redirect: `${baseRoutePath}/test/autotest/dashboard`,
  },
  // {
  //   path: `${baseRoutePath}/monitor`,
  //   redirect: `${baseRoutePath}/monitor/business`,

  // },
  {
    path: `${baseRoutePath}/monitor/basic`,
    redirect: `${baseRoutePath}/monitor/basic/prometheus`,
  },
  {
    path: `${baseRoutePath}/cluster/cluster-zy`,
    redirect: `${baseRoutePath}/cluster/cluster-zy/dashboards`,
  },
  {
    path: `${baseRoutePath}/cluster/cluster-tt`,
    redirect: `${baseRoutePath}/cluster/cluster-tt/dashboards`,
  },
  {
    path: `${baseRoutePath}/cluster/cluster-zs`,
    redirect: `${baseRoutePath}/cluster/cluster-zs/operator-scheduling`,
  },
  {
    path: `${baseRoutePath}/operation/app-tmpl`,
    redirect: `${baseRoutePath}/operation/app-tmpl/tmpl-list`,
  },
  {
    path: `${baseRoutePath}/operation/env-manage`,
    redirect: `${baseRoutePath}/operation/env-manage/env-list`,
  },
  {
    path: `${baseRoutePath}/operation/label-manage`,
    redirect: `${baseRoutePath}/operation/label-manage/label-list`,
  },
  {
    path: `${baseRoutePath}/test/data-factory`,
    redirect: `${baseRoutePath}/test/data-factory/template`,
  },
  {
    path: `${baseRoutePath}/test/workspace`,
    redirect: `${baseRoutePath}/test/workspace/test-case-library`,
  },
  {
    path: `${baseRoutePath}/test/quality-control-new`,
    redirect: `${baseRoutePath}/test/quality-control-new/overview`,
  },

  {
    path: 'demo',
    name: '示例页面',
    icon: 'icon-report',
    hideInMenu: process.env.NODE_ENV !== 'development',
    routes: [
      {
        path: 'layout-normal',
        name: '普通布局',
        component: '@/pages/demo/layout-normal',
      },
      {
        path: 'layout-lr',
        name: '左右布局',
        component: '@/pages/demo/layout-lr',
      },
      {
        path: 'layout-tb',
        name: '上下布局',
        component: '@/pages/demo/layout-tb',
      },
      {
        path: 'layout-box',
        name: '盒子布局',
        component: '@/pages/demo/layout-box',
      },
      {
        path: 'list',
        name: '列表页面',
        component: '@/pages/demo/list',
      },
      {
        path: 'rich-text',
        name: '富文本组件',
        component: '@/pages/demo/rich-text-demo',
      },
      {
        path: 'apitest',
        name: '接口测试',
        component: '@/pages/demo/api-test',
      },
      {
        path: 'icon-list',
        name: '图标列表',
        component: '@/pages/demo/icon-list',
      },
    ],
  },
  {
    path: 'application',
    name: '应用管理',
    icon: 'icon-poc_maindata',
    routes: [
      {
        path: 'all',
        name: '全部应用',
        component: '@/pages/application/all-application',
      },
      {
        path: 'list',
        name: '应用列表',
        key: 'appList',
        component: '@/pages/application/application-list',
      },
      {
        path: 'detail',
        name: '应用详情',
        key: 'appList',
        hideInMenu: true,
        component: '@/pages/application/application-detail',
        routes: [
          {
            path: 'overview',
            name: '概述',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-overview',
          },
          {
            path: 'envManage',
            name: '环境管理',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-envManage',
          },
          {
            path: 'monitor',
            name: '应用监控',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/monitor/application/app-table',
          },
          {
            path: 'appDeploy',
            name: '应用部署',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-deploy',
          },
          {
            path: 'deployInfo',
            name: '部署信息',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info',
          },
          {
            path: 'loginShell',
            name: '登陆shell',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info/login-shell',
          },
          {
            path: 'viewLog',
            name: '查看日志',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/deploy-info/view-log',
          },
          {
            path: 'branch',
            name: '分支',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/branch-manage',
          },
          {
            path: 'configMgr',
            name: '配置管理',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: 'launchParameters',
            name: '启动参数',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: 'AppParameters',
            name: '应用参数',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-params',
          },
          {
            path: 'addConfig',
            name: '新增配置',
            key: 'appList',
            component: '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: 'addLaunchParameters',
            name: '新增启动参数',
            key: 'appList',
            component: '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: 'secondPartyPkg',
            name: '二方包',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/second-party-pkg',
          },
          {
            path: 'feVersion',
            name: '版本管理',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/fe-versions',
          },
          {
            path: 'routeConfig',
            name: '路由配置',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/route-config',
          },
          {
            path: 'changeDetails',
            name: '路由配置',
            key: 'appList',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/change-details',
          },
        ],
      },
    ],
  },
  {
    path: 'publish',
    name: '项目管理',
    icon: 'icon-exit',
    routes: [
      {
        path: 'function',
        key: 'function',
        name: '发布功能管理',
        component: '@/pages/publish/function',
        exact: true,
      },
      {
        path: 'function/addFunction',
        name: '新增发布功能',
        key: 'function',
        hideInMenu: true,
        component: '@/pages/publish/function/function-add',
      },
      {
        path: 'function/editFunction',
        name: '编辑发布功能',
        key: 'function',
        hideInMenu: true,
        component: '@/pages/publish/function/function-edit',
      },
      {
        path: 'function/checkFunction',
        name: '查看发布功能',
        key: 'function',
        hideInMenu: true,
        component: '@/pages/publish/function/function-check',
      },
      {
        path: 'plan',
        name: '发布计划管理',
        key: 'plan',
        exact: true,
        component: '@/pages/publish/plan',
      },
      {
        path: 'plan/addConfigModify',
        name: '新增发布计划',
        key: 'plan',
        hideInMenu: true,
        component: '@/pages/publish/plan/config-modify/add-modify',
      },
      {
        path: 'plan/editConfigModify',
        name: '编辑发布计划',
        key: 'plan',
        hideInMenu: true,
        component: '@/pages/publish/plan/config-modify/edit-modify',
      },
      {
        path: 'plan/checkConfigModify',
        name: '查看发布计划',
        key: 'plan',
        hideInMenu: true,
        component: '@/pages/publish/plan/config-modify/check-modify',
      },
      {
        path: 'apply',
        name: '发布申请',
        component: '@/pages/publish/apply',
      },
    ],
  },
  {
    path: 'ticket',
    name: '工单管理',
    icon: 'icon-report',
    routes: [
      {
        path: 'list',
        name: '运维工单',
        key: 'ticketList',
        component: '@/pages/ticket/ticket-list',
      },
      {
        path: 'alarm',
        name: '告警工单',
        key: 'ticketAlarm',
        component: '@/pages/ticket/ticket-alarm',
      },
      {
        path: 'addTicket',
        name: '新建工单',
        key: 'addTicket',
        component: '@/pages/ticket/addTicket',
        //测试环境和正式环境暂不展示
        hideInMenu: process.env.BUILD_ENV === 'prod',
      },
      {
        path: 'resourceApply',
        name: '资源申请',
        key: 'resourceApply',
        component: '@/pages/ticket/resource-apply',
        //测试环境和正式环境暂不展示
        hideInMenu: process.env.BUILD_ENV === 'prod',
      },
    ],
  },
  {
    path: 'test',
    name: '测试管理',
    icon: 'icon-poc_mining',
    hideInMenu: true,
    routes: [
      {
        path: 'data-factory',
        name: '数据工厂',
        key: 'data-factory',
        component: '@/pages/test/data-factory/index',
        routes: [
          {
            path: 'records',
            name: '数据列表',
            key: 'data-factory',
            component: '@/pages/test/data-factory/data-list',
            hideInMenu: true,
          },
          {
            path: 'add',
            name: '新增数据',
            key: 'data-factory',
            hideInMenu: true,
            component: '@/pages/test/data-factory/create-data',
          },
          {
            path: 'template',
            name: '数据模板',
            key: 'data-factory',
            component: '@/pages/test/data-factory/template',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'qualityControl',
        name: '质量控制',
        key: 'qualityControl',
        component: '@/pages/test/quality-control',
        exact: true,
      },
      {
        path: 'qualityControl/unitTest',
        name: '单测覆盖检测',
        key: 'qualityControl',
        hideInMenu: true,
        component: '@/pages/test/quality-control/unit-test',
      },
      {
        path: 'qualityControl/codeQuality',
        name: '代码质量检测',
        key: 'qualityControl',
        hideInMenu: true,
        component: '@/pages/test/quality-control/code-quality',
      },
      {
        path: 'environment',
        name: '环境管理',
        key: 'environment',
        component: '@/pages/test/environment',
        exact: true,
      },
      {
        path: 'scripts',
        name: '脚本管理',
        key: 'scripts',
        component: '@/pages/test/scripts/index',
        routes: [
          {
            path: 'functions',
            name: '函数管理',
            key: 'scripts',
            component: '@/pages/test/scripts/functions',
          },
          {
            path: 'sqls',
            name: 'SQL管理',
            key: 'scripts',
            component: '@/pages/test/scripts/sqls',
          },
        ],
      },
      {
        path: 'autotest',
        name: '自动化测试',
        key: 'autotest',
        component: '@/pages/test/autotest/index',
        routes: [
          {
            path: 'dashboard',
            name: '看板统计',
            key: 'autotest',
            component: '@/pages/test/autotest/dashboard',
            hideInMenu: true,
          },
          {
            path: 'test-cases',
            name: '用例管理',
            key: 'autotest',
            component: '@/pages/test/autotest/test-cases',
            hideInMenu: true,
          },
          {
            path: 'scenes',
            name: '场景管理',
            key: 'autotest',
            component: '@/pages/test/autotest/scene-manager',
            hideInMenu: true,
          },
          {
            path: 'tasks',
            name: '任务管理',
            key: 'autotest',
            component: '@/pages/test/autotest/task-manager',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'workspace',
        name: '测试工作台',
        key: 'test-workspace',
        routes: [
          {
            path: 'test-case-library',
            name: '测试用例库',
            key: 'test-workspace',
            component: '@/pages/test/workspace/test-case-library',
          },
          {
            path: 'test-case',
            name: '测试用例库详情',
            key: 'test-workspace',
            component: '@/pages/test/workspace/test-case',
            hideInMenu: true,
          },
          {
            path: 'case-info',
            name: '测试用例详情',
            key: 'test-workspace',
            component: '@/pages/test/workspace/case-info',
            hideInMenu: true,
          },
          {
            path: 'bug-manage',
            name: 'Bug管理',
            key: 'test-workspace',
            component: '@/pages/test/workspace/bug-manage',
          },
          {
            path: 'test-plan',
            name: '测试计划',
            key: 'test-workspace',
            component: '@/pages/test/workspace/test-plan',
          },
          {
            path: 'plan-info',
            name: '计划详情',
            key: 'test-workspace',
            component: '@/pages/test/workspace/plan-info',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'quality-control-new',
        name: '质量控制（新）',
        key: 'quality-control-new',
        routes: [
          {
            path: 'overview',
            name: '质量看板',
            key: 'quality-control-new',
            component: '@/pages/test/quality-control-new/overview',
          },
          {
            path: 'task-list',
            name: '任务列表',
            key: 'quality-control-new',
            component: '@/pages/test/quality-control-new/task-list',
          },
          {
            path: 'quality-scoring-rules',
            name: '质量分规则',
            key: 'quality-control-new',
            component: '@/pages/test/quality-control-new/quality-scoring-rules',
          },
          {
            path: 'global-control-point-rules',
            name: '全局卡点规则',
            key: 'quality-control-new',
            component: '@/pages/test/quality-control-new/global-control-point-rules',
          },
          {
            path: 'app-control-point-rules',
            name: '应用卡点规则',
            key: 'quality-control-new',
            component: '@/pages/test/quality-control-new/app-control-point-rules',
          },
        ],
      },
    ],
  },

  {
    path: 'monitor',
    name: '监控管理',
    icon: 'icon-poc_index',
    routes: [
      {
        path: 'board',
        name: '监控面板',
        component: '@/pages/monitor/board',
      },
      {
        path: 'application',
        name: '应用监控',
        component: '@/pages/monitor/application',
      },

      {
        path: 'business',
        name: '业务监控',
        key: 'business-monitor',
        //测试环境和正式环境暂不展示
        // hideInMenu: process.env.BUILD_ENV === 'prod',
        component: '@/pages/monitor/business/index',
        // routes: [
        //   // {
        //   //   path: 'prometheus',
        //   //   name: '接口方式接入',
        //   //   key: 'business-monitor',
        //   //   component: '@/pages/monitor/business/prometheus',
        //   //   hideInMenu: true,
        //   // },
        //   {
        //     path: 'log-monitor',
        //     name: '日志监控',
        //     component: '@/pages/monitor/business/log-monitor',
        //     hideInMenu: true,
        //   },
        // ],
      },
      {
        path: 'log-monitor',
        name: '配置业务监控',
        key: 'business-monitor',
        component: '@/pages/monitor/business/log-monitor',
        hideInMenu: true,
      },

      {
        path: 'alarm-rules',
        name: '报警管理',
        // key: 'basic-monitor',
        component: '@/pages/monitor/alarm-rules',
      },
      {
        path: 'template',
        name: '模板管理',
        component: '@/pages/monitor/template',
      },
      {
        path: 'history',
        name: '报警历史',
        component: '@/pages/monitor/history',
      },
    ],
  },
  {
    path: 'logger',
    name: '日志管理',
    icon: 'icon-diagnose',
    routes: [
      {
        path: 'search',
        name: '日志检索',
        component: '@/pages/logger/search',
      },
      {
        path: 'index-manage',
        name: '索引管理',
        component: '@/pages/logger/index-manage',
      },
      {
        path: 'logger-alarm',
        name: '日志告警',
        key: 'business-monitor',
        component: '@/pages/logger/logger-alarm',
      },
    ],
  },
  {
    path: 'trafficmap',
    name: '流量地图',
    icon: 'icon-ic_flow',
    routes: [
      {
        path: 'global-topo',
        name: '全局拓扑',
        key: 'trafficmap-topo',
        component: '@/pages/trafficmap/global-topo',
      },
      {
        path: 'app-traffic',
        name: '应用流量',
        key: 'trafficmap-app',
        component: '@/pages/trafficmap/app-traffic',
        hideInMenu: process.env.BUILD_ENV === 'prod',
      },
      {
        path: 'tracking',
        name: '追踪',
        key: 'trafficmap-track',
        component: '@/pages/trafficmap/tracking',
        hideInMenu: process.env.BUILD_ENV === 'prod',
      },
      {
        path: 'domain-config',
        name: '配置域',
        key: 'trafficmap-domainconfig',
        component: '@/pages/trafficmap/domain-config',
      },
    ],
  },
  {
    path: 'code',
    name: '代码管理',
    icon: 'icon-code',
    routes: [
      {
        path: 'rank',
        name: '代码排行',
        component: '@/pages/code/rank',
      },
      {
        path: 'details',
        name: '统计详情',
        component: '@/pages/code/details',
      },
    ],
  },

  {
    path: 'operation',
    name: '运维管理',
    icon: 'icon-atomic',
    routes: [
      {
        path: 'app-tmpl',
        name: '应用模版',
        key: 'app-tmpl',
        routes: [
          {
            path: 'tmpl-list',
            name: '应用模版列表',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/tmpl-list',
            hideInMenu: true,
          },

          {
            path: 'tmpl-detail',
            name: '应用模版详情',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/tmpl-detail',
            hideInMenu: true,
          },
          {
            path: 'push',
            name: '推送模版',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/push',
            hideInMenu: true,
          },
          {
            path: 'tmpl-add',
            name: '新增应用模版',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/tmpl-add',
            hideInMenu: true,
          },
          {
            path: 'tmpl-copy',
            name: '复制应用模版',
            key: 'app-tmpl',
            component: '@/pages/operation/app-tmpl/tmpl-copy',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'env-manage',
        name: '环境管理',
        key: 'env-manage',
        routes: [
          {
            path: 'env-list',
            name: '环境列表',
            key: 'env-manage',
            component: '@/pages/operation/env-manage/env-list',
            hideInMenu: true,
          },
          {
            path: 'push-env',
            name: '推送环境',
            key: 'env-manage',
            component: '@/pages/operation/env-manage/push-env',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'label-manage',
        name: '标签管理',
        key: 'label-manage',
        routes: [
          {
            path: 'label-list',
            name: '标签列表',
            key: 'label-manage',
            component: '@/pages/operation/label-manage/label-list',
            hideInMenu: true,
          },
          {
            path: 'label-bind',
            name: '绑定标签',
            key: 'label-manage',
            component: '@/pages/operation/label-manage/label-bind',
            hideInMenu: true,
          },
          {
            path: 'label-unbound',
            name: '解绑标签',
            key: 'label-manage',
            component: '@/pages/operation/label-manage/label-unbound',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'tmpl-log',
        name: '操作日志',
        key: 'tmpl-log',
        component: '@/pages/operation/tmpl-log',
      },
    ],
  },
  {
    path: 'delivery',
    name: '交付管理',
    icon: 'icon-activity',
    routes: [
      {
        path: 'deliveryList',
        name: '交付列表',
        key: 'deliveryList',
        component: '@/pages/delivery/delivery-list',
      },
      {
        path: 'appStore',
        name: '应用商店',
        key: 'appStore',
        component: '@/pages/delivery/appStore',
      },
      {
        path: 'appDetails',
        name: '应用详情',
        key: 'appDetails',
        component: '@/pages/delivery/appDetails',
        hideInMenu: true,
      },
      {
        path: 'releaseManage',
        name: '版本管理',
        key: 'releaseManage',
        component: '@/pages/delivery/release-manage',
      },
      {
        path: 'createAppEdition',
        name: '创建应用版本',
        key: 'createAppEdition',
        component: '@/pages/delivery/create-appEdition',
        hideInMenu: true,
      },
      {
        path: 'updateAppEdition',
        name: '更新应用版本',
        key: 'updateAppEdition',
        component: '@/pages/delivery/update-appEdition',
        hideInMenu: true,
      },
    ],
    //测试环境和正式环境暂不展示
    hideInMenu: process.env.BUILD_ENV === 'prod',
  },
  {
    path: 'cluster',
    name: '双集群管理',
    icon: 'icon-extension',
    routes: [
      {
        path: 'cluster-zy',
        name: '浙一双集群管理',
        key: 'cluster-cluster-zy',
        component: '@/pages/cluster/cluster-zy',
        routes: [
          {
            path: 'dashboards',
            name: '集群看板',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/dashboards',
            hideInMenu: true,
          },
          {
            path: 'scheduling',
            name: '流量调度',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/scheduling',
            hideInMenu: true,
          },
          {
            path: 'cluster-sync',
            name: '集群同步',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/cluster-sync',
            hideInMenu: true,
          },
          {
            path: 'cluster-sync-detail',
            name: '集群同步',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/cluster-sync/sync-detail',
            hideInMenu: true,
          },
          {
            path: 'application-sync',
            name: '应用同步',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/application-sync',
            hideInMenu: true,
          },
          {
            path: 'operation-log',
            name: '操作记录',
            key: 'cluster-cluster-zy',
            component: '@/pages/cluster/cluster-zy/operation-log',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'cluster-tt',
        name: '天台双集群管理',
        key: 'cluster-clusterTt',
        component: '@/pages/cluster/cluster-tt',
        routes: [
          {
            path: 'dashboards',
            name: '集群看板',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/dashboards',
            hideInMenu: true,
          },
          {
            path: 'scheduling',
            name: '流量调度',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/scheduling',
            hideInMenu: true,
          },
          {
            path: 'cluster-sync',
            name: '集群同步',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/cluster-sync',
            hideInMenu: true,
          },
          {
            path: 'cluster-sync-detail',
            name: '集群同步',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/cluster-sync/sync-detail',
            hideInMenu: true,
          },
          {
            path: 'application-sync',
            name: '应用同步',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/application-sync',
            hideInMenu: true,
          },
          {
            path: 'operation-log',
            name: '操作记录',
            key: 'cluster-clusterTt',
            component: '@/pages/cluster/cluster-tt/operation-log',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'cluster-zs',
        name: '中山双集群管理',
        key: 'cluster-clusterZs',
        component: '@/pages/cluster/cluster-zs',
        routes: [
          {
            path: 'operator-scheduling',
            name: '集群调度',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/operator-scheduling',
            hideInMenu: true,
          },
          {
            path: 'scheduling',
            name: '流量调度',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/scheduling',
            hideInMenu: true,
          },
          {
            path: 'cluster-sync',
            name: '集群同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/cluster-sync',
            hideInMenu: true,
          },
          {
            path: 'cluster-sync-detail',
            name: '集群同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/cluster-sync/sync-detail',
            hideInMenu: true,
          },
          {
            path: 'application-sync',
            name: '应用同步',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/application-sync',
            hideInMenu: true,
          },
          {
            path: 'operation-log',
            name: '操作记录',
            key: 'cluster-clusterZs',
            component: '@/pages/cluster/cluster-zs/operation-log',
            hideInMenu: true,
          },
        ],
        hideInMenu: process.env.BUILD_ENV === 'prod',
      },
    ],
  },
  {
    path: 'pedestal',
    name: '基座管理',
    icon: 'icon-dataset',
    routes: [
      {
        path: 'storage-manage',
        name: '存储管理',
        key: 'storage-manage',
        component: '@/pages/pedestal/storage-manage',

        routes: [
          {
            path: 'storage-dashboard',
            name: '存储大盘',
            key: 'storage-manage',
            component: '@/pages/pedestal/storage-manage/storage-dashboard',
            hideInMenu: true,
          },
          {
            path: 'node-manage',
            name: '节点管理',
            key: 'storage-manage',
            hideInMenu: true,
            component: '@/pages/pedestal/storage-manage/node-manage',
          },
          {
            path: 'volume-manage',
            name: '卷管理',
            key: 'storage-manage',
            component: '@/pages/pedestal/storage-manage/volume-manage',
            hideInMenu: true,
          },
        ],
      },
      {
        path: 'volume-detail',
        name: '卷详情',
        key: 'storage-manage',
        component: '@/pages/pedestal/storage-manage/volume-detail',
        hideInMenu: true,
      },
      {
        path: 'visual-screen',
        name: '大屏配置',
        key: 'visual-screen',
        component: '@/pages/pedestal/visual-screen',
      },
    ],
  },
  {
    path: '*',
    name: 'NOT FOUND',
    hideInMenu: true,
    component: '@/pages/index/page-404',
  },
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];