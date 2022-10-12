import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';

// 列表页-表格
export const createTableColumns = () => {
  return [
    {
      title: '执行时间',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: '14%',
    },
    {
      title: '实例',
      dataIndex: 'instanceName',
      key: 'instanceName',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '库',
      dataIndex: 'dbCode',
      key: 'dbCode',
      width: '28%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
        title: 'sql语句',
        dataIndex: 'sqlContent',
        key: 'sqlContent',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '结果行数',
        dataIndex: 'affectedRow',
        key: 'affectedRow',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '耗时',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
     
  ] as ColumnsType<any>;
};