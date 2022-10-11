
import moment from "moment";
export const options = [
    { label: '库权限', value: 2 },
    { label: '表权限', value: 3 },
    { label: '库Owner', value: 1 },
    { label: 'limit限制', value: 4 },
  ];
  export const timeOptions = [
    { label: '一个月', value: 'Apple' },
    { label: '三个月', value: 'Pear' },
    { label: '一年', value: 'Orange' },
    { label: '三年', value: 'xixi' },
  ];
  export const checkOptions = [
    { label: '查询', value: 2 },
    { label: '变更', value: 3 },
  ];
  // 时间枚举


export const START_TIME_ENUMS = [
 
  {
    label: '一个月',
    value:24 * 60 * 60 * 1000 * 30,
  },
  {
    label: '三个月',
    value: 24 * 60 * 60 * 1000 * 90,
  },
  {
    label: '一年',
    value: 24 * 60 * 60 * 1000 * 30 * 12,
  },
  {
    label: '三年',
    value: 24 * 60 * 60 * 1000 * 30 * 36,
  },
];