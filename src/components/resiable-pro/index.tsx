import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import React, { useState } from 'react';
import { Resizable, ResizeCallbackData, ResizableProps } from 'react-resizable';
import './styles.less';

interface Props {
  leftComp: React.ReactNode | React.FunctionComponent;
  rightComp?: React.ReactNode | React.FunctionComponent;
  style?: any;
  leftWidth?: number;
}

// 可以拖拽宽度的组件
const ResizablePro = (props: Props) => {
  const { leftComp, rightComp, leftWidth, ...rest } = props;
  const [resizeState, setResizeState] = useState<{ width: number }>({
    width: leftWidth || 500,
  });
  const [close, setClose] = useState(false);

  const onClose = (e: any) => {
    e.stopPropagation();
    setResizeState({ width: close ? leftWidth || 500 : 100 });
    setClose(!close);
  };

  const onResize = (event: React.SyntheticEvent<Element, Event>, { size }: ResizeCallbackData) => {
    setResizeState({ width: size.width });
  };
  return (
    <div className="page-resizable" {...rest}>
      <Resizable
        className="resizable-left"
        onResize={onResize}
        width={resizeState.width}
        handle={
          <div className="react-resizable-handle resizable-handle" onClick={(e) => e.stopPropagation()}>
            {/* <span
              onClick={onClose}
              className={`resizable-handle-triangle ${close ? 'close' : ''}`}
            /> */}
            {close ? (
              <RightCircleFilled className="resizable-click " onClick={onClose} />
            ) : (
              <LeftCircleFilled className="resizable-click close" onClick={onClose} />
            )}
          </div>
        }
        height={0}
      >
        <div style={{ width: resizeState.width, paddingRight: '12px' }}>{leftComp}</div>
      </Resizable>
      <div className="resizable-right">{rightComp}</div>
    </div>
  );
};

export default ResizablePro;
