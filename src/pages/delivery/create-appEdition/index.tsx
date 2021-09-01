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
              <Form.Item label="环境名称：">
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用名称：">
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用分类：">
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用版本号：">
                <Input style={{ width: '220px' }}></Input>
              </Form.Item>
              <Form.Item label="更新日志：">
                <Input.TextArea></Input.TextArea>
              </Form.Item>
              <Form.Item>
                <Space>
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
              <Form.Item label="应用名称：">
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="镜像：">
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用分类：">
                <Select style={{ width: '220px' }}></Select>
              </Form.Item>
              <Form.Item label="应用版本号：">
                <Input style={{ width: '220px' }}></Input>
              </Form.Item>
              <Form.Item label="更新日志：">
                <Input.TextArea></Input.TextArea>
              </Form.Item>

              <Space>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                  <Button type="ghost" htmlType="reset">
                    取消
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </TabPane>
        </Tabs>
      </ContentCard>
    </PageContainer>
  );
}
