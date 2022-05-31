import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import React, { useState } from 'react';
import { Resizable, ResizeCallbackData, ResizableProps } from 'react-resizable';
import './styles.less';

interface Props {
  leftComp: React.ReactNode | React.FunctionComponent;
  rightComp?: React.ReactNode | React.FunctionComponent;
  style?: any;
  leftWidth?: number; //左侧的宽度
  isShowExpandIcon: boolean; //是否要显示可折叠icon 默认不显示
  defaultClose: boolean; //是否一开始就折叠 默认不折叠
}

// 可以拖拽宽度的组件
const ResizablePro = (props: Props) => {
  const { leftComp, rightComp, isShowExpandIcon = false, leftWidth, defaultClose = false, ...rest } = props;
  const [resizeState, setResizeState] = useState<{ width: number }>({
    width: defaultClose ? 0 : leftWidth || 500,
  });

  const [close, setClose] = useState(defaultClose);

  const onClose = (e: any) => {
    e.stopPropagation();
    setResizeState({ width: close ? leftWidth || 500 : 0 });
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
          isShowExpandIcon ? (
            <div className="react-resizable-handle resizable-handle" onClick={(e) => e.stopPropagation()}>
              {close ? (
                <RightCircleFilled className="resizable-click " onClick={onClose} />
              ) : (
                <LeftCircleFilled className="resizable-click close" onClick={onClose} />
              )}
            </div>
          ) : (
            <div className="react-resizable-handle resizable-handle"></div>
          )
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
