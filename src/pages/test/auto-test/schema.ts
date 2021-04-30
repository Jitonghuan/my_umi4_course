import { ColumnProps } from '@cffe/vc-hulk-table';

// 用例表格 schema
export const testCaseTableSchema: ColumnProps[] = [
  {
    title: '用例集',
    dataIndex: 'groupName',
    ellipsis: true,
    copyable: true,
    width: 100,
  },
  {
    title: '用例名称',
    dataIndex: 'testCase',
    width: 200,
    ellipsis: true,
    copyable: true,
  },
  {
    title: '用例标签',
    dataIndex: 'caseLabel',
    width: 60,
  },
];
