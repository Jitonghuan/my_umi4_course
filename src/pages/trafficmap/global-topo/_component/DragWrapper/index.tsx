/*
 * @Author: shixia.ds
 * @Date: 2021-11-30 16:13:42
 * @Description: 应用信息AppInfo 可拖拽弹窗弹层。
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import LineChart from '../line-chart';
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

interface DragWrapperProps {
  appInfoList: IAppInfo[];
  deleteModal: (app: IAppInfo) => void;
}

const DragWrapper: React.FC<DragWrapperProps> = (props) => {
  const [chartArr, setChartArr] = useState<echarts.ECharts[]>([]);
  const { appInfoList, deleteModal } = props;

  /**
   * 存储echart实例
   * @param echart
   */
  const getChart = (echart: echarts.ECharts) => {
    chartArr.push(echart);
    setChartArr(chartArr);
  };

  /**
   * resize结束时改变echart的大小
   */
  const onResizeStop = () => {
    chartArr.map((item: echarts.ECharts) => {
      item.resize();
    });
  };

  // const onResizeStart = () => {};

  return (
    <div className="drag-wrapper">
      {appInfoList.map((appInfo: IAppInfo, appId: number) => {
        return (
          <DragModal
            key={appInfo.id}
            title={appInfo.name}
            width={260}
            height={810}
            modalResize={{
              resizeHandles: ['se', 'e', 's'],
              minConstraints: [260, 810],
              onResizeStop: onResizeStop,
            }}
            onCancel={() => {
              deleteModal(appInfo);
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
