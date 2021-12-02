/*
 * @Author: shixia.ds
 * @Date: 2021-11-29 14:45:44
 * @Description:
 */
import React, { useMemo, useEffect } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

const { ColorContainer } = colorUtil.context;

export interface LineChartProps {
  loading?: boolean;
  title: string;
  data: any[];
  xAxis: string[];
}

export default function LineChart(props: LineChartProps) {
  const { loading, title, data, xAxis } = props;

  const legendLineNum = data.length / 3 + (data.length % 3 ? 1 : 0);

  let chart: echarts.ECharts | undefined;
  const getChart = (echart?: echarts.ECharts) => {
    console.log(echart);
    chart = echart;
  };

  let observer: any;
  useEffect(() => {
    // let ResizeObserver = window.ResizeObserver || window.WebKitResizeObserver || window.MozResizeObserver
    let element = document.querySelector('.line-chart-group') || document.body;
    observer = new ResizeObserver((entries) => {
      // for(let entry of entries) {
      //   console.log(entry)
      // }
      let width = getComputedStyle(element).getPropertyValue('width');
      let height = getComputedStyle(element).getPropertyValue('height');
      console.log('width', width);
      chart?.resize();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  const chartOptions = useMemo(() => {
    return {
      title: {
        text: title,
        left: 'left',
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend:
        data.length > 1
          ? {
              data: data.map((item) => item.name),
              top: '35px',
              left: 'center',
            }
          : null,
      //调整绘制的echart在canvas里距离各边的距离
      grid: {
        top: `${30 + legendLineNum * 20}px`,
        left: '5%',
        right: '6%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
        axisLabel: {
          interval: 0, // 显示所有的 x 轴上的文字不隐藏
        },
      },
      yAxis: {
        type: 'value',
      },
      series: data,
    };
  }, [data, xAxis]) as any;

  return (
    <section data-loading={loading}>
      <div style={{ height: 200 + legendLineNum * 20, background: '#fff' }}>
        <ColorContainer roleKeys={['color']}>
          {/**
           * 参数说明
           * @option echart配置
           * @notMerge echart更新时是否和先前option merge 为true时画布会删除历史数据
           *  */}
          <EchartsReact
            option={chartOptions}
            notMerge={true}
            onChartReady={(echart?: echarts.ECharts) => {
              getChart(echart);
            }}
          />
        </ColorContainer>
      </div>
    </section>
  );
}
