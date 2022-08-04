import { Tooltip } from 'antd';
import { datetimeCellRender } from '@/utils';
export const alarmTableSchema = [
  {
    title: 'ID',
    dataIndex: 'key',
    width: 60,
    render: (id: number) => <span>{id + 1}</span>,
  },
  {
    title: '告警名称',
    dataIndex: 'alarmName',
    width: 180,
    ellipsis: true,
    render: (value: string) => (
      <Tooltip placement="topLeft" title={value}>
        {value}
      </Tooltip>
    ),
  },
  {
    title: '告警日期',
    dataIndex: 'activeAt',
    width: 220,
    ellipsis: true,
    render: (value: string) => (
      <Tooltip placement="topLeft" title={datetimeCellRender(value)}>
        {datetimeCellRender(value)}
      </Tooltip>
    ),
  },
  {
    title: '告警描述',
    dataIndex: 'description',
    width: 300,
    ellipsis: true,
    render: (value: string) => (
      <Tooltip placement="topLeft" title={value}>
        {value}
      </Tooltip>
    ),
  },
];
