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
  const config = {
    data,
    xField: 'Date',
    yField: 'scales',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
    width: 550,
    height: 260,
  };

  return (
    <section
    // data-loading={loading}
    >
      <header>
        <h3>内存使用率折线面积图</h3>
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
