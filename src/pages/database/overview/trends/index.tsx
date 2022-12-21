import React, { useState, useEffect,useContext } from 'react';
import { Select } from 'antd';
import CpuUtilization from './cpu-utilization-line';
import TpsQps from './tps-qps-line';
import MemroyUtilization from './memory-utilization-line';
import SessionConnection from './ session-connection-line';
import ExecutionsCount from './executions-count';
import TrafficThroughput from './traffic-throughput';
import { useQueryPerformanceTrends } from './hooks';
import  DetailContext  from '../../instance-list/components/instance-info/context'
import './index.less';

// export interface DashboardProps {
//   instanceId: any;
// }
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

export default function DashboardsInfo(props:any) {
  // const { instanceId } = props;

  const [lineData, loading, queryPerformanceTrends] = useQueryPerformanceTrends();

  //数据驱动视图 ，需要用useState来驱动，不可以在选择事件中直接赋值

  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  const {instanceId}=useContext(DetailContext)
  useEffect(() => {
    if (instanceId) {
      queryPerformanceTrends({
        instanceId: instanceId,
        start: startTimestamp,
        end: endTimestamp,
      });
    }
  }, [instanceId, startTimestamp]);

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
        <span style={{ marginRight: 12, float: 'right', paddingTop: 12 }}>
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
          <section data-loading={loading}>
            <CpuUtilization data={lineData?.cpuMem || []} loading={loading} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loading}>
            <MemroyUtilization data={lineData?.memLimit || []} loading={loading} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loading}>
            <TpsQps data={lineData?.tpsQps || []} loading={loading} />
          </section>
        </div>

        <div className="block">
          <section data-loading={loading}>
            <SessionConnection data={lineData?.connection || []} loading={loading} />
          </section>
        </div>
        <div className="block">
          <section data-loading={loading}>
            <TrafficThroughput data={lineData?.transmit || []} loading={loading} />
          </section>
        </div>

        <div className="block">
          <section data-loading={loading}>
            <ExecutionsCount data={lineData?.rowsOpsData || []} loading={loading} />
          </section>
        </div>
      </div>
    </>
  );
}
