// test cases interfaces
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:09

export interface SelectOptions<Value = string, T = Record<string, any>> extends Record<string, any> {
  label: string;
  value: Value;
  /** 用于挂载到 option 上的业务数据 */
  data?: T;
}

export type EditorMode = 'HIDE' | 'EDIT' | 'ADD';

export interface KVProps {
  key: string;
  value?: string;
}

export interface PromitheusItemProps extends Record<string, any> {
  id?: number;
  name: string;
  appCode: string;
  envCode: string;
  interval: string;
  metricsUrl: string;
  labels: Record<string, any>;

  /** 仅编辑时使用 */
  labelList?: KVProps[];
}
