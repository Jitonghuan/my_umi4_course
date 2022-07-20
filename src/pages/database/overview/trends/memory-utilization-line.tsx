// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function MemoryUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const config = {
    data,
    xField: 'time',
    yField: 'count',
    xAxis: {
      range: [0, 1],
      // tickCount: 5,
    },
    yAxis: {
      // title: {
      //   text: '内存',
      // },
      label: {
        // 数值格式化为带百分号
        formatter: (v: any) => `${v}K`,
      },
    },
    // LegendCfg: {
    //   legend: {
    //     position: 'top-left',
    //     text: '内存',
    //   },
    // },

    // pattern: {
    //   type: 'dot',
    //   cfg: {
    //     size: 4,
    //     padding: 4,
    //     rotation: 0,
    //     fill: '#gray',
    //     isStagger: true,
    //   },
    // },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },

    width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading}>
      <header>
        <h3>MySQL存储空间使用量</h3>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
            <Area {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
