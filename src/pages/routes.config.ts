// import ds from '../../config/defaultSettings';

type IRouteItem = {
  path: string;
  name?: string;
  icon?: string;
  component: string;
  routes?: IRouteItem[];
};

const PAGE_PREFIX = '/matrix';

export default [
  {
    path: PAGE_PREFIX,
    redirect: `${PAGE_PREFIX}/application`,
  },
  {
    path: 'index',
    // name: '首页',
    icon: 'icon-poc_index',
    component: '@/pages/index',
  },
  {
    path: `${PAGE_PREFIX}/application`,
    redirect: `${PAGE_PREFIX}/application/all`,
  },
  {
    path: `${PAGE_PREFIX}/publish`,
    redirect: `${PAGE_PREFIX}/publish/function`,
  },
  {
    path: `${PAGE_PREFIX}/test`,
    redirect: `${PAGE_PREFIX}/test/data-factory/records`,
  },
  {
    path: `${PAGE_PREFIX}/monitor`,
    redirect: `${PAGE_PREFIX}/monitor/board`,
  },
  {
    path: `${PAGE_PREFIX}/ticket`,
    redirect: `${PAGE_PREFIX}/ticket/list`,
  },
  {
    path: `${PAGE_PREFIX}/order`,
    redirect: `${PAGE_PREFIX}/order/list`,
  },
  {
    path: `${PAGE_PREFIX}/code`,
    redirect: `${PAGE_PREFIX}/code/rank`,
  },
  {
    path: `${PAGE_PREFIX}/test/autotest`,
    redirect: `${PAGE_PREFIX}/test/autotest/dashboard`,
  },
  {
    path: `${PAGE_PREFIX}/monitor/business`,
    redirect: `${PAGE_PREFIX}/monitor/business/prometheus`,
  },
  {
    path: `${PAGE_PREFIX}/operation/cluster`,
    redirect: `${PAGE_PREFIX}/operation/cluster/traffic-scheduling`,
  },
  {
    path: `${PAGE_PREFIX}/test/data-factory`,
    redirect: `${PAGE_PREFIX}/test/data-factory/records`,
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
        key: 'list',
        component: '@/pages/application/application-list',
      },
      {
        path: 'detail',
        name: '应用详情',
        key: 'list',
        hideInMenu: true,
        component: '@/pages/application/application-detail',
        routes: [
          {
            path: 'overview',
            name: '概述',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-overview',
          },
          {
            path: 'monitor',
            name: '应用监控',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/monitor/application/app-table',
          },
          {
            path: 'appDeploy',
            name: '应用部署',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/application-deploy',
          },
          {
            path: 'branch',
            name: '分支',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/branch-manage',
          },
          {
            path: 'configMgr',
            name: '配置管理',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: 'launchParameters',
            name: '启动参数',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: 'addConfig',
            name: '新增配置',
            key: 'list',
            component: '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: 'addLaunchParameters',
            name: '新增启动参数',
            key: 'list',
            component: '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: 'secondPartyPkg',
            name: '二方包',
            key: 'list',
            hideInMenu: true,
            component: '@/pages/application/application-detail/components/second-party-pkg',
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
        name: '工单列表',
        component: '@/pages/ticket/ticket-list',
      },
    ],
  },
  {
    path: 'test',
    name: '测试管理',
    icon: 'icon-poc_mining',
    routes: [
      {
        path: 'data-factory',
        name: '数据工厂',
        key: 'data-factory',
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
        path: 'functions',
        name: '函数管理',
        key: 'functions',
        component: '@/pages/test/functions',
        exact: true,
      },
      {
        path: 'autotest',
        name: '自动化测试',
        key: 'autotest',
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
    ],
  },

  {
    path: 'operation',
    name: '运维管理',
    icon: 'icon-atomic',
    routes: [
      {
        path: 'cluster',
        name: '双集群管理',
        key: 'cluster',
        routes: [
          {
            path: 'group-view',
            name: '集群看板',
            key: 'cluster',
            component: '@/pages/operation/cluster/group-view',
            hideInMenu: true,
          },
          {
            path: 'traffic-scheduling',
            name: '流量调度',
            key: 'cluster',
            component: '@/pages/operation/cluster/traffic-scheduling',
            hideInMenu: true,
          },
          {
            path: 'cluster-synchro',
            name: '集群同步',
            key: 'cluster',
            component: '@/pages/operation/cluster/cluster-synchro',
            hideInMenu: true,
          },
          {
            path: 'application-synchro',
            name: '应用同步',
            key: 'cluster',
            component: '@/pages/operation/cluster/application-synchro',
            hideInMenu: true,
          },
          {
            path: 'operation-log',
            name: '操作日志',
            key: 'cluster',
            component: '@/pages/operation/cluster/operation-log',
            hideInMenu: true,
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
        routes: [
          {
            path: 'prometheus',
            name: '接口方式接入',
            key: 'business-monitor',
            component: '@/pages/monitor/business/prometheus',
            hideInMenu: true,
          },
          {
            path: 'prometheus/prometheus-add',
            name: '接入Prometheus',
            key: 'business-monitor',
            hideInMenu: true,
            component: '@/pages/monitor/business/prometheus/prometheus-form',
          },
          {
            path: 'prometheus/prometheus-edit',
            name: '编辑Prometheus',
            key: 'business-monitor',
            hideInMenu: true,
            component: '@/pages/monitor/business/prometheus/prometheus-form',
          },
          {
            path: 'logger-alarm',
            name: '日志方式接入',
            key: 'business-monitor',
            hideInMenu: true,
            component: '@/pages/monitor/business/logger-alarm',
          },
        ],
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
    hideInMenu: process.env.BUILD_ENV === 'prod',
    routes: [
      {
        path: 'search',
        name: '日志检索',
        component: '@/pages/logger/search',
      },
    ],
  },
  {
    path: 'code',
    name: '代码管理',
    icon: 'icon-code',
    hideInMenu: true,
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
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];
