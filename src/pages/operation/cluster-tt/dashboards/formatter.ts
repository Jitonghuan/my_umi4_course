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
    color: ['#FFA500', '#FF99CC', '#CC99FF', '#FF0000', '#00CCFF', '#339900', '#6699FF', '#3300FF'],

    dataset: {
      source: [
        [
          'product',
          // 'product',...categoryList,
          'A-县医院',
          'A-县卫生院',
          'A-赤城街道',
          'A-平桥镇',
          'B-县医院',
          'B-县卫生院',
          'B-赤城街道',
          'B-平桥镇',
        ],
        ['访问量', ...countList],
      ],
    },
    //布局
    grid: {
      left: '0%',
      right: '22%',
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
    ],
  } as any;
}

// A集群各院区流量
export function clusterALineChart(clusterAData: Record<string, any>) {
  const countList: number[] = [];
  const categoryList: string[] = [];

  return {} as any;
}

// B集群各院区流量
export function clusterBLineChart(clusterBData: Record<string, any>) {
  return {} as any;
}
