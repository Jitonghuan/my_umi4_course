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
export default function DiskIOLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const [sumData, setSumData] = useState<any>([]);

  const [option, setOption] = useState<string>('1');
  useEffect(() => {
    if (data[0]) {
      setSumData(data[0]);
      setOption('1');
    }
    if(data.length===0){
      setSumData([]);

    }
  }, [data]);

  const getData = (value: string) => {
    let optionData = value === '1' ? data[0] : value === '2' ? data[1] : [];
    setSumData(optionData);
    setOption(value);
  };

  const fsOption = [
    { label: 'diskReads', value: '1' },
    { label: 'diskWrites', value: '2' },
  ];
  const config = {
    data: sumData || [],
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    // color: ['green', '#8bc0d6'],
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
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>fs writes/reads</h3>
        <span>
          <Select options={fsOption} style={{ width: "10vw" }} onChange={getData} value={option}></Select>
        </span>
      </header>

      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
          {
            useMemo(() => <Line {...config} />, [data,sumData])
        }
            {/* <Line {...config} /> */}
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
