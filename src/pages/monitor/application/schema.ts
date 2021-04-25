// 应用详情表格 schema
export interface ITableSchema {
  ip: string;
  cpu: string;
  memory: string;
  disk: string;
  restartNum: string;
  upTime: string;
  health: 1 | 0;
}

// 表格schema
export const tableSchema = [
  {
    dataIndex: 'hostIP',
    title: 'POD IP',
  },
  {
    dataIndex: 'cpu',
    title: 'CPU使用率',
  },
  {
    dataIndex: 'memory',
    title: '内存使用率',
  },
  {
    dataIndex: 'disk',
    title: '磁盘使用率',
  },
  {
    dataIndex: 'restartNum',
    title: '重启次数',
  },
  {
    dataIndex: 'uptime',
    title: '运行时长(天)',
  },
  {
    dataIndex: 'health',
    title: '健康状态',
    valueType: 'status',
    statusEnum: {
      '0': {
        text: '',
        color: 'red',
      },
      '1': {
        text: '',
        color: 'green',
      },
    },
  },
];

// GC 次数
export const getGCNumChartOption: any = (xAxis = [], dataSource = []) => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 24,
      top: 50,
      left: 60,
      right: 0,
    },
    legend: {
      left: 0,
      data: ['FullGC次数', 'YoungGC次数'],
      icon: 'rect',
    },
    color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
      },
      data: xAxis,
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
      {
        position: 'right',
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitLine: {
          show: false,
        },
        splitNumber: 3,
      },
    ],
    series: [
      {
        name: 'FullGC次数',
        data: dataSource?.[0] || [],
        type: 'line',
      },
      {
        // yAxisIndex: 1,
        name: 'YoungGC次数',
        data: dataSource?.[1] || [],
        type: 'line',
      },
    ],
  };
};

// GC 耗时
export const getGCTimeChartOption: any = (xAxis = [], dataSource = []) => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 24,
      top: 50,
      left: 10,
      right: 0,
      containLabel: true,
    },
    legend: {
      left: 0,
      data: ['FullGC耗时', 'YoungGC耗时'],
      icon: 'rect',
    },
    color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
      },
      data: xAxis,
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
      {
        position: 'right',
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitLine: {
          show: false,
        },
        splitNumber: 3,
      },
    ],
    series: [
      {
        name: 'FullGC耗时',
        data: dataSource[0],
        type: 'line',
      },
      {
        // yAxisIndex: 1,
        name: 'YoungGC耗时',
        data: dataSource[1],
        type: 'line',
      },
    ],
  };
};

// 内存
export const getMemoryChartOption: any = (xAxis = [], dataSource = []) => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 24,
      top: 50,
      left: 60,
      right: 0,
    },
    legend: {
      left: 0,
      data: ['使用总和', '年轻代Eden区', '年轻代Survivor区', '老年代'],
      icon: 'rect',
    },
    color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
      },
      data: xAxis,
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
      {
        position: 'right',
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitLine: {
          show: false,
        },
        splitNumber: 3,
      },
    ],
    series: [
      {
        name: '使用总和',
        data: dataSource?.[0] || [],
        type: 'line',
      },
      {
        name: '年轻代Eden区',
        data: dataSource?.[1] || [],
        type: 'line',
      },
      {
        name: '年轻代Survivor区',
        data: dataSource?.[2] || [],
        type: 'line',
      },
      {
        name: '老年代',
        data: dataSource?.[3] || [],
        type: 'line',
      },
    ],
  };
};

// 元空间
export const getGCDataChartOption: any = (xAxis = [], dataSource = []) => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 24,
      top: 50,
      left: 60,
      right: 0,
    },
    legend: {
      left: 0,
      data: ['元空间'],
      icon: 'rect',
    },
    color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
      },
      data: xAxis,
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
      {
        position: 'right',
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitLine: {
          show: false,
        },
        splitNumber: 3,
      },
    ],
    series: [
      {
        name: '元空间',
        data: dataSource?.[0] || [],
        type: 'line',
      },
    ],
  };
};
