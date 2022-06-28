import type { Moment } from 'moment';
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
    label: 'counter',
    value: 'counter',
  },
  {
    label: 'gauge',
    value: 'gauge',
  },
  {
    label: 'histogram',
    value: 'histogram',
  },
  {
    label: 'summary',
    value: 'summary',
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

export interface AlertNameProps {
  key?: React.Key;
  alertRuleName: string;
  expression: string;
  message: string;
}
export interface Item {
  key?: React.Key;
  value?: string;
  group?: string;
  expression?: string;
  message?: string;
  time?: Moment | string;
  duration?: string;
  id?: React.Key;
  status?: number;
  appCode?: string;
  envCode?: string;
  // alertName?: string;
  level?: number;
  eventNum?: string;
  createTime?: string;
  notifyObject?: string;
  name?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  alertName?: AlertNameProps[];
  children?: Item[];
  receiver?: string | string[];
  receiverType?: string | string[];
  timeType?: string;
  silence?: number;
  silenceTime?: Moment[];
  silenceStart?: string;
  silenceEnd?: string;
}
export const stepTableMap = (data: Item[]) => {
  const obj: Record<string, string> = {};
  data.forEach((item) => {
    const str = item.key;
    if (str) {
      obj[str] = item.value as string;
    }
  });
  return obj;
};
