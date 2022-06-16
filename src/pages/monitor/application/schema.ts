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
  let fullDataArry: any = [];
  let youngDataArry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any) => {
    if (item?.name?.includes('full')) {
      item.data?.map((ele: any) => {
        fullDataArry.push(ele);
      });
    }
    if (item?.name?.includes('young')) {
      item.data?.map((ele: any) => {
        youngDataArry.push(ele);
      });
    }
    console.log('fullDataArry,youngDataArry', fullDataArry, youngDataArry);
    nameArry.push(item?.name);
  });

  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 45,
      top: 30,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: ['FullGC次数', 'YoungGC次数'],
      icon: 'rect',
      type: 'scroll', //分页类型
      orient: 'horizontal',
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
    series: [
      {
        name: 'FullGC次数',
        data: fullDataArry || [],
        type: 'line',
      },
      {
        // yAxisIndex: 1,
        name: 'YoungGC次数',
        data: youngDataArry || [],
        type: 'line',
      },
    ],
  };
};

// GC 耗时
export const getGCTimeChartOption: any = (xAxis = [], dataSource = []) => {
  let fullDataArry: any = [];
  let youngDataArry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any) => {
    if (item?.name?.includes('full')) {
      item.data?.map((ele: any) => {
        fullDataArry.push(ele);
      });
    }
    if (item?.name?.includes('young')) {
      item.data?.map((ele: any) => {
        youngDataArry.push(ele);
      });
    }

    nameArry.push(item?.name);
  });
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 45,
      top: 30,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: ['FullGC耗时', 'YoungGC耗时'],
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
    series: [
      {
        name: 'FullGC耗时',
        data: fullDataArry || [],
        type: 'line',
      },
      {
        // yAxisIndex: 1,
        name: 'YoungGC耗时',
        data: youngDataArry || [],
        type: 'line',
      },
    ],
  };
};

// 内存
export const getMemoryChartOption: any = (xAxis = [], dataSource = []) => {
  let oneDataArry: any = [];
  let twoDataArry: any = [];
  let threeDataArry: any = [];
  let fourDataArry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any) => {
    if (item?.name?.includes('使用总和')) {
      item.data?.map((ele: any) => {
        oneDataArry.push(ele);
      });
    }
    if (item?.name?.includes('年轻代Eden区')) {
      item.data?.map((ele: any) => {
        twoDataArry.push(ele);
      });
    }
    if (item?.name?.includes('年轻代Survivor区')) {
      item.data?.map((ele: any) => {
        threeDataArry.push(ele);
      });
    }
    if (item?.name?.includes('老年代')) {
      item.data?.map((ele: any) => {
        fourDataArry.push(ele);
      });
    }

    nameArry.push(item?.name);
  });
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 70,
      top: 34,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: ['使用总和', '年轻代Eden区', '年轻代Survivor区', '老年代'],
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
    series: [
      {
        name: '使用总和',
        data: oneDataArry || [],
        type: 'line',
      },
      {
        name: '年轻代Eden区',
        data: twoDataArry || [],
        type: 'line',
      },
      {
        name: '年轻代Survivor区',
        data: threeDataArry || [],
        type: 'line',
      },
      {
        name: '老年代',
        data: fourDataArry || [],
        type: 'line',
      },
    ],
  };
};

// 元空间
export const getGCDataChartOption: any = (xAxisy = [], dataSource = []) => {
  // let arry: any = [];
  // let nameArry: any = [];

  // dataSource?.map((item: any) => {
  //   arry.push({
  //     name: item?.name,
  //     data: item.data,
  //     type: 'line',
  //   });
  //   nameArry.push(item?.name);
  // });
  // console.log('xAxisy', xAxisy);
  // console.log('data', arry);
  let dataArry: any = [];

  let nameArry: any = [];
  dataSource?.map((item: any) => {
    if (item?.name?.includes('元空间')) {
      item.data?.map((ele: any) => {
        dataArry.push(ele);
      });
    }

    nameArry.push(item?.name);
  });
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      bottom: 45,
      top: 30,
      left: 30,
      right: 40,
      containLabel: true,
    },
    legend: {
      bottom: 0,
      data: ['元空间'],
      icon: 'rect',
      type: 'scroll', //分页类型
      orient: 'horizontal',
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
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
      },
      data: xAxisy,
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
    series: [
      {
        name: '元空间',
        data: dataArry || [],
        type: 'line',
      },
    ],
  };
};
