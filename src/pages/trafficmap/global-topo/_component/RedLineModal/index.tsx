/*
 * @Author: shixia.ds
 * @Date: 2021-11-30 15:44:26
 * @Description: 红线追踪弹窗：可拖动
 */
import React, { useRef, useState } from 'react';
import { List } from 'antd';
import DragModal from '../DragModal';
import './index.less';
interface IProps {
  visible: boolean;
  redLineList: any[];
  handleCancel: () => void;
}

const RedLineModal: React.FC<IProps> = (props) => {
  // const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  // const [disabled, setDisabled] = useState(true)
  // const draggleRef = useRef<any>();

  // const onStart = (event: any, uiData: any) => {
  //   const { clientWidth, clientHeight } = window.document.documentElement;
  //   const targetRect = draggleRef.current?.getBoundingClientRect();
  //   if (!targetRect) {
  //     return;
  //   }
  //   setBounds({
  //     left: -targetRect.left + uiData.x,
  //     right: clientWidth - (targetRect.right - uiData.x),
  //     top: -targetRect.top + uiData.y,
  //     bottom: clientHeight - (targetRect.bottom - uiData.y),
  //   })
  // };

  return (
    <div className="drag-redline-modal" style={{ display: props.visible ? 'block' : 'none' }}>
      <DragModal title={'红线追踪'} onCancel={props.handleCancel}>
        <div>
          {props.redLineList.map((item) => {
            return (
              <div className="redline-container">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="3929"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M512 298.666667c103.210667 0 189.301333 73.290667 209.066667 170.666666H981.333333a42.666667 42.666667 0 0 1 1.333334 85.312L981.333333 554.666667h-260.266666c-19.770667 97.376-105.861333 170.666667-209.066667 170.666666-103.205333 0-189.296-73.290667-209.066667-170.666666H42.666667a42.666667 42.666667 0 0 1-1.333334-85.312L42.666667 469.333333h260.266666C322.698667 371.957333 408.789333 298.666667 512 298.666667z"
                      p-id="3930"
                      fill="#F5222D"
                    />
                  </svg>
                  <span>2021-11-30 10:26:00</span>
                </div>
              </div>
            );
          })}
        </div>
      </DragModal>
    </div>
  );
};

export default RedLineModal;
