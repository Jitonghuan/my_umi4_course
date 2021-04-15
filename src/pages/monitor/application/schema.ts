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
    dataIndex: 'ip',
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
    dataIndex: 'upTime',
    title: '运行时长',
  },
  {
    dataIndex: 'health',
    title: '健康状态',
    valueType: 'status',
    statusEnum: {
      '0': {
        text: '异常',
        color: 'red',
      },
      '1': {
        text: '健康',
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
      left: 30,
      right: 40,
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
      data: [
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
      ],
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
        data: [1, 2, 2, 1, 3, 2, 1],
        type: 'line',
      },
      {
        yAxisIndex: 1,
        name: 'YoungGC次数',
        data: [200, 4, 2, 5, 3, 2, 1],
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
      left: 30,
      right: 40,
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
      data: [
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
      ],
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
        data: [1, 2, 2, 1, 3, 2, 1],
        type: 'line',
      },
      {
        yAxisIndex: 1,
        name: 'YoungGC次数',
        data: [200, 4, 2, 5, 3, 2, 1],
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
      left: 30,
      right: 40,
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
      data: [
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
      ],
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
        data: [1, 2, 2, 1, 3, 2, 1],
        type: 'line',
      },
      {
        yAxisIndex: 1,
        name: 'YoungGC次数',
        data: [200, 4, 2, 5, 3, 2, 1],
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
      left: 30,
      right: 40,
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
      data: [
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
        '03-31 11:09',
      ],
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
        data: [1, 2, 2, 1, 3, 2, 1],
        type: 'line',
      },
      {
        yAxisIndex: 1,
        name: 'YoungGC次数',
        data: [200, 4, 2, 5, 3, 2, 1],
        type: 'line',
      },
    ],
  };
};
