import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import CpuUtilization from './cpu-utilization-line';
import LoadUtilization from './load-utilization-line';
import MemroyUtilization from './memory-utilization-line';

import './index.less';

export interface minitorDashboardProps {
  ipDetailVisiable?: boolean;
  onOk?: () => any;
  onCancel?: () => any;
  initData?: any;
}
export default function DashboardsModal(props: minitorDashboardProps) {
  const { ipDetailVisiable, onOk, onCancel, initData } = props;
  useEffect(() => {}, []);

  return (
    <Modal
      className="minitor-dashboards"
      visible={ipDetailVisiable}
      onOk={onOk}
      onCancel={onCancel}
      title="图表"
      width={'90%'}
      bodyStyle={{ height: '80%' }}
    >
      {/* <div className="section-group">
        11111
      </div>
      <div className="section-group">
        2222
      </div> */}
      <div className="blockDiv">
        <div className="block">
          <CpuUtilization data={initData?.nodeCpu} loading={false} />
        </div>
        <div className="block">
          <LoadUtilization data={initData?.nodeLoad} loading={false} />
        </div>
        <div className="block">
          <MemroyUtilization data={initData?.nodeMem} loading={false} />
        </div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        {/* <div className="block"></div> */}
        <div className="blockLeft"></div>
        <div className="`blockRight`"></div>
      </div>
    </Modal>
  );
}
