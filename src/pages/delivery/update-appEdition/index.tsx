import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, Table, Space, message, Popconfirm, Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { stringify } from 'qs';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

export default function updateAppEditon() {
  const [isModalVisible, setIsModalVisible] = useState(false); //是否显示弹窗
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = async () => {
    setIsModalVisible(false);
  };
  return (
    <PageContainer>
      <ContentCard>
        <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
          <TabPane tab="按环境" key="1">
            <Form>
              <Form.Item label="环境名称：" labelCol={{ span: 2 }}>
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用名称：" labelCol={{ span: 2 }}>
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用分类：" labelCol={{ span: 2 }}>
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用版本号：" labelCol={{ span: 2 }}>
                <Input style={{ width: '210px' }}></Input>
              </Form.Item>
              <Form.Item label="更新日志：" labelCol={{ span: 2 }}>
                <Input.TextArea style={{ width: '220px', height: '240px' }}></Input.TextArea>
              </Form.Item>
              <Form.Item>
                <Space style={{ marginLeft: '220px' }}>
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                  <Button type="ghost" htmlType="reset">
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="按仓库" key="2">
            <Form>
              <Form.Item label="应用名称：" labelCol={{ span: 2 }}>
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="镜像：" labelCol={{ span: 2 }}>
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用分类：" labelCol={{ span: 2 }}>
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用版本号：" labelCol={{ span: 2 }}>
                <Input style={{ width: '210px' }}></Input>
              </Form.Item>
              <Form.Item label="更新日志：" labelCol={{ span: 2 }}>
                <Input.TextArea style={{ width: '220px', height: '240px' }}></Input.TextArea>
              </Form.Item>
              <Form.Item>
                <Space style={{ marginLeft: '220px' }}>
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                  <Button type="ghost" htmlType="reset">
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Modal
          title="你确定要上架以下应用吗？ "
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width="60%"
        >
          <div>
            <Table>
              <Table.Column title="应用名称" dataIndex="appCode" />
              <Table.Column title="应用版本" dataIndex="appVersion" />
              <Table.Column title="更新日志" dataIndex="relase" />
            </Table>
          </div>
          <div style={{ marginTop: '4%', marginBottom: '10%' }}>
            <span>请输入生产的交付版本号:</span>
            <div>
              {' '}
              <Input style={{ width: 220 }} placeholder="不可修改"></Input>
            </div>
          </div>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
