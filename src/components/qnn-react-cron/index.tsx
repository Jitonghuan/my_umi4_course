import React from 'react';
import QnnReactCron from 'qnn-react-cron';
import { Button, Typography, Modal, Divider } from 'antd';
import { useState } from 'react';
import { BulbTwoTone } from '@ant-design/icons';

export interface ReactCronProps {
  visible: boolean;
  onCancle: () => void;
  curTimeExpress?: (express: string) => void;
}

export default function ReactCron(props: ReactCronProps) {
  let cronFns: any;
  let [value, setValue] = useState<any>('');
  const { visible, onCancle, curTimeExpress } = props;
  const { Paragraph } = Typography;
  function subCron(value: string) {
    const subCronString = value.substr(1).substring(0, value.length - 2);
    return subCronString;
  }

  return (
    <Modal
      width={800}
      title="生成时间表达式工具"
      visible={visible}
      footer={false}
      onCancel={() => {
        onCancle();
      }}
    >
      <div className="react-cron">
        <div>
          <div style={{ textAlign: 'center' }}>
            <BulbTwoTone twoToneColor="#52c41a" />
            <span style={{ color: 'gray', marginLeft: 4 }}>
              切换时间Tab前请点击<b>重置按钮</b>重置当前表达式信息
            </span>
          </div>
          <Divider />

          <div style={{ display: 'flex', textAlign: 'center' }}>
            <h3>生成的时间表达式值：</h3>
            <Paragraph copyable>{value ? subCron(value) : '--'}</Paragraph>
          </div>
        </div>
        <QnnReactCron
          value={value}
          panesShow={{
            second: false,
            minute: true,
            hour: true,
            day: true,
            month: true,
            week: true,
            year: false,
          }}
          defaultTab={'minute'}
          // onOk={(value: any) => {
          //   console.log('cron:', value);
          // }}

          getCronFns={(_cronFns: any) => {
            cronFns = _cronFns;
          }}
          footer={[
            <Button
              key="cancel"
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
                // curTimeExpress(subCron(cronFns.getValue()))
                // onCancle();
              }}
            >
              生成
            </Button>,
          ]}
        />
      </div>
    </Modal>
  );
}
