// 已测用例情况
export function useCaseInfoChartOptions(data: Record<string, any>) {
  const { skip = 0, pass = 0, fail = 0, block = 0, title = '已测用例情况' } = data;

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: '60px',
      left: '22px',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        label: { show: false },
        left: 100,
        itemStyle: {
          // borderColor: '#fff',
          // borderWidth: 2,
        },
        startAngle: -45,
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
    graphic: [
      {
        type: 'text',
        z: 100,
        left: '22px',
        top: '20px',
        style: {
          color: '#000000',
          text: title,
          fontSize: '14px',
          fontWeight: 'bold',
        },
      },
    ],
  } as any;
}

// 用例测试情况
export function useCaseTestInfoChartOptions(data: Record<string, any>) {
  const { notTested = 0, tested = 0, total = 0, title = '用例测试情况' } = data;
  const mgl = ['181px', '175px', '170px'][total.toString().length - 1];

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: '80px',
      left: '22px',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        label: { show: false },
        left: 100,
        itemStyle: {
          // borderColor: '#fff',
          // borderWidth: 2,
        },
        startAngle: -45,
        labelLine: { show: false },
        data: [
          {
            value: notTested,
            name: `未测 ${notTested}`,
            itemStyle: { color: '#657CA6' },
          },
          {
            value: tested,
            name: `已测 ${tested}`,
            itemStyle: { color: '#54DA81' },
          },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        z: 100,
        left: '176px',
        top: '70px',
        style: {
          color: '#5F677A',
          text: '总数',
          fontSize: '10px',
        },
      },
      {
        type: 'text',
        z: 100,
        left: mgl,
        top: '86px',
        style: {
          color: '#000000',
          text: total,
          fontSize: '16px',
          fontFamily: 'Helvetica Neue',
        },
      },
      {
        type: 'text',
        z: 100,
        left: '22px',
        top: '20px',
        style: {
          color: '#000000',
          text: title,
          fontSize: '14px',
          fontWeight: 'bold',
        },
      },
    ],
  } as any;
}

// Bug情况
export function bugInfoChartOptions(data: Record<string, any>) {
  const { notFixed = 0, fixed = 0, title = 'Bug情况' } = data;

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: '80px',
      left: '22px',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        label: { show: false },
        left: 100,
        itemStyle: {
          // borderColor: '#fff',
          // borderWidth: 2,
        },
        startAngle: -45,
        labelLine: { show: false },
        data: [
          {
            value: notFixed,
            name: `未修复 ${notFixed}`,
            itemStyle: { color: '#657CA6' },
          },
          {
            value: fixed,
            name: `已修复 ${fixed}`,
            itemStyle: { color: '#54DA81' },
          },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        z: 100,
        left: '22px',
        top: '20px',
        style: {
          color: '#000000',
          text: title,
          fontSize: '14px',
          fontWeight: 'bold',
        },
      },
    ],
  } as any;
}
