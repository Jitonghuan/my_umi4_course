import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Table, Button, Input, Form, Space, Typography, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateOrEditRuleModal from './create-or-edit-rule-modal';
import './index.less';

export default function AppControlPointRules(props: any) {
  const [createOrEditRuleModalVisible, setCreateOrEditRuleModalVisible] = useState(false);

  const handleCreateRule = () => {
    setCreateOrEditRuleModalVisible(true);
  };

  return (
    <PageContainer className="quality-control-app-control-point-rules">
      <HeaderTabs activeKey="app-control-point-rules" history={props.history} />
      <ContentCard>
        <div className="header">
          <div className="title-and-search">
            <Typography.Text strong>已配置规则列表</Typography.Text>
            <Input.Search className="keyword-search-input" placeholder="输入服务关键字搜索" />
          </div>
          <Button type="primary" onClick={handleCreateRule}>
            <PlusOutlined />
            新增规则
          </Button>
        </div>
        <Table dataSource={[]}>
          <Table.Column title="服务" dataIndex="?" />
          <Table.Column title="创建时间" dataIndex="?" />
          <Table.Column title="更新时间" dataIndex="?" />
          <Table.Column
            title="操作"
            width="180"
            render={() => {
              return (
                <Space>
                  <Button type="link">查看</Button>
                  <Button type="link">编辑</Button>
                  <Button type="link">删除</Button>
                </Space>
              );
            }}
          />
        </Table>

        <CreateOrEditRuleModal visible={createOrEditRuleModalVisible} setVisible={setCreateOrEditRuleModalVisible} />
      </ContentCard>
    </PageContainer>
  );
}
