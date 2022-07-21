import { AppstoreOutlined, BarsOutlined, ControlOutlined, RocketOutlined } from '@ant-design/icons';
import { Button, Space, Form, Card, Segmented, Spin, Table } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';
//3:mysql 4:postgresql 5:redis 6:mongdb 7:rds
export const options = [
  {
    label: 'MySQL',
    value: 3,
    // icon: <BarsOutlined />,
  },
  {
    label: 'PostgreSQL',
    value: 4,
    // icon: <AppstoreOutlined />,
  },
  {
    label: 'Redis',
    value: 5,
    // icon: <ControlOutlined />,
  },
  {
    label: 'MogoDB',
    value: 6,
    // icon: <RocketOutlined />,
  },
  {
    label: 'Rds',
    value: 7,
    // icon: <RocketOutlined />,
  },
];

// 表格 schema
export const tableSchema = ({
  onPerformanceTrendsClick,
}: {
  onPerformanceTrendsClick: (record: any, index: number) => void;
}) =>
  [
    {
      title: '实例ID/名称',
      dataIndex: 'name',

      width: 200,
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      width: 180,
    },
    {
      title: 'Memory',
      dataIndex: 'memory',

      width: 220,
    },
    {
      title: 'Disk',
      dataIndex: 'disk',

      width: 300,
    },
    {
      title: 'TPS',
      dataIndex: 'tps',

      width: 200,
    },
    {
      title: 'QPS',
      dataIndex: 'qps',

      width: 200,
    },
    {
      title: 'SlowQueries',
      dataIndex: 'slowQueries',

      width: 200,
    },
    {
      title: 'ConnectedThreads',
      dataIndex: 'connectedThreads',
      width: 200,
    },
    //runningThreads
    {
      title: 'RunningThreads',
      dataIndex: 'runningThreads',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 50,
      render: (value: string, record: any, index: number) => {
        return (
          <Space>
            <Button size="small" type="primary" onClick={() => onPerformanceTrendsClick(record, index)}>
              性能趋势
            </Button>
          </Space>
        );
      },
    },
  ] as ColumnProps[];
