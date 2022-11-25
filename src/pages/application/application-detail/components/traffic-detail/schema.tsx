// 开始时间枚举 时间往前推一分钟
export const START_TIME_ENUMS = [
  {
    label: 'Last 5 minutes',
    value: 6 * 60 * 1000,
  },
  {
    label: 'Last 15 minutes',
    value: 16 * 60 * 1000,
  },
  {
    label: 'Last 30 minutes',
    value: 31 * 60 * 1000,
  },
  {
    label: 'Last 1 hours',
    value: 61 * 60 * 1000,
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
