import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import CpuUtilization from './cpu-utilization-line';
import LoadUtilization from './load-utilization-line';
import MemroyUtilization from './memory-utilization-line';
import DiskUtilization from './disk-utilization-line';
import DiskIOChart from './diskIO-line';
import NetWorkChart from './network-line';
import FileOpen from './file-charts';
import SocketCharts from './socket-charts';
import {
  useQueryNodeCpu,
  usequeryNodeMem,
  useQueryNodeDisk,
  useQueryNodeLoad,
  useQueryNodeIO,
  useQueryNodeFile,
  useQueryNodeSocket,
  useQueryNodeNetWork,
} from './hooks';
import './index.less';

export interface minitorDashboardProps {
  ipDetailVisiable?: boolean;
  onOk?: () => any;
  onCancel?: () => any;
  initData?: any;
  loadings?: any;
  currentIpData: string;
  currentClusterData: string;
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
  const { ipDetailVisiable, onOk, onCancel, initData, loadings, currentIpData, currentClusterData } = props;
  const [queryNodeCpuData, nodeCpuloading, queryNodeCpu] = useQueryNodeCpu();
  const [queryNodeMemData, nodeMemloading, queryNodeMem] = usequeryNodeMem();
  const [queryNodeDiskData, nodeDiskloading, queryNodeDisk] = useQueryNodeDisk();
  const [queryNodeLoadData, nodeLoadloading, queryNodeLoad] = useQueryNodeLoad();
  const [queryNodeIOData, nodeIoloading, queryNodeIO] = useQueryNodeIO();
  const [queryNodeFileData, nodeFileloading, queryNodeFile] = useQueryNodeFile();
  const [queryNodeSocketData, nodeSocketloading, queryNodeSocket] = useQueryNodeSocket();
  const [queryNodeNetWorkData, nodeNetWorkloading, queryNodeNetWork] = useQueryNodeNetWork();

  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  // 选择就近时间触发的事件
  const selectRelativeTime = (value: any) => {
    const now = new Date().getTime();
    setStartTime(value);
    let startTimepl = Number((now - value) / 1000).toString();
    let endTimepl = Number(now / 1000).toString();
    setStartTimestamp(startTimepl);
    setEndTimestamp(endTimepl);
    queryNodeCpu(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeMem(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeDisk(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeLoad(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeIO(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeFile(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeSocket(currentClusterData, currentIpData, startTimepl, endTimepl);
    queryNodeNetWork(currentClusterData, currentIpData, startTimepl, endTimepl);
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
      {/* <div className="section-group">
        11111
      </div>
      <div className="section-group">
        2222
      </div> */}
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
          <CpuUtilization data={initData?.nodeCpu || queryNodeCpuData} loading={loadings?.nodeCpu || nodeCpuloading} />
        </div>
        <div className="block">
          <MemroyUtilization
            data={initData?.nodeMem || queryNodeMemData}
            loading={loadings?.nodeMem || nodeMemloading}
          />
        </div>
        <div className="block">
          <LoadUtilization
            data={initData?.nodeLoad || queryNodeLoadData}
            loading={loadings?.nodeLoad || nodeLoadloading}
          />
        </div>

        <div className="block">
          <DiskUtilization
            data={initData?.nodeDisk || queryNodeDiskData}
            loading={loadings?.nodeDisk || nodeDiskloading}
          />
        </div>
        <div className="block">
          <DiskIOChart data={initData?.nodeIO || queryNodeIOData} loading={loadings?.nodeIO || nodeIoloading} />
        </div>
        <div className="block">
          <NetWorkChart
            data={initData?.nodeNetWork || queryNodeNetWorkData}
            loading={loadings?.nodeNetWork || nodeNetWorkloading}
          />
        </div>
        <div className="blockLeft">
          <SocketCharts
            data={initData?.nodeSocket || queryNodeSocketData}
            loading={loadings?.nodeSocket || nodeSocketloading}
          />
        </div>
        <div className="blockRight">
          <FileOpen data={initData?.nodeFile || queryNodeFileData} loading={loadings?.nodeFile || nodeFileloading} />
        </div>
      </div>
    </Modal>
  );
}
