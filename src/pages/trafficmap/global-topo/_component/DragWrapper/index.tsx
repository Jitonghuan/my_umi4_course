/*
 * @Author: shixia.ds
 * @Date: 2021-11-30 16:13:42
 * @Description:
 */
import React from 'react';
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
  return (
    <div className="drag-wrapper">
      {props.appInfoList.map((appInfo: IAppInfo) => {
        return (
          <DragModal
            title={appInfo.name}
            onCancel={() => {
              props.deleteModal(appInfo);
            }}
          >
            <div className="line-chart-group">
              {lineChartTmp.map((item, index: number) => (
                <LineChart {...item} {...appInfo.chartData[item.key]} key={index} />
              ))}
            </div>
          </DragModal>
        );
      })}
    </div>
  );
};
export default DragWrapper;
