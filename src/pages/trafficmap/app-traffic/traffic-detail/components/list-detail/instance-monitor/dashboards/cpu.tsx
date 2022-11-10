// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from 'antd';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function CpuUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const [sumData, setSumData] = useState<any>(data[0] ? data[0] : []);
  const [option, setOption] = useState<string>('1');
  useEffect(() => {
    if (data[0]) {
      setOption('1');
      setSumData(data[0]);
    }
    if (!data[0]?.length || !data[1]?.length || !data[2]?.length) return;
  }, [data]);

  const getData = (value: string) => {
    let optionData = value === '1' ? data[0] : value === '2' ? data[1] : [];
    setSumData(optionData);
    // sumData=optionData
    setOption(value);
  };

  const config = {
    data: sumData,
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    // color: ['#8bc0d6', '#60d7a7', 'yellow'],
    xAxis: {
      // tickInterval:6,
      // tickCount:20
    },
    title: 'fs writes/reads',
    yAxis: {
      title: {
        text: 'cores',
      },
      label: {
        // 数值格式化为带百分号
        formatter: (v: any) => `${v}`,
      },
    },
    width: 550,
    height: 260,
  };

  const podsCpuOption = [
    { label: 'cpuUse', value: '1' },
    // { label: 'cpuRequest', value: '2' },
    { label: 'cpuLimit', value: '2' },
  ];

  return (
    <section data-loading={loading} style={{ marginLeft: 10 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Pods CPU usage</h3>
        <span>
          <Select options={podsCpuOption} style={{ width: 180 }} onChange={getData} value={option}></Select>
        </span>
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
