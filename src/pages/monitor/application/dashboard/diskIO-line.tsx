// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function DiskIOLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  let newallData = [...data[0], ...data[1]];
  const config = {
    data: newallData,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    color: ['green', '#8bc0d6'],
    tooltip: {
      customContent: (title: string, data: any) => {
        return (
          `<br><div><strong>${data[0]?.data?.category}:` +
          `${Number.parseInt(data[0]?.data?.value)}, name:` +
          data[0]?.data?.name +
          `,time: ${data[0]?.data?.time}</strong> </div><br>  
          <div><strong>${data[1]?.data?.category}:` +
          `${Number.parseInt(data[1]?.data?.value)}, name:` +
          data[1]?.data?.name +
          `,time: ${data[1]?.data?.time}</strong></div><br> 
          <br>`
        );
      },
    },
    LegendCfg: {
      legend: {
        position: 'top-left',
      },
    },
    title: 'fs writes/reads',
    yAxis: {
      label: {
        // 数值格式化为带百分号
        formatter: (v: any) => `${v}Bs`,
      },
    },
    width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading} style={{ marginLeft: 10 }}>
      <header>
        <h3>fs writes/reads</h3>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
            <Line {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
