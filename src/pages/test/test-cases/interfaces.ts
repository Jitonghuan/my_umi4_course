// test cases interfaces
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:09

import type { DataNode } from 'antd/lib/tree/index';

export interface SelectOptions<T = string> extends Record<string, any> {
  label: string;
  value: T;
}

export interface TreeNode extends DataNode {
  key: number;
  level?: number;
  children?: TreeNode[];
}

export interface CaseItemVO extends Record<string, any> {}
