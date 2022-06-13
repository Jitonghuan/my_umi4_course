import { Tooltip } from 'antd';
export const alarmTableSchema = [
  {
    title: '告警名称',
    dataIndex: 'alarmName',
    width: 200,
  },
  {
    title: '告警日期',
    dataIndex: 'activeAt',
    width: 200,
  },
  {
    title: '告警描述',
    dataIndex: 'description',
    width: 300,
    render: (value: string) => (
      <Tooltip placement="topLeft" title={value}>
        {value}
      </Tooltip>
    ),
  },
];
