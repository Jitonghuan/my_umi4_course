import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import CpuUtilization from './cpu-utilization-line';
import LoadUtilization from './load-utilization-line';
import MemroyUtilization from './memory-utilization-line';
import DiskUtilization from './disk-utilization-line';
import DiskIOChart from './diskIO-line';
import NetWorkChart from './network-line';
import FileOpen from './file-charts';
import SocketCharts from './socket-charts';
import './index.less';

export interface minitorDashboardProps {
  ipDetailVisiable?: boolean;
  onOk?: () => any;
  onCancel?: () => any;
  initData?: any;
  loadings?: any;
}
export default function DashboardsModal(props: minitorDashboardProps) {
  const { ipDetailVisiable, onOk, onCancel, initData, loadings } = props;
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
          <CpuUtilization data={initData?.nodeCpu} loading={loadings?.nodeCpu} />
        </div>
        <div className="block">
          <MemroyUtilization data={initData?.nodeMem} loading={loadings?.nodeMem} />
        </div>
        <div className="block">
          <LoadUtilization data={initData?.nodeLoad} loading={loadings?.nodeLoad} />
        </div>

        <div className="block">
          <DiskUtilization data={initData?.nodeDisk} loading={loadings?.nodeDisk} />
        </div>
        <div className="block">
          <DiskIOChart data={initData?.nodeIO} loading={loadings?.nodeIO} />
        </div>
        <div className="block">
          <NetWorkChart data={initData?.nodeNetWork} loading={loadings?.nodeNetWork} />
        </div>
        <div className="blockLeft">
          <SocketCharts data={initData?.nodeSocket} loading={loadings?.nodeSocket} />
        </div>
        <div className="blockRight">
          <FileOpen data={initData?.nodeFile} loading={loadings?.nodeFile} />
        </div>
      </div>
    </Modal>
  );
}
