import type { ColumnProps } from '@cffe/vc-hulk-table';
export const nodesSchema = ({ onEditClick }: { onEditClick: (record: any, index: number) => void }) =>
  [
    {
      title: '节点Ip',
      dataIndex: 'paramComponent',
      key: 'paramComponent',
    },
    {
      title: '主机名',
      dataIndex: 'paramName',
    },
    {
      title: '共享数据盘',
      dataIndex: 'paramValue',
    },
    {
      title: '角色',
      dataIndex: 'paramDescription',
    },
    {
        title: '用途',
        dataIndex: 'paramDescription',
      },
    {
      title: '操作',
      align: 'center',
      width: 125,
      dataIndex: 'operate',
      render: (text: string, record: any, index: number) => <a onClick={() => onEditClick(record, index)}>编辑</a>,
    },
  ] as ColumnProps[];