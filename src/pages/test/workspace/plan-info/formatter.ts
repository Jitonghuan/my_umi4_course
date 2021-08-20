// 已测用例情况
export function useCaseInfoChartOptions(data: Record<string, any>) {
  const { skip = 0, pass = 0, fail = 0, block = 0 } = data;

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: 0,
      right: 0,
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '90%'],
        label: { show: false },
        left: -80,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        labelLine: { show: false },
        data: [
          {
            value: skip,
            name: '跳过',
            itemStyle: { color: '#657CA6' },
          },
          {
            value: pass,
            name: '通过',
            itemStyle: { color: '#54DA81' },
          },
          {
            value: fail,
            name: '失败',
            itemStyle: { color: '#F66951' },
          },
          {
            value: block,
            name: '阻塞',
            itemStyle: { color: '#FFCB30' },
          },
        ],
      },
    ],
  } as any;
}

// 用例测试情况
export function useCaseTestInfoChartOptions(data: Record<string, any>) {
  const { notTested = 0, tested = 0, total = 0 } = data;

  const mgl = ['143px', '136px', '129px'][total.toString().length - 1];

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: 0,
      right: 0,
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '90%'],
        label: { show: false },
        left: -80,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        labelLine: { show: false },
        data: [
          {
            value: notTested,
            name: '未测',
            itemStyle: { color: '#657CA6' },
          },
          {
            value: tested,
            name: '已测',
            itemStyle: { color: '#54DA81' },
          },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        z: 100,
        left: '135px',
        top: '88px',
        style: {
          color: '#5F677A',
          text: '总数',
          fontSize: '14px',
        },
      },
      {
        type: 'text',
        z: 100,
        left: mgl,
        top: '110px',
        style: {
          color: '#000000',
          text: total,
          fontSize: '26px',
          fontFamily: 'Helvetica Neue',
        },
      },
    ],
  } as any;
}

// Bug情况
export function bugInfoChartOptions(data: Record<string, any>) {
  const { notFixed = 0, fixed = 0 } = data;

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: 0,
      right: 0,
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '90%'],
        label: { show: false },
        left: -80,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        labelLine: { show: false },
        data: [
          {
            value: notFixed,
            name: '未修复',
            itemStyle: { color: '#657CA6' },
          },
          {
            value: fixed,
            name: '已修复',
            itemStyle: { color: '#54DA81' },
          },
        ],
      },
    ],
  } as any;
}
