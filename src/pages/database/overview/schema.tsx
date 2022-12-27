import { Button, Space ,Tooltip} from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import './index.less';
//3:mysql 4:postgresql 5:redis 6:mongdb 7:rds
export const getColorByValue = (value: string) => {
  if (!value || isNaN(Number(value))) {
    return '';
  }
  const nVal = Number(value);
  if (nVal < 80) {
    return '#439D75';
  } else if (nVal < 90) {
    return '#D16F0D';
  } else {
    return '#CC4631';
  }
};
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
    label: 'Cloud',
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
      render: (value: any) => {
        return <span>{value}%</span>;
      },
    },
    {
      title: 'Memory',
      dataIndex: 'memory',

      width: 220,
      render: (value: any) => {
        return <span>{value}%</span>;
      },
    },
    {
      title: 'Disk',
      dataIndex: 'disk',

      width: 300,
      render: (value: any) => {
        return <span>{value}%</span>;
      },
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
  export const sqlTableSchema = () =>
    [
      {
        title: '排名',
        dataIndex: 'name',
        width: 50,
        render: (value: any,record:any,index:number) => {
          return <span>{index+1}</span>
        },
      },
      {
        title: '实例',
        dataIndex: 'instancename',
        width: 100,
        ellipsis:true,
        render: (value: any) => {
          return <Tooltip title={value}>{value}</Tooltip>
        },
      },
      {
        title: '库名',
        dataIndex: 'db_max',
        width: 120,
        ellipsis:true,
        render: (value: any) => {
          return <Tooltip title={value}>{value}</Tooltip>
        },
      },
      {
        title: '执行次数',
        dataIndex: 'sum',
        width: 100,
        sorter: {
          compare: (a: any, b: any) => a.sum - b.sum,
        },
      },
     
    ] as ColumnProps[];
