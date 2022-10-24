import { Space, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { FormProps, OptionProps } from '@/components/table-search/typing';

// 列表页-表格
export const createTableColumns = () => {
  return [
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'operatorDisplay',
      key: 'operatorDisplay',
      width: '14%',
    },
    {
      title: '操作时间',
      dataIndex: 'operatorTime',
      key: 'operatorTime',
      width: '34%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '操作信息',
      dataIndex: 'operationInfo',
      key: 'operationInfo',
      width: '46%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
   
  ] as ColumnsType<any>;
};