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

export default class DragModal extends React.Component<any, any> {
  state = {
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0,
    },
    controlledPosition: {
      x: -400,
      y: 200,
    },
  };

  // handleDrag = (e, ui) => {
  //   const { x, y } = this.state.deltaPosition;
  //   this.setState({
  //     deltaPosition: {
  //       x: x + ui.deltaX,
  //       y: y + ui.deltaY,
  //     }
  //   });
  // };

  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };
  // onDrop = (e) => {
  //   this.setState({ activeDrags: --this.state.activeDrags });
  //   if (e.target.classList.contains("drop-target")) {
  //     alert("Dropped!");
  //     e.target.classList.remove('hovered');
  //   }
  // };
  // onDropAreaMouseEnter = (e) => {
  //   if (this.state.activeDrags) {
  //     e.target.classList.add('hovered');
  //   }
  // }
  // onDropAreaMouseLeave = (e) => {
  //   e.target.classList.remove('hovered');
  // }

  // For controlled component
  // adjustXPos = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const { x, y } = this.state.controlledPosition;
  //   this.setState({ controlledPosition: { x: x - 10, y } });
  // };

  // adjustYPos = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const { controlledPosition } = this.state;
  //   const { x, y } = controlledPosition;
  //   this.setState({ controlledPosition: { x, y: y - 10 } });
  // };

  // onControlledDrag = (e, position) => {
  //   const { x, y } = position;
  //   this.setState({ controlledPosition: { x, y } });
  // };

  // onControlledDragStop = (e, position) => {
  //   this.onControlledDrag(e, position);
  //   this.onStop();
  // };

  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const { deltaPosition, controlledPosition } = this.state;
    return (
      <div>
        {this.props.appInfoList.map((appInfo: IAppInfo) => {
          return (
            // <Draggable handle="strong">
            //   <div className="box no-cursor" style={{ display: 'flex', flexDirection: 'column' }}>
            //     <strong className="cursor"><div>Drag here</div></strong>
            //     <div style={{ overflow: 'scroll' }}>
            //       <div style={{ background: 'yellow', whiteSpace: 'pre-wrap' }}>
            //         I have long scrollable content with a handle
            //         {'\n' + Array(40).fill('x').join('\n')}
            //       </div>
            //     </div>
            //   </div>
            // </Draggable>
            <Draggable handle=".drag-header" {...dragHandlers}>
              <div className="app-modal" style={{ width: '520px', transformOrigin: '78px -58px' }}>
                <div className="app-modal-content no-cursor">
                  <Button
                    className="app-modal-close"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      this.props.deleteModal(appInfo);
                    }}
                  />
                  {/* <strong className="cursor"> */}
                  <div className="app-modal-header drag-header cursor">
                    <div className="app-modal-title">{appInfo.name}</div>
                  </div>
                  {/* </strong> */}
                  <div className="app-modal-body">
                    <div className="line-chart-group">
                      {lineChartTmp.map((item, index: number) => (
                        <LineChart {...item} {...appInfo.chartData[item.key]} key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Draggable>
          );
        })}
      </div>
    );
  }
}
