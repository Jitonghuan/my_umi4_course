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
    width: 120,
  },
  {
    title: 'CPU核',
    dataIndex: 'cpuCoreNum',
    width: 120,
  },
  {
    title: '5m负载',
    dataIndex: 'load',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.load - b.load,
    },
  },
  {
    title: 'CPU使用率',
    dataIndex: 'cpuUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.cpuUsageRate - b.cpuUsageRate,
    },
  },
  {
    title: '内存使用率',
    dataIndex: 'memoryUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.memoryUsageRate - b.memoryUsageRate,
    },
  },
  {
    title: '分区使用率',
    dataIndex: 'diskUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
];

export const podUseTableSchema = [
  {
    title: 'Name space',
    dataIndex: 'NameSpace',
    align: 'left',
    width: 140,
  },
  {
    title: 'Name',
    dataIndex: 'HostName',
    align: 'left',
    sorter: {
      compare: (a: any, b: any) => a.HostName.localeCompare(b.HostName),
    },
    width: 200,
  },
  {
    title: 'IP',
    dataIndex: 'HostIP',
    align: 'left',
    width: 200,
  },
  {
    title: '内存(GB)',
    dataIndex: 'MemLimit',
    width: 120,
  },
  {
    title: 'CPU核',
    dataIndex: 'CpuLimit',
    width: 120,
  },

  {
    title: 'CPU使用率',
    dataIndex: 'Cpu',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.Cpu - b.Cpu,
    },
  },
  {
    title: '内存使用率(WSS)',
    dataIndex: 'Wss',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.Wss - b.Wss,
    },
  },
  {
    title: '内存使用率（RSS)',
    dataIndex: 'Rss',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.Rss - b.Rss,
    },
  },
  {
    title: '磁盘使用率（RSS)',
    dataIndex: 'Disk',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.Disk - b.Disk,
    },
  },
];
