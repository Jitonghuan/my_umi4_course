//制品管理-配置交付参数
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { Form, Tabs, Input, Select, Button, Descriptions, Typography, Card, message, Popconfirm, Divider } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
export default function ComponentDetail() {
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const { Paragraph } = Typography;
  const [editableStr, setEditableStr] = useState('This is an editable text.');
  return (
    <PageContainer>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left"></div>
          <div className="caption-right">
            <Button
              onClick={() => {
                history.push({
                  pathname: '/matrix/delivery/product-management',
                });
              }}
            >
              返回
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
          <TabPane tab="组件信息" key="1">
            <div>
              <Descriptions title="基本信息" column={2} extra={<Button type="primary">编辑</Button>}>
                <Descriptions.Item label="制品名称">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="制品描述">
                  <Paragraph editable={{ onChange: setEditableStr }}>{editableStr}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="交付版本">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="交付项目">1810000000</Descriptions.Item>
                <Descriptions.Item label="创建时间" span={2}>
                  empty
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <div>
                <div className="instruction">组件说明:</div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="组件配置" key="2">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
              <p>
                <Button type="primary">编辑</Button>
              </p>
            </div>
            <div>
              <AceEditor mode="yaml" height={450} />
            </div>
          </TabPane>
        </Tabs>
      </ContentCard>
    </PageContainer>
  );
}
