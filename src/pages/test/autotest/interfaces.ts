// test cases interfaces
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:09

import type { TreeNode } from '@/components/custom-tree/interfaces';

export interface ProjectItemVO extends Record<string, any> {
  id: number;
  name: string;
  desc: string;
  createUser: string;
}

export { TreeNode };

/** 用于 新增/编辑 节点的返回值 */
export interface TreeNodeSaveData extends Record<string, any> {
  id?: number;
  name: string;
  desc: string;
  modifyUser?: string;
  createUser?: string;
}

/** 用例 item */
export interface CaseItemVO extends Record<string, any> {
  id: number;
  name: string;
  apiId: number;
  desc: string;
  headers?: { key: string; value: string }[];
  resAssert?: {
    assertName: string;
    compare: string;
    type: string;
    value: string;
  }[];
  savedVars?: { name: string; jsonpath: string }[];
  customVars?: { key: string; type: string; value: string; desc?: string }[];
  // hooks?: string; // 返回的数据是一个字符串，需要 JSON 序列化
}

export interface PreCaseItemProps {
  projectId: number;
  projectName: string;
  moduleId: number;
  moduleName: string;
  apiId: number;
  apiName: string;
  caseId: number;
  caseName: string;
}

export interface FuncProps {
  id: number;
  desc?: string;
  name?: string;
  argument?: string;
}

/** 场景模型 */
export interface SceneItemVO extends Record<string, any> {
  id: number;
  name: string;
  desc: string;
  cases: number[];
  moduleId: number;
  moduleName: string;
  projectName: string;
  createUser: string;
  modifyUser: string;
}

/** 任务模型 */
export interface TaskItemVO extends Record<string, any> {
  id: number;
  deleted: 0 | 1;
  dbRemark?: string;
  name: string;
  cron: string;
  runEnv: number;
  testSuite: number[];
  /** 集合类型，0 - 用例集合, 1: 场景集合 */
  suiteType: number;
  status: 0 | 1;
}

export interface TaskReportItemVO extends Record<string, any> {
  id: number;
  taskId: number;
  passRate: number;
  casesNum: number;
  success: number;
  failure: number;
  error: number;
  startTime: string;
  endTime: string;
  /** 触发方式 0: 手动, 1: 自动 */
  triggered: 0 | 1;
}
