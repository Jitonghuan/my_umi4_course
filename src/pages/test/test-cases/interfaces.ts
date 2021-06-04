// test cases interfaces
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:09

import type { DataNode } from 'antd/lib/tree/index';

export interface SelectOptions<Value = string, T = Record<string, any>>
  extends Record<string, any> {
  label: string;
  value: Value;
  /** 用于挂载到 option 上的业务数据 */
  data?: T;
}

export interface ProjectItemVO extends Record<string, any> {
  id: number;
  name: string;
  desc: string;
  createUser: string;
}

export interface TreeNode extends DataNode {
  title?: string;
  /** 节点级别， 1: 项目, 2: 模块, 3: 接口 */
  level?: number;
  /** 节点描述，也是 项目/模块 描述 */
  desc?: string;
  /** 一级节点ID，即项目ID */
  projectId: number;
  /** 二级节点ID，即模块ID */
  moduleId: number;

  children?: TreeNode[];
}

export type EditorMode = 'HIDE' | 'EDIT' | 'ADD';

/** 用于 新增/编辑 节点的返回值 */
export interface TreeNodeSaveData extends Record<string, any> {
  id?: number;
  name: string;
  desc: string;
  modifyUser?: string;
  createUser?: string;
}

export interface CaseItemVO extends Record<string, any> {}

export interface KVItemProps extends Record<string, any> {
  key: string;
  value: string;
}

export interface KVDItemProps extends KVItemProps {
  desc: string;
}
