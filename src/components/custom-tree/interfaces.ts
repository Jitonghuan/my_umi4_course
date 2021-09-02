import type { TreeProps, DataNode } from 'antd/lib/tree';

export interface TreeNode extends DataNode {
  /** 业务ID，即服务端返回的 id 字段，方便将 key 和 id 区分开来 */
  bizId?: number;
  /** 节点标题，(可用于搜索的字段) */
  title?: string;
  /** 节点级别， 1: 项目, 2: 模块, 3: 接口/场景 */
  level?: number;
  /** 节点描述，(可用于搜索的字段) */
  desc?: string;
  /** 一级节点ID，即项目ID */
  projectId?: number;
  /** 二级节点ID，即模块ID */
  moduleId?: number;

  children?: TreeNode[];
  parent?: TreeNode;

  [x: string]: any;
}

export interface CustomTreeProps extends TreeProps {
  searchPlaceholder?: string;
  showSearch?: boolean;
  treeData: TreeNode[];
  /** 搜索时保留根节点 */
  keepRootInSearch?: boolean;

  /** 左侧搜索栏配置项 */
  showSideSelect?: boolean;
  onSideSelectChange?: (val: string) => void;
  sideSelectPlaceholder?: string;
  sideSelectOptions: any[];
}
