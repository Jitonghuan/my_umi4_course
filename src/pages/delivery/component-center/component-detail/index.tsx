//组件详情
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { Form, Tabs, Input, Select, Button, Descriptions, Typography, Card, message, Popconfirm, Divider } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useQueryComponentList, useQueryComponentInfo } from './hooks';
import './index.less';
export default function ComponentDetail() {
  const { initRecord, componentName, componentId, componentDescription }: any = history.location.state;
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const { Paragraph } = Typography;
  const [editableStr, setEditableStr] = useState(initRecord.componentDescription);
  const [loading, versionOptions, queryComponentVersionList] = useQueryComponentList();
  const [infoLoading, componentInfo, queryComponentInfo] = useQueryComponentInfo();
  useEffect(() => {
    queryComponentVersionList(componentName);
    queryComponentInfo(componentId);
  }, [componentName]);
  return (
    <PageContainer>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>组件名称：{initRecord.componentName}</h3>
            <Select style={{ width: 220, paddingLeft: 20 }} options={versionOptions}></Select>
          </div>
          <div className="caption-right">
            <Button
              onClick={() => {
                history.push({
                  pathname: '/matrix/delivery/component-center',
                });
              }}
            >
              返回
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
          <TabPane tab="组件信息" key="component-info">
            <div>
              <Descriptions title="基本信息" column={2}>
                <Descriptions.Item label="组件名称">{initRecord.componentName}</Descriptions.Item>
                <Descriptions.Item label="组件描述">
                  <Paragraph editable={{ onChange: setEditableStr }}>{editableStr}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="组件类型">{initRecord.componentType}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{initRecord.gmtCreate}</Descriptions.Item>
                <Descriptions.Item label="组件地址" span={2}>
                  {initRecord.componentUrl}
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <div>
                <div className="instruction">组件说明:{initRecord.componentExplanation}</div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="组件配置" key="component-config">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
              <p>
                <Button type="primary">编辑</Button>
              </p>
            </div>
            <div>
              <AceEditor mode="yaml" height={450} defaultValue={initRecord.componentConfiguration} />
            </div>
          </TabPane>
        </Tabs>
      </ContentCard>
    </PageContainer>
  );
}