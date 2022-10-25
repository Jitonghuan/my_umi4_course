import type { ColumnProps } from '@cffe/vc-hulk-table';
import { Switch} from 'antd';
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
      title: '共享系统盘',
      dataIndex: 'isRootDisk',
      render: (enable: boolean, record: any, index: number) => (
        <>
          <Switch
            checked={enable===true? true : false}
            disabled={true}
            onClick={() => {
             
            }}
          />
        </>
      ),
    },
    {
      title: '角色',
      dataIndex: 'nodeRole',
    },
    {
        title: '用途',
        dataIndex: 'nodePurpose',
        render: (data: any, record: any, index: number) => <span>{data?.join(',')||"--"}</span>,

      },
    {
      title: '操作',
      align: 'center',
      width: 125,
      dataIndex: 'operate',
      render: (text: string, record: any, index: number) => <a onClick={() => onEditClick(record, index)}>编辑</a>,
    },
  ] as ColumnProps[];