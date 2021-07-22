// data formatter
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/22 11:26

// 最后一次执行情况
export function getLastExecChartOptions(data: Record<string, any>) {
  const { success = 0, failure = 0, error = 0 } = data;

  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      top: '0',
      right: '0',
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
            value: success,
            name: '成功',
            itemStyle: { color: '#54DA81' },
          },
          {
            value: failure,
            name: '失败',
            itemStyle: { color: '#657CA6' },
          },
          {
            value: error,
            name: '错误',
            itemStyle: { color: '#F7715A' },
          },
        ],
      },
    ],
  } as any;
}

// 各任务近七天执行情况
export function getTaskWeeklyChartOptions(data: Record<string, any>) {
  return {} as any;
}

// 各项用例数据
export function getCaseListChartOptions(data: Record<string, any>) {
  return {} as any;
}

// 近一个月用例新增情况
export function getCaseMonthlyChartOptions(data: Record<string, any>) {
  return {} as any;
}
