// test cases interfaces
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:09

export interface SelectOptions<T = string> extends Record<string, any> {
  label: string;
  value: T;
}

export interface APIItemVO extends Record<string, any> {}

export interface CaseItemVO extends Record<string, any> {}
