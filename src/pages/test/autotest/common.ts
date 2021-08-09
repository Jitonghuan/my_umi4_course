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

  const formatter = (list: any[], level = 1, addon: Record<string, any>) => {
    return list.map((n: any) => {
      const node: TreeNode = {
        bizId: n.id,
        key: `l${level}-${n.id}`,
        title: n.name,
        desc: n.desc,
        selectable: true,
        level,
        ...addon,
      };

      const nextAddon = { ...addon };
      // 从第一层取项目ID，放到后代节点中
      if (level === 1) nextAddon.projectId = n.id;
      // 从第二层取模块ID，放到后代节点中
      if (level === 2) nextAddon.moduleId = n.id;
      // 第三层是接口 ID 或场景 ID

      if (level < 3) {
        node.children = formatter(n.children || [], level + 1, nextAddon);
      } else {
        node.isLeaf = true;
      }

      return node;
    });
  };

  return formatter(payload, 1, {});
}

export function formatTreeSelectData(payload: any[], deep = 3) {
  if (!payload?.length) return [];
  if (Array.isArray(payload[0])) {
    payload = payload.flat(1);
  }

  const formatter = (list: any[], level = 1, parentName = '') => {
    return list.map((n: any) => {
      const node: Record<string, any> = {
        value: level === deep ? n.id : `l${level}-${n.id}`,
        title: n.name,
        selectable: level === deep,
        disabled: level < deep && !n.children?.length,
      };
      const display = parentName ? `${parentName}/${n.name}` : n.name;

      if (level < deep) {
        node.children = formatter(n.children || [], level + 1, display);
      } else {
        node.display = display;
        node.isLeaf = true;
      }

      return node;
    });
  };

  return formatter(payload, 1);
}
