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
    path: 'index',
    name: '主页',
    icon: 'iconmy-indicator',
    component: '@/pages/Home',
  },
  {
    path: 'application',
    name: '应用管理',
    icon: '',
    routes: [
      {
        path: 'all',
        name: '全部应用',
        icon: '',
        component: '@/pages/application/all-application',
      },
    ],
  },
  {
    path: 'publish',
    name: '发布管理',
    icon: '',
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
    icon: '',
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
    icon: '',
    routes: [
      {
        path: 'auto',
        name: '自动化测试',
        component: '@/pages/test/auto-test',
      },
    ],
  },
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];
