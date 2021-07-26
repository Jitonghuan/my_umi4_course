export const resUseTableSchema = [
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'left',
    width: 200,
  },
  {
    title: '主机名',
    dataIndex: 'hostname',
    align: 'left',
    sorter: {
      compare: (a: any, b: any) => a.hostname.localeCompare(b.hostname),
    },
  },
  {
    title: '内存(GB)',
    dataIndex: 'memoryTotal',
    width: 100,
  },
  {
    title: 'CPU核',
    dataIndex: 'cpuCoreNum',
    width: 100,
  },
  {
    title: '5m负载',
    dataIndex: 'load',
    width: 100,
    sorter: {
      compare: (a: any, b: any) => a.load - b.load,
    },
  },
  {
    title: 'CPU使用率',
    dataIndex: 'cpuUsageRate',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.cpuUsageRate - b.cpuUsageRate,
    },
  },
  {
    title: '内存使用率',
    dataIndex: 'memoryUsageRate',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.memoryUsageRate - b.memoryUsageRate,
    },
  },
  {
    title: '分区使用率',
    dataIndex: 'diskUsageRate',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
];
