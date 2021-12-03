/*
 * @Author: shixia.ds
 * @Date: 2021-11-30 16:13:42
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import LineChart from '../../../_component/line-chart';
import './index.less';
import { IAppInfo } from '@/pages/trafficmap/interface';
import DragModal from '../DragModal';

const lineChartTmp = [
  {
    title: '请求数/每分钟',
    key: 'requests' as 'requests',
  },
  {
    title: '平均响应时间/分钟',
    key: 'averageResponseTime' as 'averageResponseTime',
  },
  {
    title: 'HTTP-响应码',
    key: 'responseCodes' as 'responseCodes',
  },
];

const DragWrapper: React.FC<any> = (props) => {
  const [chartArr, setChartArr] = useState<any>([]);

  const getChart = (echart: echarts.ECharts) => {
    chartArr.push(echart);
    setChartArr(chartArr);
  };

  const onResizeStop = () => {
    chartArr.map((item: any) => {
      item.resize();
    });
    // Object.keys(chartArr).forEach((item) => {
    //   chartArr[item].map((i) => {
    //     i.resize()
    //   })
    // })
  };
  const onResizeStart = () => {};

  return (
    <div className="drag-wrapper">
      {props.appInfoList.map((appInfo: IAppInfo, appId: number) => {
        return (
          <DragModal
            title={appInfo.name}
            modalResize={{
              width: 260,
              height: 810,
              resizeHandles: ['se', 'e', 's'],
              minConstraints: [260, 810],
              onResizeStart: onResizeStart,
              onResizeStop: onResizeStop,
            }}
            onCancel={() => {
              props.deleteModal(appInfo);
            }}
          >
            <div className="echart-group">
              {lineChartTmp.map((item, index: number) => (
                <LineChart {...item} {...appInfo.chartData[item.key]} key={index} getChart={getChart} />
              ))}
            </div>
            <Button style={{ float: 'right' }}>应用流量</Button>
          </DragModal>
        );
      })}
    </div>
  );
};
export default DragWrapper;
