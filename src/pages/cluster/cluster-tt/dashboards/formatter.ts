// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/09 9:30

// A/B集群柱状图

export function ABClusterHistogram(histogramData: Record<string, any>) {
  const countList: any[] = [];
  const categoryList: string[] = [];
  for (var i in histogramData) {
    countList.push(histogramData[i]);
    categoryList.push(i);
  }

  return {
    //图例组件
    legend: {
      orient: 'vertical',
      top: 0,
      right: 0,
      icon: 'circle',
      textStyle: {
        //图例字体大小
        fontSize: 10,
      },
      itemHeight: 10,
    },
    //提示信息
    tooltip: {},
    color: [
      '#FFA500',
      '#CC99CC',
      '#FF99CC',
      '#FF0000',
      '#CD5C5C',
      '#FFA07A',
      '#FFCC33',
      '#8A2BE2',
      '#00CCFF',
      '#339900',
      '#6699FF',
      '#3300FF',
      '#999900',
      '#808080',
      '#99FF33',
      '#336666',
    ],

    dataset: {
      source: [
        [
          'product',
          // 'product',...categoryList,
          'A-赤城街道',
          'A-平桥镇',
          'A-其他',
          'A-天医-门诊楼',
          'A-天医-其他楼',
          'A-天医-医技楼',
          'A-天医-住院楼',
          'A-乡镇其他',
          'B-赤城街道',
          'B-平桥镇',
          'B-其他',
          'B-天医-门诊楼',
          'B-天医-其他楼',
          'B-天医-医技楼',
          'B-天医-住院楼',
          'B-乡镇其他',
        ],
        ['访问量', ...countList],
      ],
    },
    //布局
    grid: {
      left: '0%',
      right: '36%',
      bottom: '0%',
      containLabel: true,
    },
    //配置要在X轴显示的项
    xAxis: { type: 'category' },
    //配置要在Y轴显示的项
    yAxis: { type: 'value' },
    series: [
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
    ],
  } as any;
}

// A集群各院区流量
export function clusterALineChart(clusterAData: Record<string, any>) {
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['赤城街道', '平桥镇', '其他', '天医-门诊楼', '天医-其他楼', '天医-医技楼', '天医-住院楼', '乡镇其他'],
      // orient: 'line',
      top: 0,
      right: 0,
      icon: 'circle',
      itemHeight: 10,
      textStyle: {
        //图例字体大小
        fontSize: 10,
      },
    },
    grid: {
      left: '0%',
      right: '5%',
      bottom: '0%',
      // top:'10%',
      containLabel: true,
    },
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: clusterAData[8],
    },
    yAxis: {
      type: 'value',
      axisTick: {
        inside: true,
      },
    },

    series: [
      {
        name: '赤城街道',
        type: 'line',
        // stack: '访问量',
        showSymbol: false,
        color: '#FFA500',
        data: clusterAData[0],
      },
      {
        name: '平桥镇',
        type: 'line',
        color: '#CC99CC',
        showSymbol: false,
        // stack: '访问量',
        data: clusterAData[1],
      },
      {
        name: '其他',
        type: 'line',
        // stack: '访问量',
        showSymbol: false,
        color: '#FF99CC',
        data: clusterAData[2],
      },
      {
        name: '天医-门诊楼',
        type: 'line',
        showSymbol: false,
        // stack: '访问量',
        color: '#FF0000',
        data: clusterAData[3],
      },
      {
        name: '天医-其他楼',
        type: 'line',
        showSymbol: false,
        // stack: '访问量',
        color: '#CD5C5C',
        data: clusterAData[4],
      },
      {
        name: '天医-医技楼',
        type: 'line',
        color: '#FFA07A',
        showSymbol: false,
        // stack: '访问量',
        data: clusterAData[5],
      },
      {
        name: '天医-住院楼',
        type: 'line',
        showSymbol: false,
        color: '#FFCC33',
        // stack: '访问量',
        data: clusterAData[6],
      },
      {
        name: '乡镇其他',
        type: 'line',
        showSymbol: false,
        color: '#8A2BE2',
        // stack: '访问量',
        data: clusterAData[7],
      },
    ],
  } as any;
}

// B集群各院区流量
export function clusterBLineChart(clusterBData: Record<string, any>) {
  return {
    tooltip: {
      trigger: 'axis',
    },
    //图例组件
    legend: {
      data: ['赤城街道', '平桥镇', '其他', '天医-门诊楼', '天医-其他楼', '天医-医技楼', '天医-住院楼', '乡镇其他'],
      // orient: 'vertical',
      top: 0,
      right: 0,
      icon: 'circle',
      itemHeight: 10,
      textStyle: {
        //图例字体大小
        fontSize: 10,
      },
    },
    grid: {
      left: '5%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: clusterBData[8],
    },
    yAxis: {
      type: 'value',
      axisTick: {
        inside: true,
      },
      grid: {
        left: 35,
      },
    },
    series: [
      {
        name: '赤城街道',
        showSymbol: false,
        type: 'line',
        // stack: '访问量',
        color: '#00CCFF',
        data: clusterBData[0],
      },
      {
        name: '平桥镇',
        type: 'line',
        showSymbol: false,
        color: '#339900',
        // stack: '访问量',
        data: clusterBData[1],
      },
      {
        name: '其他',
        type: 'line',
        showSymbol: false,
        // stack: '访问量',
        color: '#6699FF',
        data: clusterBData[2],
      },
      {
        name: '天医-门诊楼',
        type: 'line',
        showSymbol: false,
        // stack: '访问量',
        color: '#3300FF',
        data: clusterBData[3],
      },
      {
        name: '天医-其他楼',
        type: 'line',
        showSymbol: false,
        // stack: '访问量',
        color: '#999900',
        data: clusterBData[4],
      },
      {
        name: '天医-医技楼',
        type: 'line',
        showSymbol: false,
        color: '#808080',
        // stack: '访问量',
        data: clusterBData[5],
      },
      {
        name: '天医-住院楼',
        type: 'line',
        showSymbol: false,
        color: '#99FF33',
        // stack: '访问量',
        data: clusterBData[6],
      },
      {
        name: '乡镇其他',
        type: 'line',
        showSymbol: false,
        color: '#336666',
        // stack: '访问量',
        data: clusterBData[7],
      },
    ],
  } as any;
}
