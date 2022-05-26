// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from '@cffe/h2o-design';
import './index.less';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function DiskUsagePieChart(props: ChartCaseListProps) {
  const { data, loading } = props;
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    // colorField: 'type',
    colorField: 'type', // 部分图表使用 seriesField
    color: ['#60d7a7', '#8bc0d6'],
    radius: 0.95,
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: datum.value + 'G' };
      },
    },
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <section data-loading={loading} style={{ marginLeft: 10 }}>
      <header>
        <h3 className="disk-pie-section-header">
          <span>磁盘使用 </span>
          {/* <span>
            <Select style={{ width: 140 }}></Select>
          </span> */}
        </h3>
      </header>
      <div>
        <div className="dashboard-disk-usage-pie">
          <ColorContainer roleKeys={['color']}>
            <Pie {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
