// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 9:30

import { values } from '_@types_lodash@4.14.171@@types/lodash';

// A集群各院区流量
export function clusterALineChart(clusterAData: Record<string, any>) {
  const countList: number[] = [];
  const categoryList: string[] = [];

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['之江', '之江无线', '余杭', '余杭无线', '庆春城站', '庆春城站无线'],
      // orient: 'line',
      top: 0,
      right: '10%',
      icon: 'circle',
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
      // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: clusterAData[6],
    },
    yAxis: {
      type: 'value',
    },

    series: [
      {
        name: '之江',
        type: 'line',
        stack: '访问量',
        data: clusterAData[0],
      },
      {
        name: '之江无线',
        type: 'line',
        stack: '访问量',
        data: clusterAData[1],
      },
      {
        name: '余杭',
        type: 'line',
        stack: '访问量',
        data: clusterAData[2],
      },
      {
        name: '余杭无线',
        type: 'line',
        stack: '访问量',
        data: clusterAData[3],
      },
      {
        name: '庆春城站',
        type: 'line',
        stack: '访问量',
        data: clusterAData[4],
      },
      {
        name: '庆春城站无线',
        type: 'line',
        stack: '访问量',
        data: clusterAData[5],
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
      data: ['之江', '之江无线', '余杭', '余杭无线', '庆春城站', '庆春城站无线'],
      // orient: 'vertical',
      top: 0,
      right: 0,
      icon: 'circle',
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
      data: clusterBData[6],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '庆春城站',
        type: 'line',
        stack: '访问量',
        data: clusterBData[0],
      },
      {
        name: '之江',
        type: 'line',
        stack: '访问量',
        data: clusterBData[1],
      },
      {
        name: '余杭',
        type: 'line',
        stack: '访问量',
        data: clusterBData[2],
      },
      {
        name: '余杭无线',
        type: 'line',
        stack: '访问量',
        data: clusterBData[3],
      },
      {
        name: '庆春城站无线',
        type: 'line',
        stack: '访问量',
        data: clusterBData[4],
      },
      {
        name: '之江无线',
        type: 'line',
        stack: '访问量',
        data: clusterBData[5],
      },
    ],
  } as any;
}

// A/B集群柱状图

export function ABClusterHistogram(histogramData: Record<string, any>) {
  const countList: any[] = [];
  const categoryList: string[] = [];
  for (var i in histogramData) {
    countList.push(histogramData[i] || 0);
    categoryList.push(i || '');
  }
  // const countListA = countList.filter(item => item.indexOf(i)<6 );
  // const countListB = countList.filter(item => item.indexOf(i)>=6)
  // console.log('获取到的结果11：',categoryList)
  return {
    //图例组件
    legend: {
      orient: 'vertical',
      top: 0,
      right: 40,
      icon: 'circle',
    },
    //提示信息
    tooltip: {},
    color: [
      '#FFF0F5',
      '#E6E6FA',
      '#FFEBCD',
      '#FFE4C4',
      '#B0E2FF',
      '#006400',
      '#CD6600',
      '#8B4789',
      '#6959CD',
      '#104E8B',
      '#CD4F39',
      '#8B8682',
    ],
    dataset: {
      source: [
        [
          ...categoryList,

          // '城站庆春-A',
          // '之江-A',
          // '余杭-A',
          // '余杭无线-A',
          // '城站庆春无线-A',
          // '之江无线-A',
          // '城站庆春-B',
          // '之江-B',
          // '余杭-B',
          // '余杭无线-B',
          // '城站庆春无线-B',
          // '之江无线-B',
        ],
        ['访问量', ...countList],
      ],
    },
    //布局
    grid: {
      left: '0%',
      right: '20%',
      bottom: '5%',
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
    ],
  } as any;
}
