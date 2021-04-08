import { ColumnProps } from '@cffe/vc-hulk-table';

// 搜索过滤表单
export const filterSchema = {
  theme: 'inline',
  isShowReset: true,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'business',
        required: false,
        options: [
          {
            label: '测试',
            value: '1',
          },
        ],
      },
    },
    {
      type: 'Select',
      props: {
        label: '执行环境',
        name: 'env',
        required: false,
        options: [
          {
            label: '1',
            value: '1',
          },
        ],
      },
    },
  ],
};

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
    dataIndex: 'caseName',
    width: 200,
    ellipsis: true,
    copyable: true,
  },
  {
    title: '用例标签',
    dataIndex: 'caseLabel',
    width: 100,
  },
];
