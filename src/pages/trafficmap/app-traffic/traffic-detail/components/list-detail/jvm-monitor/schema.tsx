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
    title: '运行时长(天)',
    width: 110,
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
  dataSource?.map((item: any, index: number) => {
    item?.map((ele: any) => {
      arry.push({
        name: ele?.name,
        data: ele.data,
        type: 'line',
      });
      nameArry.push(ele?.name);


    })



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
      data: nameArry,
      // data: ['FullGC次数', 'YoungGC次数'],
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
        name: '单位：次',
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
    ],
    series: arry
    // series: [
    //   {
    //     name: 'FullGC次数',
    //     data: dataSource?.[0] || [],
    //     type: 'line',
    //   },
    //   {
    //     // yAxisIndex: 1,
    //     name: 'YoungGC次数',
    //     data: dataSource?.[1] || [],
    //     type: 'line',
    //   },
    // ],
  };
};

// GC 耗时
export const getGCTimeChartOption: any = (xAxis = [], dataSource = []) => {

  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any, index: number) => {
    item?.map((ele: any) => {
      arry.push({
        name: ele?.name,
        data: ele.data,
        type: 'line',
      });

      nameArry.push(ele?.name);
    })



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
      data: nameArry,
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
        name: '单位：毫秒',
        type: 'value',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
    ],
    series: arry
  };
};

// 内存
export const getMemoryChartOption: any = (xAxis = [], dataSource: any = []) => {

  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any, index: number) => {
    item?.map((ele: any) => {
      arry.push({
        name: ele?.name,
        data: ele.data,
        type: 'line',
      });
      nameArry.push(ele?.name);

    })



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
      data: nameArry,
      //data: ['使用总和', '年轻代Eden区', '年轻代Survivor区', '老年代'],
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
        name: '单位：MB',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
    ],
    series: arry,
    // series: [
    //   {
    //     name: '使用总和',
    //     data: arryone || [],
    //     type: 'line',
    //   },
    //   {
    //     name: '年轻代Eden区',
    //     data: arrytwo || [],
    //     type: 'line',
    //   },
    //   {
    //     name: '年轻代Survivor区',
    //     data: arrythree || [],
    //     type: 'line',
    //   },
    //   {
    //     name: '老年代',
    //     data: arryfour || [],
    //     type: 'line',
    //   },
    // ],
  };
};

// 元空间
export const getGCDataChartOption: any = (xAxis = [], dataSource = []) => {
  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any, index: number) => {
    item?.map((ele: any) => {
      arry.push({
        name: ele?.name,
        data: ele.data,
        type: 'line',
      });
      nameArry.push(ele?.name);

    })



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
      data: nameArry,
      //data: ['元空间'],
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
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
      },
      data: xAxis,
    },
    dataZoom: [
      {
        type: 'inside', //slider表示有滑动块的，inside表示内置的
        show: false,
      },
    ],
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
    series: arry
    // series: [
    //   {
    //     name: '元空间',
    //     data: dataSource?.[0] || [],
    //     type: 'line',
    //   },
    // ],
  };
};

// JVM线程
export const getThreadsChartOption: any = (xAxis = [], dataSource = []) => {
  let arry: any = [];
  let nameArry: any = [];
  dataSource?.map((item: any, index: number) => {
    item?.map((ele: any) => {
      arry.push({
        name: ele?.name,
        data: ele.data,
        type: 'line',
      });
      nameArry.push(ele?.name);

    })



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
      data: nameArry,
      //data: ['元空间'],
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
        formatter(value: string) {
          return value.substr(0, value.length - 3);
        },
      },
      data: xAxis,
    },
    dataZoom: [
      {
        type: 'inside', //slider表示有滑动块的，inside表示内置的
        show: false,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '单位：个',
        axisLabel: {
          color: '#999',
        },
        splitNumber: 3,
      },
    ],
    series: arry
    // series: [
    //   {
    //     name: '元空间',
    //     data: dataSource?.[0] || [],
    //     type: 'line',
    //   },
    // ],
  };
};
