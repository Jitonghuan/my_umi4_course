export const editColumns = [
  {
    title: '键（点击可修改）',
    dataIndex: 'key',
    editable: true,
    width: '45%',
  },
  {
    title: '值（点击可修改）',
    dataIndex: 'value',
    key: 'value',
    editable: true,
    width: '45%',
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
export const rulesOptions = [
  {
    key: 2,
    value: 2,
    label: '警告',
  },
  {
    key: 3,
    value: 3,
    label: '严重',
  },
  {
    key: 4,
    value: 4,
    label: '灾难',
  },
];
export const silenceOptions = [
  {
    key: 1,
    value: 1,
    label: '是',
  },
  {
    key: 0,
    value: 0,
    label: '否',
  },
];
export const targetOptions = [
  {
    label: 'Counter',
    value: 'Counter',
  },
  {
    label: 'Gauge',
    value: 'Gauge',
  },
  {
    label: 'Histogram',
    value: 'Histogram',
  },
  {
    label: 'Summary',
    value: 'Summary',
  },
];

export const operatorOption = [
  {
    label: '>',
    value: 'gt',
  },
  {
    label: '<',
    value: 'lt',
  },
  {
    label: '=',
    value: 'eq',
  },
  {
    label: '!=',
    value: 'ne',
  },
];
