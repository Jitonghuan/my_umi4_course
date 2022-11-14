// 日志检索柱状图
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/11/23 16:49
import moment from 'moment';
export function loggerChart(data: any) {
  let logHistormData = data;
  const countList: any = [];
  const timeList: any = [];
  logHistormData?.map((item: any) => {
    countList.push(item?.count);
    timeList.push(moment(item?.timePoint).format('HH:mm:ss'));
  });

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
    grid: {
      top: '2%',
      bottom: '22%',
      // containLabel: true,
    },
    xAxis: {
      type: 'category',
      name: '时间',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: timeList,
    },
    yAxis: {
      type: 'value',
      name: '计数',
    },
    series: [
      {
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: countList,
        type: 'bar',
        // barWidth:18,
        // barGap:2,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  } as any;
}