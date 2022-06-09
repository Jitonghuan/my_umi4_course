import React from 'react';
import QnnReactCron from 'qnn-react-cron';
import { Button, Typography } from 'antd';
import { useEffect, useState, useRef } from 'react';

export default function ReactCron() {
  let cronFns: any;
  let [value, setValue] = useState<any>('');
  const { Paragraph } = Typography;

  return (
    <div className="react-cron">
      <div style={{ margin: '12px 0px' }}>
        <div style={{ display: 'flex', textAlign: 'center' }}>
          生成的时间表达式值：<Paragraph copyable>{value || '--'}</Paragraph>
        </div>
      </div>
      <QnnReactCron
        value={value}
        onOk={(value: any) => {
          console.log('cron:', value);
        }}
        getCronFns={(_cronFns: any) => {
          cronFns = _cronFns;
        }}
        footer={[
          <Button
            key="cencel"
            style={{ marginRight: 10 }}
            onClick={() => {
              setValue(null);
            }}
          >
            重置
          </Button>,
          <Button
            key="getValue"
            type="primary"
            onClick={() => {
              setValue(cronFns.getValue());
            }}
          >
            生成
          </Button>,
        ]}
      />
    </div>
  );
}
