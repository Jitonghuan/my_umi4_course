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
  clusterId: number;
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
  const { clusterId } = props;

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

  useEffect(() => {}, []);

  // 选择就近时间触发的事件
  const selectRelativeTime = (value: any) => {
    const now = new Date().getTime();
    setStartTime(value);
    let startTimepl = Number((now - value) / 1000).toString();
    let endTimepl = Number(now / 1000).toString();
    setStartTimestamp(startTimepl);
    setEndTimestamp(endTimepl);
  };

  return (
    <>
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
          <section data-loading={loadings.nodeCpu}>
            <CpuUtilization data={nodeCpuData} loading={loadings?.nodeCpu} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loadings.nodeMem}>
            <MemroyUtilization data={nodeMemData} loading={loadings?.nodeMem} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loadings.nodeDisk}>
            <LoadUtilization data={nodeLoadData} loading={loadings?.nodeLoad} />
          </section>
        </div>

        <div className="block">
          <section data-loading={loadings.nodeLoad}>
            <DiskUtilization data={nodeDiskData} loading={loadings?.nodeDisk} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loadings.nodeIO}>
            <DiskIOChart data={nodeIOData} loading={loadings?.nodeIO} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loadings.nodeFile}>
            <NetWorkChart data={nodeNetWorkData} loading={loadings?.nodeNetWork} />
          </section>
        </div>
        <div className="blockLeft">
          <section data-loading={loadings.nodeSocket}>
            <SocketCharts data={nodeSocketData} loading={loadings?.nodeSocket} />
          </section>
        </div>
        <div className="blockRight">
          <section data-loading={loadings.nodeNetWork}>
            <FileOpen data={nodeFileData} loading={loadings?.nodeFile} />
          </section>
        </div>
      </div>
    </>
  );
}
