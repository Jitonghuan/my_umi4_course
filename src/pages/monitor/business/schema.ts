export const activeKeyMap: Record<string, any> = {
  'prometheus-add': 'prometheus',
  'prometheus-edit': 'prometheus',
};

export const colunms = [
  {
    title: '指标名',
    dataIndex: 'metricName',
    key: 'metricName',
    width: 150,
  },
  {
    title: '指标类型',
    dataIndex: 'metricType',
    key: 'metricType',
    width: 150,
  },
  {
    title: '过滤条件',
    dataIndex: 'filtersData',
    key: 'filtersData',
  },
];
export const envTypeData = [
  {
    label: 'DEV',
    value: 'dev',
  },
  {
    label: 'TEST',
    value: 'test',
  },
  {
    label: 'PRE',
    value: 'pre',
  },
  {
    label: 'PROD',
    value: 'prod',
  },
]; //环境大类

type statusTypeItem = {
  color: string;
  text: string;
};

export const STATUS_TYPE: Record<number, statusTypeItem> = {
  1: { text: '运行中', color: '#428675' },
  0: { text: '暂停中', color: '#a7535a' },
};
