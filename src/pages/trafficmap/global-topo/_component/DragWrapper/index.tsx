/*
 * @Author: shixia.ds
 * @Date: 2021-11-30 16:13:42
 * @Description:
 */
/*
 * @Author: shixia.ds
 * @Date: 2021-11-29 11:30:37
 * @Description:
 */
import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import LineChart from '../../../_component/line-chart';
import './index.less';
import { IAppInfo, IChartData } from '@/pages/trafficmap/interface';
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

export default class DragWrapper extends React.Component<any, any> {
  render() {
    return (
      <div className="drag-wrapper">
        {this.props.appInfoList.map((appInfo: IAppInfo) => {
          return (
            <DragModal
              title={appInfo.name}
              onCancel={() => {
                this.props.deleteModal(appInfo);
              }}
            >
              <div className="line-chart-group">
                {lineChartTmp.map((item, index: number) => (
                  <LineChart {...item} {...appInfo.chartData[item.key]} key={index} />
                ))}
              </div>
            </DragModal>
            // <Draggable handle=".drag-header" {...dragHandlers} bounds="body">
            //   <div className="app-modal" style={{ minWidth: '260px', maxWidth: '400px' }}>
            //     <div className="app-modal-content no-cursor">
            //       <Button
            //         className="app-modal-close"
            //         icon={<CloseOutlined />}
            //         onClick={() => {
            //           this.props.deleteModal(appInfo);
            //         }}
            //       />
            //       {/* <strong className="cursor"> */}
            //       <div className="app-modal-header drag-header cursor">
            //         <div className="app-modal-title">{appInfo.name}</div>
            //       </div>
            //       {/* </strong> */}
            //       <div className="app-modal-body">
            //         <div className="line-chart-group">
            //           {lineChartTmp.map((item, index: number) => (
            //             <LineChart {...item} {...appInfo.chartData[item.key]} key={index} />
            //           ))}
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </Draggable>
          );
        })}
      </div>
    );
  }
}
