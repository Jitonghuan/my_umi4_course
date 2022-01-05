import React, { useState, useEffect } from 'react';
import { Button, Modal, Select } from 'antd';
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
  currentIpData: string;
  currentClusterData: string;
  querChartData: (getCluster: any, startTime: any, endTime: any, ip: any, isOpen: boolean) => any;
  queryCount: number;
}
export const START_TIME_ENUMS = [
  {
    label: 'Last 15 minutes',
    value: 15 * 60 * 1000,
  },
  {
    label: 'Last 30 minutes',
    value: 30 * 60 * 1000,
  },
  {
    label: 'Last 1 hours',
    value: 60 * 60 * 1000,
  },
  {
    label: 'Last 6 hours',
    value: 6 * 60 * 60 * 1000,
  },
  {
    label: 'Last 12 hours',
    value: 12 * 60 * 60 * 1000,
  },
  {
    label: 'Last 24 hours',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: 'Last 3 days',
    value: 24 * 60 * 60 * 1000 * 3,
  },
  {
    label: 'Last 7 days',
    value: 24 * 60 * 60 * 1000 * 7,
  },
  {
    label: 'Last 30 days',
    value: 24 * 60 * 60 * 1000 * 30,
  },
];

export default function DashboardsModal(props: minitorDashboardProps) {
  const {
    ipDetailVisiable,
    onOk,
    onCancel,
    initData,
    loadings,
    currentIpData,
    currentClusterData,
    querChartData,
    queryCount,
  } = props;

  //数据驱动视图 ，需要用useState来驱动，不可以在选择事件中直接赋值
  const [nodeCpuData, setNodeCpuData] = useState<any>();
  const [nodeMemData, setNodeMemData] = useState<any>();
  const [nodeDiskData, setNodeDiskData] = useState<any>();
  const [nodeLoadData, setNodeLoadData] = useState<any>();
  const [nodeIOData, setNodeIOData] = useState<any>();
  const [nodeFileData, setNodeFileData] = useState<any>();
  const [nodeNetWorkData, setNodeNetWorkData] = useState<any>();
  const [nodeSocketData, setNodeSocketData] = useState<any>();
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  useEffect(() => {
    if (initData) {
      setNodeCpuData(initData?.nodeCpu);
      setNodeMemData(initData?.nodeMem);
      setNodeDiskData(initData?.nodeDisk);
      setNodeLoadData(initData?.nodeLoad);
      setNodeIOData(initData?.nodeIO);
      setNodeFileData(initData?.nodeFile);
      setNodeNetWorkData(initData?.nodeNetWork);
      setNodeSocketData(initData?.nodeSocket);
    }
  }, [initData]);

  // 选择就近时间触发的事件
  const selectRelativeTime = (value: any) => {
    const now = new Date().getTime();
    setStartTime(value);
    let startTimepl = Number((now - value) / 1000).toString();
    let endTimepl = Number(now / 1000).toString();
    setStartTimestamp(startTimepl);
    setEndTimestamp(endTimepl);
    querChartData(currentClusterData, startTimepl, endTimepl, currentIpData, false);
  };

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
      <div>
        <span style={{ marginLeft: '88%' }}>
          <Select value={startTime} onChange={selectRelativeTime} style={{ width: 140 }}>
            <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
            {START_TIME_ENUMS.map((time) => (
              <Select.Option key={time.value} value={time.value}>
                {time.label}
              </Select.Option>
            ))}
          </Select>
        </span>
      </div>
      <div className="blockDiv">
        <div className="block">
          <CpuUtilization data={nodeCpuData} loading={loadings?.nodeCpu} />
        </div>
        <div className="block">
          <MemroyUtilization data={nodeMemData} loading={loadings?.nodeMem} />
        </div>
        <div className="block">
          <LoadUtilization data={nodeLoadData} loading={loadings?.nodeLoad} />
        </div>

        <div className="block">
          <DiskUtilization data={nodeDiskData} loading={loadings?.nodeDisk} />
        </div>
        <div className="block">
          <DiskIOChart data={nodeIOData} loading={loadings?.nodeIO} />
        </div>
        <div className="block">
          <NetWorkChart data={nodeNetWorkData} loading={loadings?.nodeNetWork} />
        </div>
        <div className="blockLeft">
          <SocketCharts data={nodeSocketData} loading={loadings?.nodeSocket} />
        </div>
        <div className="blockRight">
          <FileOpen data={nodeFileData} loading={loadings?.nodeFile} />
        </div>
      </div>
    </Modal>
  );
}
