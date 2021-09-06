import React, { useState, useEffect } from 'react';
import { Form, Tabs, Input, Select, Button, Table, Space, message, Popconfirm } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { stringify } from 'qs';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

export default function appDetails() {
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const appInfoColumns = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: '',
    },
    {
      title: '更新日志',
      dataIndex: 'updateLog',
      key: '',
    },
  ];
  const appInfo = [
    {
      key: '1',
      version: '0000',
      updateLog: '胡彦斌',
    },
    {
      key: '2',
      version: '9998',
      updateLog: 'lili',
    },
  ];
  return (
    <PageContainer>
      <ContentCard>
        <Tabs defaultActiveKey="1" onChange={tabOnclick}>
          <TabPane tab="应用信息" key="1">
            <div>
              <div style={{ marginLeft: '14px' }}>
                <div>介绍</div>
                <div style={{ marginTop: '2%' }}>nacos是注册中心和配置中心</div>
              </div>

              <div style={{ marginTop: '2%' }}>
                <span>更新历史</span>
                <Table columns={appInfoColumns} dataSource={appInfo} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="YAML" key="2">
            <div>
              <div style={{ marginLeft: '14px' }}>
                <div>介绍</div>
                <div style={{ marginTop: '2%' }}>nacos是注册中心和配置中心</div>
              </div>

              <div style={{ marginTop: '2%' }}>
                <span>更新历史</span>
                <Table columns={appInfoColumns} dataSource={appInfo} />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </ContentCard>
    </PageContainer>
  );
}
