// 最后一次执行情况
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
            itemStyle: { color: '#F4C96A' },
          },
          {
            value: block,
            name: '阻塞',
            itemStyle: { color: '#F7715A' },
          },
        ],
      },
    ],
  } as any;
}
