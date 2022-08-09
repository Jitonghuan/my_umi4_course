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