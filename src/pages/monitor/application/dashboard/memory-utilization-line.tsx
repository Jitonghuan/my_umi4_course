// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from 'antd';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function MemoryUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const [sumData, setSumData] = useState<any>([]);
  const [option, setOption] = useState<string>('1');
  useEffect(() => {
    if (data[0]) {
      setSumData(data[0]);
      setOption('1');
    }
    if (!data[0]?.length || !data[1]?.length || !data[2]?.length) return;
  }, [data]);

  const getData = (value: string) => {
    let optionData = value === '1' ? data[0] : value === '2' ? data[1] : value === '3' ? data[2] : [];

    setSumData(optionData);
    setOption(value);
  };

  const podsMemoryOption = [
    { label: 'rssInfo', value: '1' },
    { label: 'wssInfo', value: '2' },
    { label: 'memLimitInfo', value: '3' },
  ];
  const config = {
    data: sumData || [],
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    // color: ['#6495ED', '#60d7a7', '#BDB76B'],
    xAxis: {
      range: [0, 1],
      // tickCount: 5,
    },
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
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Pods memory usage</h3>
        <span>
          <Select options={podsMemoryOption} style={{ width: 180 }} onChange={getData} value={option}></Select>
        </span>
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
