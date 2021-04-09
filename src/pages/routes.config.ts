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
    path: 'publish',
    name: '发布管理',
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
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];
