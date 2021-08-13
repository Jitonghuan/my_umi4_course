// data factory interface
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/16 11:17

export type EditorMode = 'HIDE' | 'EDIT' | 'ADD';

export interface TemplateItemProps {
  id?: number;
  name?: string;
  project?: number;
  env?: number[];
  createUser?: string;
  params?: any;
}

export interface RecordVo {
  id?: number;
  factoryId?: number;
  factoryName?: String;
  project?: number;
  env?: number[];
  createUser?: string;
  params?: any;
  errorLog?: String;
  response?: any;
}
