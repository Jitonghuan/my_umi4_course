// 流量调度页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/12 16:30
import React, { useContext, useState, useEffect } from 'react';
import { Radio, Button, Card, Modal, Col, Form, Popconfirm, Space, Row } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import CardLayout from '@cffe/vc-b-card-layout';
import './index.less';
import HeaderTabs from '../components/header-tabs';

export default function Traffic(props: any) {
  const [logVisiable, setLogVisiable] = useState(false);
  const selectRecord: any[] = [];
  const [form] = Form.useForm();
  const validateMessages = {
    required: '集群是必选字段',
    // ...
  };
  const [checked, setChecked] = useState<any[]>([]);
  const [query, setQuery] = useState('redux');
  const [options, setOptions] = useState<any[]>([
    { label: 'A集群', value: 'cluster_a' },
    { label: 'B集群', value: 'cluster_b' },
  ]);

  const handleCancel = async () => {
    setLogVisiable(false);
  };
  const subFinish = (values: any) => {
    const res = postRequest(APIS.clusterSwitch, {
      data: { values },
    });
    console.log(res);
    // setLogVisiable(true);
  };

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="traffic-scheduling" history={props.history} />
      <ContentCard className="traffic">
        <div>
          <span>请选择流量调度类型：</span>
        </div>
        <div className="selection">
          <Form layout="inline" onFinish={subFinish} validateMessages={validateMessages}>
            <div className="from-warp">
              <Form.Item name="qingchun" rules={[{ required: true }]}>
                <Card>
                  <div>
                    <span>庆春院区</span>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Radio.Group options={options} optionType="default" />
                  </div>
                </Card>
              </Form.Item>
              <Form.Item name="yuhang" rules={[{ required: true }]}>
                <Card>
                  <div>
                    <span>余杭院区</span>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Radio.Group options={options} optionType="default" />
                  </div>
                </Card>
              </Form.Item>
              <Form.Item name="zhijiang" rules={[{ required: true }]}>
                <Card>
                  <div>
                    <span>之江院区</span>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Radio.Group options={options} optionType="default" />
                  </div>
                </Card>
              </Form.Item>
            </div>
            <div className="subButton">
              <Space size="large">
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button
                  type="default"
                  htmlType="reset"
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  取消
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </ContentCard>
      <Modal
        visible={logVisiable}
        title="滚动日志"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            返回
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </MatrixPageContent>
  );
}
function a(a: any) {
  throw new Error('Function not implemented.');
}
