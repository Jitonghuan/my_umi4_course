import React, { useMemo} from 'react';
import { Column } from '@ant-design/plots';
export interface ChartHistorgramIProps {
  dataSource: any;
  columnTypeData: any;
}

export default function ChartHistogram(props: ChartHistorgramIProps) {
  const { dataSource, columnTypeData } = props;
  let data: any = [];
  columnTypeData?.map((item: string) => {
    data.push({
     
      type: item,
      value: dataSource[item],
    });
  });

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    minColumnWidth: 10,
    maxColumnWidth: 20,
    label: {
      content: (originData: any) => {
        // const val = parseFloat(originData.value);
        // if (val < 0.05) {
        //   return (val * 100).toFixed(1) + '%';
        // }
      },
      offset: 10,
    },
    legend: {
      // layout: 'horizontal',
      position: 'right'
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      nice: true,
      tickInterval: 1,
    },
  };

  return (
    <>
      <h3>按集群部署类型分布情况</h3>
      <div 
      style={{ padding: 0, height: 150 }}
      >
      
        {
            useMemo(() =>  <Column {...config} />, [dataSource,columnTypeData])
        }
      </div>
    </>
  );
}
