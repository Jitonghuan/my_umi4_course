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
export default function NetWorkLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const [option, setOption] = useState<string>('1');
  const networkOption = [
    { label: 'receive', value: '1' },
    { label: 'transmit', value: '2' },
  ];
  const [sumData, setSumData] = useState<any>([]);
  useEffect(() => {
    if (data[0]) {
      setSumData(data[0]);
      setOption('1');
    }
    if (!data[0]?.length || !data[1]?.length) return;
  }, [data]);

  const getData = (value: string) => {
    let optionData = value === '1' ? data[0] : value === '2' ? data[1] : [];
    setSumData(optionData);
    setOption(value);
  };

  const config = {
    data: sumData || [],
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    // color: ['#8bc0d6', '#60d7a7'],
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
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Network I/O pressure</h3>
        <span>
          <Select options={networkOption} style={{ width: "10vw" }} onChange={getData} value={option}></Select>
        </span>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
            {/* <Line {...config} /> */}
            {
            useMemo(() => <Line {...config} />, [sumData])
        }
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
