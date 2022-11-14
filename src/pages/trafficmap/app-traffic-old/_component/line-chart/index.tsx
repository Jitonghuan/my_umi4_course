/*
 * @Author: shixia.ds
 * @Date: 2021-12-03 10:45:17
 * @Description:
 */
import React, { useMemo, useEffect } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import './index.less';

const { ColorContainer } = colorUtil.context;

export interface LineChartProps {
  loading?: boolean;
  title: string;
  data: any[];
  xAxis: string[];
  key: any;
}

export default function LineChart(props: LineChartProps) {
  const { loading, title, data, xAxis } = props;

  const chartOptions = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend:
        data.length > 1
          ? {
              data: data.map((item) => item.name),
              left: 'left',
              icon: 'circle',
              itemHeight: 5,
              itemWidth: 5,
            }
          : null,
      //调整绘制的echart在canvas里距离各边的距离
      grid: {
        top: `30px`,
        left: '14px',
        right: '50px',
        bottom: '0px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
        // axisLabel: {
        //   interval: 0, // 显示所有的 x 轴上的文字不隐藏
        // },
      },
      yAxis: {
        type: 'value',
      },
      series: data,
    };
  }, [data, xAxis]) as any;

  return (
    <section data-loading={loading}>
      <div style={{ height: '245px', background: '#fff' }}>
        <div className="echart-title">{title}</div>
        <ColorContainer roleKeys={['color']}>
          {/**
           * 参数说明
           * @option echart配置
           * @notMerge echart更新时是否和先前option merge 为true时画布会删除历史数据
           *  */}
          <EchartsReact style={{ width: '100%', height: '100%' }} option={chartOptions} notMerge={true} />
        </ColorContainer>
      </div>
    </section>
  );
}
