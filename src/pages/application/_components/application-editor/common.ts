// app editor common
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/24 19:33

import { AppType, AppDevelopLanguage, deployModelType, AppFeProjectType, AppMicroFeType } from '../../interfaces';

export const appTypeOptions: IOption<AppType>[] = [
  { label: '后端', value: 'backend' },
  { label: '前端', value: 'frontend' },
];
export const deployModelOptions: IOption<deployModelType>[] = [
  { label: '在线发布', value: 'online' },
  { label: '离线发布', value: 'offline' },
];

export const appDevelopLanguageOptions: IOption<AppDevelopLanguage>[] = [
  { label: 'GOLANG', value: 'golang' },
  { label: 'JAVA', value: 'java' },
  { label: 'PYTHON', value: 'python' },
];

export const isClientOptions: IOption<number>[] = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

export const appFeProjectTypeOptions: IOption<AppFeProjectType>[] = [
  { label: '单工程', value: 'single' },
  { label: '多工程 (微前端)', value: 'micro' },
];

export const appMicroFeTypeOptions: IOption<AppMicroFeType>[] = [
  { label: '主应用', value: 'mainProject' },
  { label: '子应用', value: 'subProject' },
];

export const feTypeOptions: IOption<any>[] = [
  { label: 'web', value: 'web' },
  { label: '定制包', value: 'customPack' },
  { label: '定制页面', value: 'customPage' },
];
export const singleFeTypeOptions: IOption<any>[] = [
  { label: 'web', value: 'web' },
  { label: 'PDA', value: 'pda' },
  { label: '独立前端', value: 'aloneFe' },
];
export const microFeTypeOptions: IOption<any>[] = [
  { label: 'web', value: 'web' },
  { label: '定制包', value: 'customPack' },
  { label: '定制页面', value: 'customPage' },
];
// export const relationMainAppCodeOptions: IOption[] = [
//   'g3a_future-his-portal-web',
//   'gmc_future-his-portal-web',
//   'hbos_portal',
// ].map((n) => ({ label: n, value: n }));

// 布署的 jenkins 任务选项
// 此配置直接写在前端工程中，后续如果有新增，直接修改此枚举即可
export const deployJobUrlOptions: IOption[] = [
  { label: 'SEENEW HIS 构建任务', value: 'http://jenkins-fe.cfuture.shop/job/seenew-his' },
  { label: 'HBOS 工程构建任务', value: 'http://jenkins-fe.cfuture.shop/job/fe-hbos' },
  { label: '通用构建任务', value: 'http://jenkins-fe.cfuture.shop/job/fe-single' },
  { label: 'HIS EMR', value: 'http://jenkins-fe.cfuture.shop/job/emr-loader' },
  { label: '打印模版', value: 'http://jenkins-fe.cfuture.shop/job/fe-printer-main' },
  { label: '定制包 构建任务', value: 'http://jenkins-fe.cfuture.shop/job/matrix-hbos-extensions' },
  { label: '定制页面 构建任务', value: 'http://jenkins-fe.cfuture.shop/job/matrix-hbos-extension-pages' },
  { label: 'PDA 构建任务', value: 'http://jenkins-fe.cfuture.shop/job/fe-hbos-pda' },
  { label: '独立前端 构建任务', value: 'http://jenkins-fe.cfuture.shop/job/fe-alone' },
];
