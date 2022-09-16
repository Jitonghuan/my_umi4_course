import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';

// 列表页-表格
export const createTableColumns = () => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
  
    {
        title: 'sql语句',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '扫描行数',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '审核状态',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
     
      {
        title: '审核结果',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '28%',
        ellipsis: true,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
     
  ] as ColumnsType<any>;
};