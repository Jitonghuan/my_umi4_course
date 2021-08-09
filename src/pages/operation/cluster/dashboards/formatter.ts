// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 9:30

// A集群各院区流量
export function clusterALineChart(data: Record<string, any>) {
  const names = Object.keys(data);
  let dateList: string[] = [];
  const series: any[] = [];
  names.forEach((name) => {
    const item = data[name];
    dateList = Object.keys(item).map((n) => n?.replace(/^\d{4}-/, ''));

    series.push({
      name,
      type: 'line',
      data: Object.values(item),
    });
  });
  return {
    // title: {
    //     text: 'A集群各院区流量'
    // },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['庆春城站', '之江', '余杭', '余杭无线', '庆春城站无线', '之江无线'],
    },
    grid: {
      left: '0%',
      right: '10%',
      bottom: '0%',
      // top:'10%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },

    series: [
      {
        name: '庆春城站',
        type: 'line',
        stack: '访问量',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '之江',
        type: 'line',
        stack: '访问量',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '余杭',
        type: 'line',
        stack: '访问量',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '余杭无线',
        type: 'line',
        stack: '访问量',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '庆春城站无线',
        type: 'line',
        stack: '访问量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
      {
        name: '之江无线',
        type: 'line',
        stack: '访问量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  } as any;
}

// B集群各院区流量
export function clusterBLineChart(data: Record<string, any>) {
  const names = Object.keys(data);
  let dateList: string[] = [];
  const series: any[] = [];
  names.forEach((name) => {
    const item = data[name];
    dateList = Object.keys(item).map((n) => n?.replace(/^\d{4}-/, ''));

    series.push({
      name,
      type: 'line',
      data: Object.values(item),
    });
  });

  return {
    // title: {
    //     text: 'A集群各院区流量'
    // },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['庆春城站', '之江', '余杭', '余杭无线', '庆春城站无线', '之江无线'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '0%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '庆春城站',
        type: 'line',
        stack: '访问量',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '之江',
        type: 'line',
        stack: '访问量',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '余杭',
        type: 'line',
        stack: '访问量',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '余杭无线',
        type: 'line',
        stack: '访问量',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '庆春城站无线',
        type: 'line',
        stack: '访问量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
      {
        name: '之江无线',
        type: 'line',
        stack: '访问量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  } as any;
}

// A/B集群柱状图

export function ABClusterHistogram(data: Record<string, any>) {
  const names = Object.keys(data);
  let dateList: string[] = [];
  const series: any[] = [];
  names.forEach((name) => {
    const item = data[name];
    dateList = Object.keys(item).map((n) => n?.replace(/^\d{4}-/, ''));

    series.push({
      name,
      type: 'line',
      data: Object.values(item),
    });
  });

  return {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        [
          'visitNumber',
          '城站庆春-A',
          '之江-A',
          '余杭-A',
          '余杭无线-A',
          '城站庆春无线-A',
          '之江无线-A',
          '城站庆春-B',
          '之江-B',
          '余杭-B',
          '余杭无线-B',
          '城站庆春无线-B',
          '之江无线-B',
        ],
        ['Alldocs', 43.3, 85.8, 93.7, 88, 89, 67, 89, 44, 56, 23, 78, 23],
      ],
    },
    grid: {
      left: '0%',
      right: '20%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: { type: 'category' },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
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
