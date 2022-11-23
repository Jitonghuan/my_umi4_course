import moment from 'moment';

export const menuList = [
  {
    name: '总览',
    key: '',
  },
  {
    name: '医生端',
    key: 'doctor',
  },
  {
    name: '医生综合',
    key: 'comprehensive-doctor',
  },
  {
    name: '分诊端',
    key: 'triage',
  },
  {
    name: '药师端',
    key: 'pharmacist',
  },
  {
    name: '收费端',
    key: 'charge',
  },
  {
    name: '护士端',
    key: 'nurse',
  },
  {
    name: '血库端',
    key: 'blood',
  },
  {
    name: '检查端',
    key: 'examination',
  },
  {
    name: '检验端',
    key: 'laboratory',
  },
  {
    name: '手术端',
    key: 'surgery',
  },
  {
    name: '治疗端',
    key: 'treatment',
  },
  {
    name: '病理端',
    key: 'pathology',
  },
  {
    name: '医技助理',
    key: 'medical-technician-assistant',
  },
  {
    name: '门诊助理',
    key: 'outpatient-assistant',
  },
  {
    name: '医务管理',
    key: 'medical',
  },
];

export const groupItem = [
  {
    name: '载入时长>20s',
    key: '20',
  },
  {
    name: '20s≥载入时长>10s',
    key: '10,20',
  },
  {
    name: '10s≥载入时长>5s',
    key: '5,10',
  },
  {
    name: '5s≥载入时长>2s',
    key: '2,5',
  },
  {
    name: '2s≥载入时长>1s',
    key: '1,2',
  },
  {
    name: '1s≥载入时长',
    key: '1',
  },
];

export const performanceItem = [
  {
    name: 'tti',
    desc: '页面从开始加载到可响应用户行为的时间',
  },
  {
    name: 'ttfb',
    desc: '网络请求耗时，浏览器第一次收到响应的时间',
  },
  {
    name: 'lcp',
    desc: '页面最大内容渲染时间',
  },
  {
    name: 'fcp',
    desc: '页面上首次渲染出节点的时间',
  },
  {
    name: 'fid',
    desc: '首次交互行为延迟时间',
  },
  {
    name: 'root-paint',
    desc: '子应用切换加载时间',
  },
];

export const now = [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()];

export const envList: any = {
  fygs: [
    {
      name: '所有',
      key: '*',
    },
    {
      name: '院区',
      key: 'his.gushangke.com',
    },
    {
      name: '司内测试',
      key: 'fygs.seenew.info',
    },
  ],
  default: [
    {
      name: 'HBOS开发',
      key: 'hbos-dev.cfuture.shop',
    },
    {
      name: '所有',
      key: '*',
    },
    {
      name: 'HBOS测试',
      key: 'hbos-test.cfuture.shop',
    },
    {
      name: 'HBOS演示',
      key: 'hbos-seenewhospital.cfuture.shop',
    },
  ],
};
