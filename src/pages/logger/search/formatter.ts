// 日志检索柱状图
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/11/23 16:49
// 最后一次执行情况
export function loggerChart(data: Record<string, any>) {
  return {
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', //提示框类型
        label: {
          //坐标轴指示器的文本标签
          show: true,
        },
      },
    },
    xAxis: {
      type: 'category',
      name: '时间',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
      name: '计数',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  } as any;
}
