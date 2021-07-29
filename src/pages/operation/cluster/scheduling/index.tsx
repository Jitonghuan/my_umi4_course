// 流量调度
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:36

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import { useInitClusterData, useClusterSource } from './hooks';
import './index.less';

export default function TrafficScheduling(props: any) {
  const [editField] = Form.useForm();
  const [sourceData] = useClusterSource();
  const [initData] = useInitClusterData();
  const [logger, setLogger] = useState<string>();

  useEffect(() => {
    if (!initData) return;

    editField.setFieldsValue(initData);
  }, [initData]);

  const handleSubmit = useCallback(async () => {
    const values = await editField.validateFields();
    console.log('> handleSubmit', values);

    setLogger(`> hello world
> 开始同步...
> .............
> 同步完成！
    `);
  }, [editField]);

  const handleReset = useCallback(() => {
    editField.setFieldsValue(initData || {});
  }, [editField, initData]);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="scheduling" history={props.history} />
      <ContentCard className="page-scheduling">
        <h3>请选择调度类型：</h3>
        <Form form={editField}>
          <div className="zone-card-group">
            {sourceData.map((group, index) => (
              <div className="zone-card" key={index}>
                <h4>{group.title}</h4>
                <Form.Item name={group.name} rules={[{ required: true, message: '请选择集群' }]}>
                  <Radio.Group options={group.options} size="large" />
                </Form.Item>
              </div>
            ))}
          </div>
          <div className="action-group">
            <Button type="primary" size="large" onClick={handleSubmit}>
              提交
            </Button>
            <Button hidden type="default" size="large" onClick={handleReset} style={{ marginLeft: 12 }}>
              重置
            </Button>
          </div>
        </Form>
      </ContentCard>
      <Modal
        visible={!!logger}
        title="同步日志"
        maskClosable={false}
        footer={false}
        onCancel={() => setLogger(undefined)}
        width={800}
      >
        <pre className="pre-block">{logger}</pre>
      </Modal>
    </MatrixPageContent>
  );
}
