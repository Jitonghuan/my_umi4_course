// app editor common
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/24 19:33

import { AppType, AppDevelopLanguage, AppFeProjectType, AppMicroFeType } from '../../interfaces';

export const appTypeOptions: IOption<AppType>[] = [
  { label: '后端', value: 'backend' },
  { label: '前端', value: 'frontend' },
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
  { label: '主应用', value: 'main' },
  { label: '子应用', value: 'sub' },
];
