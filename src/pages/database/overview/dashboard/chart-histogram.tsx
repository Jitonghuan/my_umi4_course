import { Column } from '@ant-design/plots';
export interface ChartHistorgramIProps {
  dataSource: any;
}

export default function ChartHistogram(props: ChartHistorgramIProps) {
  const { dataSource } = props;

  const data = [
    {
      type: 'Mysql operator',
      value: dataSource?.sumOperator,
    },
    {
      type: 'MHA',
      value: dataSource?.sumLocal,
    },

    {
      type: 'Cloud',
      value: dataSource?.sumCloud,
    },
  ];
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    minColumnWidth: 20,
    maxColumnWidth: 30,
    label: {
      content: (originData: any) => {
        // const val = parseFloat(originData.value);
        // if (val < 0.05) {
        //   return (val * 100).toFixed(1) + '%';
        // }
      },
      offset: 10,
    },
    legend: true,
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
      <div style={{ padding: 10, height: 210 }}>
        <Column {...config} />
      </div>
    </>
  );
}
