// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from 'antd';
import './index.less';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function DiskUsagePieChart(props: ChartCaseListProps) {
  //   const { data, loading } = props;
  const data = [
    {
      type: '可用空间',
      value: 27,
    },
    {
      type: '已用空间',
      value: 73,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
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
    <section
      // data-loading={loading}
      style={{ marginLeft: 10 }}
    >
      <header>
        <h3 className="disk-pie-section-header">
          <span>磁盘使用 </span>
          <span>
            <Select style={{ width: 140 }}></Select>
          </span>
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
