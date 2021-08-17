// data factory interface
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/16 11:17

export type EditorMode = 'HIDE' | 'EDIT' | 'ADD';

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
  params: Record<string, string>[];
  project: string;
}

export interface RecordVo {
  createUser: string;
  dbRemark?: string;
  env: string;
  errorLog?: string;
  factoryId: number;
  factoryName: string;
  gmtCreate: string;
  gmtModify: string;
  id: number;
  modifyUser?: string;
  project: string;
  params?: any;
  response?: any;
  status: number;
}
