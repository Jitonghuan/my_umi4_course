// interface
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/25 09:28

export type EditorMode = 'HIDE' | 'ADD' | 'EDIT';

export interface SelectOptions<T = string> {
  label: string;
  value: T;

  [x: string]: any;
}
