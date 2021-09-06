import { datetimeCellRender } from '@/utils';

// 表格 schema
export const createTableSchema = () => [
  {
    width: 80,
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '分支名',
    dataIndex: 'branchName',
  },
  {
    title: '变更原因',
    dataIndex: 'desc',
  },
  {
    width: 160,
    title: '创建时间',
    dataIndex: 'gmtCreate',
    render: datetimeCellRender,
  },
  {
    width: 80,
    title: '创建人',
    dataIndex: 'createUser',
  },
];
