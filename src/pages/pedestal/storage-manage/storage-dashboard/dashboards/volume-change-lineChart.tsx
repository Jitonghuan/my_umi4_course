// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from '@cffe/h2o-design';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
  clusterCode: string;
  queryChartData: (clusterCode: any, dateParam: any) => void;
}
const { ColorContainer } = colorUtil.context;
export default function VolumeChangeLineChart(props: ChartCaseListProps) {
  const { data, loading, clusterCode, queryChartData } = props;
  const [currentTime, setCurrentTime] = useState<number>(7);

  const config = {
    data,
    xField: 'time',
    yField: 'number',
    color: '#69a794',
    yAxis: {
      // title: {
      //   text: '数量',
      // },
      label: {
        // 数值格式化
        formatter: (v: any) => `${v}个`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'number', value: datum.number + '个' };
      },
    },
    width: 550,
    height: 260,
    // padding: 34,
    paddingTop: 34,
    paddingLeft: 34,
    paddingBottom: 30,
    paddingRight: 40,
  };
  const timeRanger = [
    { label: '7天', value: 7 },
    { label: '15天', value: 15 },
    { label: '30天', value: 30 },
  ];
  const selectTimeRanger = (value: number) => {
    setCurrentTime(value);
    queryChartData(clusterCode, value);
  };

  return (
    <section data-loading={loading} style={{ paddingLeft: 18 }}>
      <header>
        <h3 className="volume-line-section-header">
          <span>volume变化趋势图 </span>
          <span>
            <Select
              style={{ width: 140 }}
              options={timeRanger}
              value={currentTime}
              onChange={selectTimeRanger}
            ></Select>
          </span>
        </h3>
      </header>
      <div>
        <div className="volume-change-line-Chart">
          <ColorContainer roleKeys={['color']}>
            <Line {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
