// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 9:30

// A集群各院区流量
export function clusterALineChart(clusterAData: Record<string, any>) {
  let categoryList: string[] = [];
  let dataCountArry: any = [];
  if (!clusterAData) {
    return;
  }

  (clusterAData.clusterATimeStamp || [])?.map((el: any, index: number) => {
    dataCountArry[index] = 0;
  });
  // let countNumber:any=[];
  const dataSource = (clusterAData.clusterADataSource || [])?.map((item: any, index: number) => {
    categoryList.push(item.hospitalDistrictName);
    return {
      name: item.hospitalDistrictName,
      type: 'line',
      // stack: '访问量',
      // color: '#BC8F8F',
      showSymbol: false,
      data: item.count ? item.count : dataCountArry,
    };
  });

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: categoryList,
      // orient: 'line',
      top: 0,
      right: '5%',
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
      data: clusterAData.clusterATimeStamp,
    },
    yAxis: {
      type: 'value',
    },
    series: dataSource,
  } as any;
}

// B集群各院区流量
export function clusterBLineChart(clusterBData: Record<string, any>) {
  let categoryList: string[] = [];
  let dataCountArry: any = [];
  if (!clusterBData) {
    return;
  }

  (clusterBData.clusterBTimeStamp || [])?.map((el: any, index: number) => {
    dataCountArry[index] = 0;
  });

  const dataSource = (clusterBData.clusterBDataSource || [])?.map((item: any) => {
    categoryList.push(item.hospitalDistrictName);
    return {
      name: item.hospitalDistrictName,
      type: 'line',
      // stack: '访问量',
      // color: '#BC8F8F',
      showSymbol: false,
      data: item.count ? item.count : dataCountArry,
    };
  });
  return {
    tooltip: {
      trigger: 'axis',
    },
    //图例组件
    legend: {
      data: categoryList,
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
      data: clusterBData.clusterBTimeStamp,
    },
    yAxis: {
      type: 'value',
    },
    series: dataSource,
  } as any;
}

// A/B集群柱状图

export function ABClusterHistogram(histogramData: Record<string, any>) {
  let categoryList: any[] = [];
  let countListA: any = [];
  let countListB: any = [];
  let seriesArry: any = [];
  if (!histogramData) {
    return;
  }
  try {
    (histogramData || [])?.map((item: any, index: number) => {
      countListA.push(item.clusterACount);
      countListB.push(item.clusterBCount);
      categoryList[index] = 'A-' + item.hospitalDistrictName;
      categoryList[histogramData.length + index] = 'B-' + item.hospitalDistrictName;
      seriesArry.push(
        {
          type: 'bar',
          barMaxWidth: '10%',
        },
        {
          type: 'bar',
          barMaxWidth: '10%',
        },
      );
    });
  } catch (error) {
    console.log(error);
  }

  let total = countListA.concat(countListB);
  return {
    //图例组件
    legend: {
      orient: 'vertical',
      top: 0,
      right: 0,
      icon: 'circle',
      type: 'scroll', //分页类型
      textStyle: {
        //图例字体大小
        fontSize: 10,
      },
      itemHeight: 10,
    },
    //提示信息
    tooltip: {},
    // color: [
    //   '#BC8F8F',
    //   '#EE6363',
    //   '#DDA0DD',
    //   '#FF8247',
    //   '#FF69B4',
    //   '#9370DB',
    //   '#2E8B57',
    //   '#4682B4',
    //   '#8B864E',
    //   '#3A5FCD',
    //   '#191970',
    //   '#8C8898',
    // ],

    dataset: {
      source: [
        ['product', ...categoryList],
        ['访问量', ...total],
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
    xAxis: {
      type: 'category',
    },
    //配置要在Y轴显示的项
    yAxis: { type: 'value' },
    series: seriesArry,
  } as any;
}
