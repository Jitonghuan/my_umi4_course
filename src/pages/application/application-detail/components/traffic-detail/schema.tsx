// 开始时间枚举
export const START_TIME_ENUMS = [
  {
    label: 'Last 5 minutes',
    value: 5 * 60 * 1000,
  },
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
];

export const selectOption = [
  {
    label: '使用时间区间',
    value: 'rangePicker',
  },
  {
    label: '使用最近时间',
    value: 'lastTime',
  },
];
