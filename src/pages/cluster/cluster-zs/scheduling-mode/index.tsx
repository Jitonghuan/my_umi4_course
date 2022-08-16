import React, { useState } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { Select } from 'antd';
import OperatorScheduling from '../operator-scheduling';
import Scheduling from '../scheduling';
export default function SchedulingMode() {
  const [scheduleMode, setScheduleMode] = useState<string>('cluster');
  const [operatorVisable, setOperatorVisable] = useState<boolean>(false);
  const [schedulingVisable, setSchedulingVisable] = useState<boolean>(false);
  const schedulingOptions = [
    {
      label: '集群维度',
      value: 'cluster',
    },
    {
      label: '用户-操作员维度',
      value: 'operator',
    },
  ];
  const getSchedulingMode = (value: string) => {
    setScheduleMode(value);
    if (value === 'cluster') {
      setSchedulingVisable(true);
    }
    if (value === 'operator') {
      setOperatorVisable(true);
    }
  };
  return (
    <ContentCard>
      <div style={{ display: 'flex',marginBottom:10 }}>
        <h3>调度模式 :</h3>
        <Select
          options={schedulingOptions}
          style={{ width: 220, paddingLeft: 8 }}
          onChange={getSchedulingMode}
          value={scheduleMode}
        ></Select>
      </div>
      {/* <OperatorScheduling/> */}

      {scheduleMode === 'cluster' && <Scheduling visable={schedulingVisable} />}
      {scheduleMode === 'operator' && <OperatorScheduling visable={operatorVisable} />}
    </ContentCard>
  );
}
