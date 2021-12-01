/*
 * @Author: shixia.ds
 * @Date: 2021-11-29 11:30:37
 * @Description: 为全局拓扑页面写的Modal。
 *               重写原因：ant design的modal有ant-modal-wrap,导致modal显示时点击事件无法到达下层dom。
 */
import React, { useState } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import './index.less';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface ModalProps {
  title: string;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  children: any;
}

const DragModal: React.FC<ModalProps> = (props) => {
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
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { onCancel } = props;
    onCancel?.(e);
  };

  const [height, setheight] = useState(810);
  const [width, setwidth] = useState(300);
  const onResize = (e: React.SyntheticEvent<Element, Event>, data: ResizeCallbackData) => {
    setheight(data.size.height);
    setwidth(data.size.width);
  };

  return (
    <Draggable handle=".drag-header" onStart={onStart} onStop={onStop} bounds="body">
      {/* <Resizable width={width} height={height} onResize={onResize} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}> */}
      <div className="app-modal" style={{ width: `${width}px`, minWidth: '260px', maxWidth: '400px' }}>
        <div className="app-modal-content no-cursor">
          <Button className="app-modal-close" icon={<CloseOutlined />} onClick={handleCancel} />
          <div className="app-modal-header drag-header cursor">
            <div className="app-modal-title">{props.title}</div>
          </div>
          {/* <div className="app-modal-body">{props.children}</div> */}

          <Resizable width={width} height={height} onResize={onResize} resizeHandles={['se', 'e', 's']}>
            <div
              className="app-modal-body"
              style={{ width: `${width}px`, height: `${height}px`, minWidth: '260px', maxWidth: '400px' }}
            >
              {props.children}
            </div>
          </Resizable>
        </div>
      </div>
      {/* <div className="box" style={{ width: width + 'px', height: height + 'px' }}>
          <span>Contents</span>
        </div> */}
      {/* </Resizable> */}
    </Draggable>
  );
};
export default DragModal;
