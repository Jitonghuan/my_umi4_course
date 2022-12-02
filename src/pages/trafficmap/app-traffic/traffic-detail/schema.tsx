// 开始时间枚举 所有时间往前推一分钟
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
    value: 60 * 60 * 1000 * 6,
  },
  {
    label: 'Last 12 hours',
    value: 60 * 60 * 1000 * 12,
  },
  {
    label: 'Last 24 hours',
    value: 60 * 60 * 1000 * 24,
  },
  {
    label: 'Last 3 days',
    value: 60 * 60 * 1000 * 24 * 3,
  },
  {
    label: 'Last 7 days',
    value: 60 * 60 * 1000 * 24 * 7,
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
