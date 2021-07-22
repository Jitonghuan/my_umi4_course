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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: names,
      icon: 'circle',
    },
    grid: {
      left: 20,
      right: 30,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: 'value',
    },
    series,
  } as any;
}

// 各项用例数据
// { apiNum, appNum, caseNum, project }[]
export function getCaseListChartOptions(data: Record<string, any>[]) {
  const categoryList: string[] = [];
  const appNumList: number[] = [];
  const apiNumList: number[] = [];
  const caseNumList: number[] = [];
  data.forEach((item) => {
    categoryList.push(item.project);
    appNumList.push(item.appNum || 0);
    apiNumList.push(item.apiNum || 0);
    caseNumList.push(item.caseNum || 0);
  });

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['覆盖应用', '接口总数', '用例总数'],
      top: 0,
      left: 0,
    },
    grid: {
      left: 20,
      right: 30,
      bottom: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: categoryList,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '覆盖应用',
        type: 'bar',
        stack: 'stack1',
        barWidth: 32,
        data: appNumList,
        itemStyle: { color: '#4BA2FF' },
      },
      {
        name: '接口总数',
        type: 'bar',
        stack: 'stack1',
        barWidth: 32,
        data: apiNumList,
        itemStyle: { color: '#54DA81' },
      },
      {
        name: '用例总数',
        type: 'bar',
        stack: 'stack1',
        barWidth: 32,
        data: caseNumList,
        itemStyle: { color: '#657CA6' },
      },
    ],
  } as any;
}

// 近一个月用例新增情况
// { count, date }
export function getCaseMonthlyChartOptions(data: Record<string, any>[]) {
  const dateList: string[] = [];
  const countList: number[] = [];
  data.forEach((item) => {
    dateList.push(item.date?.replace(/^\d{4}-/, ''));
    countList.push(item.count || 0);
  });

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: 20,
      right: 30,
      bottom: 0,
      top: 30,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: countList,
        type: 'line',
        areaStyle: {
          color: '#4BA2FF',
        },
      },
    ],
  } as any;
}
