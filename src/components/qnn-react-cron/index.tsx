import React from 'react';
import QnnReactCron from 'qnn-react-cron';
import { Button, Typography, Modal, Tag } from 'antd';
import { useState } from 'react';

export interface ReactCronProps {
  visible: boolean;
  onCancle: () => void;
  curTimeExpress: (express: string) => void;
}

export default function ReactCron(props: ReactCronProps) {
  let cronFns: any;
  let [value, setValue] = useState<any>('');
  const { visible, onCancle, curTimeExpress } = props;
  const { Paragraph } = Typography;
  function subCron(value: string) {
    const subCronString = value?.substr(1).substring(0, value.length - 2);
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
          <div style={{ display: 'flex', textAlign: 'center' }}>
            <h3>生成的时间表达式值：</h3>
            {value ? subCron(value) : '--'}
            {value && (
              <div style={{ marginLeft: 10 }}>
                <Tag
                  color="geekblue"
                  onClick={() => {
                    curTimeExpress(subCron(value));
                    onCancle();
                  }}
                >
                  使用
                </Tag>
              </div>
            )}
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
              danger
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
    </Modal>
  );
}
