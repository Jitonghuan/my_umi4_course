import React, { useMemo, useEffect, useState } from 'react';
// import { Column } from '@ant-design/charts';
import { Column } from '@ant-design/plots';
import { Button, Space, Form } from 'antd';

export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');

  const data = [
    {
      type: '1-3秒',
      value: 0.16,
    },
    {
      type: '4-10秒',
      value: 0.125,
    },
    {
      type: '11-30秒',
      value: 0.24,
    },
    {
      type: '31-60秒',
      value: 0.19,
    },
    {
      type: '1-3分',
      value: 0.22,
    },
    {
      type: '3-10分',
      value: 0.05,
    },
    {
      type: '10-30分',
      value: 0.01,
    },
    {
      type: '30+分',
      value: 0.015,
    },
  ];
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    label: {
      content: (originData: any) => {
        const val = parseFloat(originData.value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
      },
      offset: 10,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <>
      <h3>按集群部署类型分布情况</h3>
      <div style={{ padding: 10, height: 250 }}>
        <Column {...config} />
      </div>
    </>
  );
}
