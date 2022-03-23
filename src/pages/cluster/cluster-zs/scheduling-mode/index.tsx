import React, { useCallback, useEffect, useState } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { Form, Radio, Button, Modal, Card, Select, Input, Table, message, Divider } from 'antd';
import OperatorScheduling from '../operator-scheduling';
import Scheduling from '../scheduling';
export default function SchedulingMode() {
  const [scheduleMode, setScheduleMode] = useState<string>('cluster');
  const schedulingOptions = [
    {
      label: '集群维度',
      value: 'cluster',
    },
    {
      label: '患者-操作员维度',
      value: 'operator',
    },
  ];
  const getSchedulingMode = (value: string) => {
    setScheduleMode(value);
  };
  return (
    <ContentCard>
      <div style={{ display: 'flex' }}>
        <h3>调度模式 :</h3>
        <Select
          options={schedulingOptions}
          style={{ width: 220, paddingLeft: 8 }}
          onChange={getSchedulingMode}
          value={scheduleMode}
        ></Select>
      </div>
      {/* <OperatorScheduling/> */}

      {scheduleMode === 'cluster' && <Scheduling />}
      {scheduleMode === 'operator' && <OperatorScheduling />}
    </ContentCard>
  );
}
