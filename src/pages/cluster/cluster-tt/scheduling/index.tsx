// 流量调度
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:36

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { useInitClusterData, useClusterSource } from './hooks';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import './index.less';

export default function TrafficScheduling() {
  const [editField] = Form.useForm();
  const [sourceData] = useClusterSource();
  const [initData] = useInitClusterData();
  const [logger, setLogger] = useState<string>();
  const [pending, setPending] = useState(false);

  // 回填初始化数据到表单
  useEffect(() => {
    if (!initData) return;

    editField.setFieldsValue(initData);
  }, [initData]);

  const handleSubmit = useCallback(async () => {
    const values = await editField.validateFields();

    Modal.confirm({
      title: '操作确认',
      content: (
        <div className="schedule-confirm-content">
          <h4>请确认即将调度的内容：</h4>
          {sourceData.map((item: any, index) => (
            <p key={index}>
              {item.title} <ArrowRightOutlined />
              <b>{item.options?.find((n: any) => n.value === values[item.name])?.label}</b>
            </p>
          ))}
        </div>
      ),
      okText: '我已确认无误',
      cancelText: '取消',
      onOk: async () => {
        setPending(true);
        try {
          const result = await postRequest(APIS.switchCluster, {
            data: values,
          });
          setLogger(result.data || '');
          if (result.success) {
            message.success({
              content: '调度成功！',
              className: 'custom-class',
              style: {
                marginTop: '20vh',
              },
            });
          } else {
            message.error({
              content: '调度失败！',
              className: 'custom-class',
              style: {
                marginTop: '20vh',
              },
            });
          }
        } finally {
          setPending(false);
        }
      },
    });
  }, [editField, sourceData]);

  const handleReset = useCallback(() => {
    editField.setFieldsValue(initData || {});
  }, [editField, initData]);

  return (
    <ContentCard className="page-scheduling">
      <h3>请选择调度：</h3>
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
          <Button type="primary" loading={pending} size="large" onClick={handleSubmit}>
            开始调度
          </Button>
          <Button hidden type="default" size="large" onClick={handleReset} style={{ marginLeft: 12 }}>
            重置
          </Button>
        </div>
      </Form>
      {/* <Modal
        visible={!!logger}
        title="同步日志"
        maskClosable={false}
        footer={false}
        onCancel={() => setLogger(undefined)}
        width={800}
      >
        <pre className="pre-block">{logger}</pre>
      </Modal> */}
    </ContentCard>
  );
}
