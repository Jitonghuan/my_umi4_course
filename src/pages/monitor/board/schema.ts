export const resUseTableSchema = [
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 200,
  },
  {
    title: '主机名',
    dataIndex: 'hostname',
    sorter: {
      compare: (a: any, b: any) => a.hostname.localeCompare(b.hostname),
    },
  },
  {
    title: '内存(GB)',
    dataIndex: 'memoryTotal',
  },
  {
    title: 'CPU核',
    dataIndex: 'cpuCoreNum',
  },
  {
    title: '5m负载',
    dataIndex: 'load',
  },
  {
    title: 'CPU使用率',
    dataIndex: 'cpuUsageRate',
    sorter: {
      compare: (a: any, b: any) => a.cpuUsageRate - b.cpuUsageRate,
    },
  },
  {
    title: '内存使用率',
    dataIndex: 'memoryUsageRate',
    sorter: {
      compare: (a: any, b: any) => a.memoryUsageRate - b.memoryUsageRate,
    },
  },
  {
    title: '分区使用率',
    dataIndex: 'diskUsageRate',
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
];
