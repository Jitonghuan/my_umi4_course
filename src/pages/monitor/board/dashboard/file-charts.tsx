// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line, Scatter, Mix } from '@ant-design/charts';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function LoadUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const socketOptions = {
    title: {
      text: 'TTM 现金流 - 营运构架对比',
      x: '40%',
      y: '8%',
    },
    xAxis: {
      type: 'value',
      scale: true,
      max: 26,
      axisLabel: {
        show: true,
        interval: 'auto',
        formatter: '{value} m',
      },
      show: true,
      name: 'TTM Sales（不含MDS外送费）',
      nameLocation: 'center',
      nameTextStyle: {
        padding: [20, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        show: true,
        interval: 'auto',
        formatter: '{value} m',
      },
      show: true,
      name: 'TTM 现金流+租金',
      nameLocation: 'center',
      nameTextStyle: {
        padding: [0, 0, 30, 0], // 四个数字分别为上右下左与原位置距离
      },
    },
    grid: {
      left: '15%',
      right: '15%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    legend: {
      top: '90%',
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function (params: any) {
        let type = params[0].componentSubType;
        console.log(type);
        if (type === 'scatter') {
          console.log(params);
          let index = params[0];
          return (
            '选择架构:&nbsp;&nbsp;' +
            index.seriesName +
            '</br>' +
            '餐厅编号:&nbsp;&nbsp;' +
            index.data[2] +
            '</br>' +
            'TIM Sales:&nbsp;' +
            index.data[0] +
            '</br>' +
            '现金流+租金:&nbsp;&nbsp;' +
            index.data[1] +
            '</br>'
          );
        }
      },
    },
    series: [
      {
        name: 'DO Eva Zhou（111家餐厅）',
        type: 'line',
        data: [
          [0, -1.8],
          [1, 2],
          [26, 9],
        ],
        lineStyle: { color: '#144464' },
      },
      {
        name: 'DO Frank Fu（42家餐厅）',
        type: 'line',
        data: [
          [0, -1.8],
          [26, 10],
        ],
        lineStyle: { color: '#e4641c' },
      },
      {
        name: 'DO Eva Zhou',
        symbolSize: 8,
        color: '#348ccc',
        data: [
          [5, 2, '1420097'],
          [8, 3, '1420097'],
          [13, 3, '1420097'],
          [9.05, 4, '1420097'],
          [11.0, 4.33, '1420097'],
          [14.0, 2.66, '1420097'],
          [13.4, 3.81, '1420097'],
          [10.0, 6.33, '1420097'],
          [14.0, 3.96, '1420097'],
          [12.5, 2.82, '1420097'],
          [9.15, 1.2, '1420097'],
          [11.5, 3.2, '1420097'],
          [3.03, 2.23, '1420097'],
          [12.2, 3.83, '1420097'],
          [2.02, 2.47, '1420097'],
          [1.05, 1.33, '1420097'],
          [4.05, 2.96, '1420097'],
          [6.03, 1.24, '1420097'],
          [12.0, 3.26, '1420097'],
          [12.0, 1.84, '1420097'],
          [7.08, 2.82, '1420097'],
          [5.02, 1.68, '1420097'],
        ],
        type: 'scatter',
      },
      {
        name: 'DO Frank Fu',
        symbolSize: 10,
        color: '#e4bc2c',
        data: [
          [5.1, 2.3, '1420097'],
          [4, 3.5, '1420097'],
          [13, 2.5, '1420097'],
          [9, 2.6, '1420097'],
          [11.0, 2.33, '1420097'],
          [12.0, 2.36, '1420097'],
          [13.4, 3.81, '1420097'],
          [14.0, 3.36, '1420097'],
          [12.5, 2.82, '1420097'],
          [9.5, 2.2, '1420097'],
          [13.5, 3.2, '1420097'],
          [1.03, 2.3, '1420097'],
          [13.2, 3.3, '1420097'],
          [2.02, 2.47, '1420097'],
          [1.05, 1.33, '1420097'],
          [4.05, 2.96, '1420097'],
          [4.03, 1.24, '1420097'],
          [12.0, 3.26, '1420097'],
          [12.0, 1.84, '1420097'],
          [7.08, 2.82, '1420097'],
          [4.02, 1.28, '1420097'],
        ],
        type: 'scatter',
      },
    ],
  };

  return (
    <section
    // data-loading={loading}
    >
      <header>
        <h3>LOAD</h3>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
            <EchartsReact option={socketOptions} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
