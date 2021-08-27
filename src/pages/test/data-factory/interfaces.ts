// data factory interface
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/16 11:17

export interface TempParamsProps {
  name: string;
  desc: string;
  value: string;
  type: string;
}

export interface TemplateItemProps {
  createUser: string;
  dbRemark?: string;
  desc?: string;
  env: string;
  gmtCreate: string;
  gmtModify: string;
  id: number;
  modifyUser?: string;
  name: string;
  params?: TempParamsProps[];
  project: string;
}

export interface RecordVo {
  createUser: string;
  dbRemark?: string;
  env: string;
  factoryId: number;
  factoryName: string;
  gmtCreate: string;
  gmtModify: string;
  id: number;
  logInfo: string;
  modifyUser?: string;
  project: string;
  params?: any;
  response?: any;
  status: number;
}
