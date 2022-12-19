import { Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

// 列表页-表格
export const createTableColumns = () => {
  return [
    // {
    //   title: '审核状态',
    //   dataIndex: 'auditStatusDesc',
    //   key: 'auditStatusDesc',
    //   width: 120,
    // },
    {
      title: '操作人',
      dataIndex: 'auditUserName',
      key: 'auditUserName',
      width: '14%',
    },
    {
      title: '操作时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      width: '30%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '操作信息',
      dataIndex: 'auditStatusDesc',
      key: 'auditStatusDesc',
      width: '50%',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
   
  ] as ColumnsType<any>;
};