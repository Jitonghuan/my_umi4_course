import type { ColumnProps } from '@cffe/vc-hulk-table';
export const DbUsageOptions=[
  {
  label:"RDS",
  value:"rds"
  },
  {
    label:"mysql",
    value:"mysql"
    },
]
export const nodesSchema = ({ onEditClick }: { onEditClick: (record: any, index: number) => void }) =>
  [
    {
      title: '节点Ip',
      dataIndex: 'serverIp',
      key: 'serverIp',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
    },
    {
      title: '共享数据盘',
      dataIndex: 'isRootDisk',
    },
    {
      title: '角色',
      dataIndex: 'nodeRole',
    },
    {
        title: '用途',
        dataIndex: 'dataDisk',
      },
    {
      title: '操作',
      align: 'center',
      width: 125,
      dataIndex: 'operate',
      render: (text: string, record: any, index: number) => <a onClick={() => onEditClick(record, index)}>编辑</a>,
    },
  ] as ColumnProps[];