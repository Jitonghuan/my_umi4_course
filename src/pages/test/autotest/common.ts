// test case common functions
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 23:42

import { SelectOptions, TreeNode, SceneItemVO } from './interfaces';

export const API_TYPE = {
  HTTP: 0,
  DUBBO: 1,
  _default: 0,
};

export const PARAM_TYPE = {
  FORM_DATA: 1,
  FORM_URLENCODE: 2,
  PARAMS: 3,
  JSON: 0,
  _default: 1,
};

export const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTION: 'OPTION',
  _default: 'GET',
};

// API 类型
export const API_TYPE_OPTIONS: SelectOptions<number>[] = [
  { label: 'http', value: 0 },
  { label: 'dubbo', value: 1 },
];

// 参数类型
export const PARAM_TYPE_OPTIONS: SelectOptions<number>[] = [
  { label: 'form-data', value: 1 },
  { label: 'x-www-form-urlencode', value: 2 },
  { label: 'params', value: 3 },
  { label: 'application/json', value: 0 },
];

export const API_METHOD_OPTIONS: SelectOptions<string>[] = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTION', value: 'OPTION' },
];

/** 比较方式 */
export const ASSERT_COMPARE_ENUM = [
  'eq', // "实际结果"和"期望结果"相等
  'lt', // "实际结果"小于"期望结果"
  'le', // "实际结果"小于等于"期望结果"
  'gt', // "实际结果"大于"期望结果"
  'ge', // "实际结果"大于等于"期望结果"
  'ne', // "实际结果"和"期望结果"不相等
  'str_eq', // 转义字符串后对比，"实际结果"和"期望结果"相等
  'len_eq', // 字符串或list长度，"实际结果"和"期望结果"相等
  'len_gt', // "实际结果的长度"大于"期望结果"
  'len_ge', // "实际结果的长度"大于等于"期望结果"
  'len_lt', // "实际结果的长度"小于"期望结果"
  'len_le', // "实际结果的长度"小于等于"期望结果"
  'contains', // 预期结果是否被包含在实际结果中
  'contained_by', // 实际结果是否被包含在预期结果中
  'type_match', // 类型是否匹配
  'regex_match', // 正则表达式是否匹配
  'startswith', // 字符串是否以什么开头
  'endswith', // 字符串是否以什么结尾
].map((n) => ({ label: n, value: n }));

/** 数据类型 */
export const VALUE_TYPE_ENUM = ['String', 'Integer', 'Float', 'Boolean', 'List', 'Dict'].map((n) => ({
  label: n,
  value: n,
}));

/** 广度遍历查找节点 */
export function findTreeNodeByKey(treeData: TreeNode[], key?: number | string): TreeNode | null {
  if (!key) return null;
  if (!treeData.length) return null;

  const node = treeData.find((n) => n.key === key);
  if (node) return node;

  const nextLevelList = treeData.map((n) => n.children || []).flat();

  // 遍历下一个层级
  return findTreeNodeByKey(nextLevelList, key);
}
/** 返回合并后的数组 */
export function getMergedList<T, U>(list: T[], addon: U, callback: (item: T, addon: U) => boolean) {
  if (!list.length) return [];

  const next = list.slice(0);
  const index = next.findIndex((n) => callback(n, addon));

  if (index > -1) {
    next[index] = {
      ...next[index],
      ...addon,
    };
  }

  return next;
}

export function createNodeDataFromSceneItem(item: SceneItemVO): TreeNode {
  return {
    key: `l3-${item.id}`,
    title: item.name,
    desc: item.desc,
    projectId: item.projectId,
    moduleId: item.moduleId,
    bizId: item.id,
    level: 3,
  };
}

export function formatTreeData(payload: any[]): TreeNode[] {
  if (!payload?.length) return [];

  // 第一层是项目
  return payload.map((n1: any) => ({
    bizId: n1.id,
    key: `l1-${n1.id}`,
    title: n1.name, // 项目名
    desc: n1.desc,
    selectable: true,
    level: 1, // 加上 level 方便判断
    // 第二层是模块
    children: (n1.children || []).map((n2: any) => ({
      bizId: n2.id,
      key: `l2-${n2.id}`,
      title: n2.name, // 模块名
      desc: n2.desc,
      selectable: true,
      level: 2,
      projectId: n1.id,
      // 第三层是接口
      children: (n2.children || []).map((n3: any) => ({
        bizId: n3.id,
        key: `l3-${n3.id}`,
        title: n3.name, // 接口或场景名
        desc: n3.desc, // 场景描述
        selectable: true,
        isLeaf: true,
        level: 3,
        projectId: n1.id,
        moduleId: n2.id,
      })),
    })),
  }));
}

export function formatTreeSelectData(payload: any[]) {
  if (!payload?.length) return [];
  if (Array.isArray(payload[0])) {
    payload = payload.flat(1);
  }

  return payload.map((n1: any) => ({
    value: `l1-${n1.id}`,
    title: n1.name,
    // desc: n1.desc,
    // level: 1,
    selectable: false,
    children: (n1.children || []).map((n2: any) => ({
      value: `l2-${n2.id}`,
      title: n2.name,
      // desc: n2.desc,
      // level: 2,
      selectable: false,
      children: (n2.children || []).map((n3: any) => ({
        value: n3.id,
        title: `${n1.name}/${n2.name}/${n3.name}`,
        // desc: n3.desc,
        // level: 3,
        isLeaf: true,
        selectable: true,
      })),
    })),
  }));
}
