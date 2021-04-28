import ds from '../../config/defaultSettings';

type IRouteItem = {
  path: string;
  name?: string;
  icon?: string;
  component: string;
  routes?: IRouteItem[];
};

export default [
  {
    path: ds.pagePrefix,
    redirect: `${ds.pagePrefix}/application`,
  },
  {
    // path: `${ds.pagePrefix}/index`,
    // redirect: `${ds.pagePrefix}/application`,
    path: 'index',
    name: '首页',
    icon: 'icon-poc_index',
    component: '@/pages/index',
  },
  {
    path: `${ds.pagePrefix}/application`,
    redirect: `${ds.pagePrefix}/application/all`,
  },
  {
    path: `${ds.pagePrefix}/publish`,
    redirect: `${ds.pagePrefix}/publish/function`,
  },
  {
    path: `${ds.pagePrefix}/order`,
    redirect: `${ds.pagePrefix}/order/list`,
  },
  {
    path: `${ds.pagePrefix}/code`,
    redirect: `${ds.pagePrefix}/code/rank`,
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
        component: '@/pages/application/application-list',
      },
      {
        path: 'detail',
        name: '应用详情',
        hideInMenu: true,
        component: '@/pages/application/application-detail',
        routes: [
          {
            path: 'overview',
            name: '概述',
            hideInMenu: true,
            component:
              '@/pages/application/application-detail/components/application-overview',
          },
          {
            path: 'monitor',
            name: '应用监控',
            hideInMenu: true,
            component: '@/pages/monitor/application/app-table',
          },
          {
            path: 'appDeploy',
            name: '应用部署',
            hideInMenu: true,
            component:
              '@/pages/application/application-detail/components/application-deploy',
          },
          {
            path: 'branch',
            name: '分支',
            hideInMenu: true,
            component:
              '@/pages/application/application-detail/components/branch-manage',
          },
          {
            path: 'configMgr',
            name: '配置管理',
            hideInMenu: true,
            component:
              '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: 'launchParameters',
            name: '启动参数',
            hideInMenu: true,
            component:
              '@/pages/application/application-detail/components/config-parameters-manage',
          },
          {
            path: 'addConfig',
            name: '新增配置',
            component:
              '@/pages/application/application-detail/components/add-config-parameters',
          },
          {
            path: 'addLaunchParameters',
            name: '新增启动参数',
            component:
              '@/pages/application/application-detail/components/add-config-parameters',
          },
        ],
      },
    ],
  },
  {
    path: 'publish',
    name: '发布管理',
    hideInMenu: true,
    icon: 'icon-exit',
    routes: [
      {
        path: 'function',
        name: '发布功能管理',
        component: '@/pages/publish/function-publish',
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
        path: 'auto',
        name: '自动化测试',
        component: '@/pages/test/auto-test',
      },
      {
        path: 'result',
        name: '自动化测试查询',
        component: '@/pages/test/auto-test-result',
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
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];
