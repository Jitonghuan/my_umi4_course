import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, message, Popconfirm, Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { stringify } from 'qs';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

export default function appStore() {
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
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
                <Input style={{ width: '220px' }}></Input>
              </Form.Item>
              <Form.Item label="更新日志：" labelCol={{ span: 2 }}>
                <Input.TextArea style={{ width: '220px', height: '240px' }}></Input.TextArea>
              </Form.Item>

              <Form.Item>
                <Space size="middle" style={{ marginLeft: '220px' }}>
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
                <Input style={{ width: '220px' }}></Input>
              </Form.Item>
              <Form.Item label="更新日志：" labelCol={{ span: 2 }}>
                <Input.TextArea style={{ width: '220px', height: '240px' }}></Input.TextArea>
              </Form.Item>
              <Form.Item>
                <Space size="middle" style={{ marginLeft: '220px' }}>
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
      </ContentCard>
    </PageContainer>
  );
}