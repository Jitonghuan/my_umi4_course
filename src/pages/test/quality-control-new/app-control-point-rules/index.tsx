import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Table, Button, Input, Form, Space, Typography, Modal, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateOrEditRuleModal from './create-or-edit-rule-modal';
import * as HOOKS from '../hooks';
import * as INTERFACES from '../interface';
import moment from 'moment';
import './index.less';
import { delRequest } from '@/utils/request';
import * as APIS from '../service';

type ModalType = 'add' | 'edit' | 'view';

export default function AppControlPointRules(props: any) {
  const [createOrEditRuleModalVisible, setCreateOrEditRuleModalVisible] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [allAppCodeQualityConf] = HOOKS.useAllAppCodeQualityConf(keyword);
  const [ruleModalType, setRuleModalType] = useState<ModalType>('add');

  const handleCreateRule = () => {
    setCreateOrEditRuleModalVisible(true);
  };

  const deleteQualityConf = (id: number) => {
    delRequest(APIS.deleteCodeQualityConf, { data: { id: id } });
  };

  return (
    <PageContainer className="quality-control-app-control-point-rules">
      <HeaderTabs activeKey="app-control-point-rules" history={props.history} />
      <ContentCard>
        <div className="header">
          <div className="title-and-search">
            <Typography.Text strong>已配置规则列表</Typography.Text>
            <Input.Search className="keyword-search-input" placeholder="输入服务关键字搜索" onSearch={setKeyword} />
          </div>
          <Button type="primary" onClick={handleCreateRule}>
            <PlusOutlined />
            新增规则
          </Button>
        </div>
        <Table dataSource={allAppCodeQualityConf}>
          <Table.Column
            title="服务"
            render={(record: INTERFACES.IConfig) => `${record.categoryCode}/${record.appCode}`}
          />
          <Table.Column
            title="创建时间"
            dataIndex="gmtCreate"
            render={(time) => moment(time).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Table.Column
            title="更新时间"
            dataIndex="gmtModify"
            render={(time) => moment(time).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Table.Column
            title="操作"
            width="180"
            render={(value, record: any) => {
              return (
                <Space>
                  <Button type="link">查看</Button>
                  <Button type="link">编辑</Button>
                  <Popconfirm
                    title="确定删除这条规则吗?"
                    onConfirm={() => {
                      deleteQualityConf(record.id);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="link">删除</Button>
                  </Popconfirm>
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
