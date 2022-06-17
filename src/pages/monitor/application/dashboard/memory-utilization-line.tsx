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
export default function MemoryUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  let newallData: any = [];
  if (data) {
    // newallData = [...data[0], ...data[1], ...data[2]];
    data?.map((item: any) => {
      newallData.push(...item);
    });
  } else {
    return;
  }
  // let newallData = [...data[0], ...data[1], ...data[2]];
  const config = {
    data: newallData,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    color: ['#6495ED', '#60d7a7', '#BDB76B'],
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
          <div><strong>${data[2]?.data?.category}:` +
          `${Number.parseInt(data[2]?.data?.value)}, name:` +
          data[2]?.data?.name +
          `,time: ${data[2]?.data?.time}</strong></div>
          <br>`
        );
      },
    },
    // xAxis: {
    //   range: [0, 1],
    //   // tickCount: 5,
    // },
    yAxis: {
      label: {
        // 数值格式化为带百分号
        formatter: (v: any) => `${v}MiB`,
      },
    },
    LegendCfg: {
      legend: {
        position: 'top-left',
        text: '内存',
      },
    },
    width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading} style={{ marginLeft: 10 }}>
      <header>
        <h3>Pods memory usage</h3>
      </header>
      <div>
        <div>
          <ColorContainer roleKeys={['color']}>
            <Line {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
