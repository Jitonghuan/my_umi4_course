/**
 * 基础路由套层
 * @param pagePrefix 页面前缀
 * @param routes 业务路由子节点
 */

type IRouteItem = {
  path: string;
  name: string;
  icon?: string;
  component: string;
};

export const getRoutes = (
  pagePrefix = '/',
  routes: IRouteItem[] = [],
  ds: any,
) => [
  {
    path: `${ds.loginPrefix}/login`,
    component: '../layouts/login',
  },
  {
    path: pagePrefix,
    component: '../layouts/basic-layout/index',
    menuRoot: true,
    routes,
  },
  {
    path: '/',
    redirect: pagePrefix,
  },
];
