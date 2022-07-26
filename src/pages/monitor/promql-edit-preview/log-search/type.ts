// 时间枚举
import moment from "moment";

export const START_TIME_ENUMS = [
  {
    label: 'Last 1 minutes',
    value: [moment().subtract(1, 'minutes'), moment()],
  },
  {
    label: 'Last 5 minutes',
    value: [moment().subtract(5, 'minutes'), moment()],
  },
  {
    label: 'Last 10 minutes',
    value: [moment().subtract(10, 'minutes'), moment()],
  },
  {
    label: 'Last 15 minutes',
    value: [moment().subtract(15, 'minutes'), moment()],
  },
  {
    label: 'Last 30 minutes',
    value: [moment().subtract(30, 'minutes'), moment()],
  },
  {
    label: 'Last 1 hours',
    value: [moment().subtract(1, 'hours'), moment()],
  },
  {
    label: 'Last 6 hours',
    value: [moment().subtract(6, 'hours'), moment()],
  },
  {
    label: 'Last 12 hours',
    value: [moment().subtract(12, 'hours'), moment()],
  },
  {
    label: 'Last 24 hours',
    value: [moment().subtract(24, 'hours'), moment()],
  },
  {
    label: 'Last 3 days',
    value: [moment().subtract(3, 'days'), moment()],
  },
  {
    label: 'Last 7 days',
    value: [moment().subtract(7, 'days'), moment()],
  },
  {
    label: 'Last 30 days',
    value: [moment().subtract(30, 'days'), moment()],
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
