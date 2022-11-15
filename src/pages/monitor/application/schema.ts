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
    title: 'IP',
    align: 'left',
    width: 180,
  },
  {
    title: '主机名',
    dataIndex: 'hostName',
    align: 'left',
    width: 240,
  },
  {
    dataIndex: 'memLimit',
    title: '总内存(MB)',
    width: 100,
  },
  {
    dataIndex: 'cpuLimit',
    title: 'CPU核数',
    width: 90,
  },
  {
    dataIndex: 'cpu',
    title: 'CPU使用率',
    width: 100,
  },
  {
    dataIndex: 'RSS',
    title: '内存使用率(RSS)',
    width: 160,
  },
  {
    dataIndex: 'WSS',
    title: '内存使用率(WSS)',
    width: 160,
  },
  {
    dataIndex: 'disk',
    title: '磁盘使用量(MB)',
    width: 140,
  },
  {
    dataIndex: 'restartNum',
    title: '重启次数',
    width: 90,
  },
  {
    dataIndex: 'uptime',
    title: '运行时长',
    width: 120,
  },
  {
    dataIndex: 'health',
    title: '健康状态',
    valueType: 'status',
    width: 90,
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
  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any) => {
    arry.push({
      name: item?.name,
      data: item.data,
      type: 'line',
    });
    nameArry.push(item?.name);
  });

  return {
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      {
        type: 'inside', //slider表示有滑动块的，inside表示内置的
        show: false,
      },
    ],

    grid: {
      bottom: 45,
      top: 30,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: nameArry,
      icon: 'rect',
      type: 'scroll', //分页类型
      orient: 'horizontal',
    },
    // color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
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
    ],
    series: arry,
  };
};

// GC 耗时
export const getGCTimeChartOption: any = (xAxis = [], dataSource = []) => {
  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any) => {
    arry.push({
      name: item?.name,
      data: item.data,
      type: 'line',
    });
    nameArry.push(item?.name);
  });
  return {
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      {
        type: 'inside', //slider表示有滑动块的，inside表示内置的
        show: false,
      },
    ],

    grid: {
      bottom: 45,
      top: 30,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: nameArry,
      icon: 'rect',
      type: 'scroll', //分页类型
      orient: 'horizontal',
    },
    // color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
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
    ],
    series: arry,
  };
};

// 内存
export const getMemoryChartOption: any = (xAxis = [], dataSource = []) => {
  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any) => {
    arry.push({
      name: item?.name,
      data: item.data,
      type: 'line',
    });
    nameArry.push(item?.name);
  });
  
  return {
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      {
        type: 'inside', //slider表示有滑动块的，inside表示内置的
        show: false,
      },
    ],

    grid: {
      bottom: 70,
      top: 34,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: nameArry,
      icon: 'rect',
      type: 'scroll', //分页类型
      orient: 'horizontal',
    },
    // color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
      },
      data: xAxis,
    },
    yAxis: [
      {
        type: 'value',
        name: '单位：MB',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
    ],
    series: arry,
  };
};

// 元空间
export const getGCDataChartOption: any = (xAxis = [], dataSource = []) => {
  let arry: any = [];
  let nameArry: any = [];

  dataSource?.map((item: any) => {
    arry.push({
      name: item?.name,
      data: item.data,
      type: 'line',
    });
    nameArry.push(item?.name);
  });
  return {
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      {
        type: 'inside', //slider表示有滑动块的，inside表示内置的
        show: false,
      },
    ],

    grid: {
      bottom: 45,
      top: 30,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: nameArry,
      icon: 'rect',
      type: 'scroll', //分页类型
      orient: 'horizontal',
    },
    // color: ['#4BA2FF', '#54DA81'],
    xAxis: {
      type: 'category',

      axisLine: {
        lineStyle: {
          color: '#4BA2FF',
        },
      },
      axisLabel: {
        color: '#999',
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
      },
      data: xAxis,
    },
    yAxis: [
      {
        type: 'value',
        name: '单位：MB',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
    ],
    series: arry,
  };
};
