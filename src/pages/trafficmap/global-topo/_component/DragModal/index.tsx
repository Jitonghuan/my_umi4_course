/*
 * @Author: shixia.ds
 * @Date: 2021-11-29 11:30:37
 * @Description:
 */
import React, { useState } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import './index.less';
interface ModalProps {
  title: string;
  handleClose: () => void;
  children: any;
}

const DragModal: React.FC<ModalProps> = ({
  title,

  handleClose,
  children,
}) => {
  const [activeDrags, setActiveDrags] = useState<number>(0);

  const onStart = () => {
    let newActiveDrags = activeDrags + 1;
    setActiveDrags(newActiveDrags);
  };

  const onStop = () => {
    let newActiveDrags = activeDrags - 1;
    setActiveDrags(newActiveDrags);
  };
  if (!open) {
    return null;
  }

  return (
    <Draggable handle=".drag-header" onStart={onStart} onStop={onStop} bounds="body">
      <div className="app-modal" style={{ minWidth: '260px', maxWidth: '400px' }}>
        <div className="app-modal-content no-cursor">
          <Button
            className="app-modal-close"
            icon={<CloseOutlined />}
            onClick={() => {
              handleClose;
            }}
          />
          <div className="app-modal-header drag-header cursor">
            <div className="app-modal-title">{title}</div>
          </div>
          <div className="app-modal-body">
            {/* <div className="line-chart-group">
            {lineChartTmp.map((item, index: number) => (
              <LineChart {...item} {...appInfo.chartData[item.key]} key={index} />
            ))}
          </div> */}
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  );
};
export default DragModal;
