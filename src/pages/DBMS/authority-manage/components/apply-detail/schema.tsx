
import moment from "moment";
export const options = [
    { label: '库权限', value: 'library' },
    { label: '表权限', value: 'table' },
    { label: '库Owner', value: 'libraryOwner' },
    { label: 'limit限制', value: 'limit' },
  ];
  export const timeOptions = [
    { label: '一个月', value: 'Apple' },
    { label: '三个月', value: 'Pear' },
    { label: '一年', value: 'Orange' },
    { label: '三年', value: 'xixi' },
  ];
  export const checkOptions = [
    { label: '查询', value: 'Apple' },
    { label: '变更', value: 'Pear' },
  ];
  // 时间枚举


export const START_TIME_ENUMS = [
 
  {
    label: '一个月',
    value: [moment().subtract(1, 'months'), moment()],
  },
  {
    label: '三个月',
    value: [moment().subtract(3, 'months'), moment()],
  },
  {
    label: '一年',
    value: [moment().subtract(1, 'years'), moment()],
  },
  {
    label: '三年',
    value: [moment().subtract(3, 'years'), moment()],
  },
];