import ds from '../../config/defaultSettings';

type IRouteItem = {
  path: string;
  name: string;
  icon?: string;
  component: string;
};

export default [
  {
    path: ds.pagePrefix,
    redirect: `${ds.pagePrefix}/index`,
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
    path: 'application',
    name: '应用管理',
    icon: '',
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
            component: '@/pages/application/application-overview',
          },
        ],
      },
    ],
  },
  {
    path: 'publish',
    name: '发布管理',
    hideInMenu: true,
    icon: 'iconmy-indicator',
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
    icon: 'iconmy-indicator',
    routes: [
      {
        path: 'list',
        name: '工单列表',
        component: '@/pages/ticket/ticket-list',
      },
      {
        path: 'apply',
        name: '工单审批',
        component: '@/pages/ticket/ticket-apply',
      },
    ],
  },
  {
    path: 'test',
    name: '测试管理',
    icon: 'iconmy-indicator',
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
    icon: 'iconmy-indicator',
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
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];
