export const productionTabsConfig: any = [
  {
    label: '应用',
    value: 'app',
    type: 'app',
  },
  {
    label: '中间件',
    value: 'middleware',
    type: 'middleware',
  },
  {
    label: '基础数据',
    value: 'sql',
    type: 'sql',
  },
];

export const deliveryTabsConfig: any = [
  {
    label: '全局参数',
    value: 'globalParameters',
  },
  {
    label: '组件参数',
    value: 'componentParameters',
  },
];

export const productionPageTypes: any = {
  app: { text: '添加应用' },
  middleware: { text: '添加中间件' },
  sql: { text: '添加基础数据' },
};
