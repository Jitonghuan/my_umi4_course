export const START_TIME_ENUMS = [
  {
    label: 'Last 15 minutes',
    value: 15 * 60 * 1000,
  },
  {
    label: 'Last 30 minutes',
    value: 30 * 60 * 1000,
  },
  {
    label: 'Last 1 hours',
    value: 60 * 60 * 1000,
  },
  {
    label: 'Last 6 hours',
    value: 6 * 60 * 60 * 1000,
  },
  {
    label: 'Last 12 hours',
    value: 12 * 60 * 60 * 1000,
  },
  {
    label: 'Last 24 hours',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: 'Last 3 days',
    value: 24 * 60 * 60 * 1000 * 3,
  },
  {
    label: 'Last 7 days',
    value: 24 * 60 * 60 * 1000 * 7,
  },
  {
    label: 'Last 30 days',
    value: 24 * 60 * 60 * 1000 * 30,
  },
];

export type ITab = {
  /** key */
  key: string;

  /** title */
  title: string | React.ReactNode;
};

export type ICard = {
  mode?: '1' | '2'; // 1 为资源使用率，2 为方块节点数
  /** 标题 */
  title?: string;
  /** 值 */
  value?: string;
  /** 单位 */
  unit?: string;
  /** 警示 */
  warn?: string;
  /** 颜色 */
  color?: string;
  /** 方块显示数据源 */
  dataSource?: ICard[];
};

export const gridData = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 4,
  xxl: 4,
  xxxl: 4,
};

// 大盘数据结构
export type IMarket = {
  name: string;
  href: string;
};

export const tabList = [
  { label: 'DEV', value: 'dev' },
  { label: 'TEST', value: 'test' },
  { label: 'PRE', value: 'pre' },
  { label: 'PROD', value: 'prod' },
];
