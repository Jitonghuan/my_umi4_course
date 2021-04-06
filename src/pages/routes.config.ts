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
    path: 'index',
    name: '主页',
    icon: 'iconmy-indicator',
    component: '@/pages/Home',
  },
  {
    path: 'page1',
    name: 'page1',
    icon: 'iconmy-indicator',
    component: '@/pages/Page1',
  },
  /** {{routes: 标志位不可删除，用于初始化页面}}  */
] as IRouteItem[];
