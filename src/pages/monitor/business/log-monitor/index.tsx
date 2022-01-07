/**
 * @description: 创建/编辑日志监控
 * @name {muxi.jth}
 * @date {2022/1/6 19:00}
 */

import React from 'react';
import { List, Card, Table, Collapse, Form, Select, Input, Button, Space } from 'antd';
import PageContainer from '@/components/page-container';
import { PauseCircleFilled, ClockCircleFilled } from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';
const { Panel } = Collapse;
const { Search } = Input;
const activeKeyMap: Record<string, any> = {
  'prometheus-add': 'prometheus',
  'prometheus-edit': 'prometheus',
};

export default function LogMonitor(props: any) {
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const callback = (key: any) => {
    console.log(key);
  };

  const colunms = [
    {
      title: '指标名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '指标类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '过滤条件',
      dataIndex: 'filter',
      key: 'filter',
    },
  ];
  const listData = [];
  for (let i = 0; i < 9; i++) {
    listData.push(
      <Collapse onChange={callback}>
        <Panel
          header={
            <p>
              <span>"监控名称"</span>
              <span style={{ marginLeft: '20px', display: 'inline-block' }}>
                <PauseCircleFilled style={{ color: 'red' }} />
                停止
              </span>
              <Space style={{ paddingRight: '20px', float: 'right' }}>
                <Button type="primary">看板</Button>
                <Button type="primary">编辑</Button>
                <Button type="primary">启动</Button>
                <Button type="dashed">停止</Button>
              </Space>
            </p>
          }
          key="1"
        >
          <Table
            columns={colunms}
            pagination={false}
            rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
          />
        </Panel>
      </Collapse>,
    );
  }
  const creatLogMinitor = () => {};

  return (
    <PageContainer className="monitor-log">
      <ContentCard>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
          }}
        >
          <List.Item>
            <Panel header="日志源配置" key="1">
              <div className="log-config">
                <div className="log-config-left"></div>
                <div className="log-config-right"></div>
              </div>
            </Panel>
          </List.Item>
          <List.Item>
            <Panel header="指标配置" key="2">
              <p>{text}</p>
            </Panel>
          </List.Item>
          <List.Item>
            <Panel header="报警配置" key="3">
              <p>{text}</p>
            </Panel>
          </List.Item>
        </List>
      </ContentCard>
    </PageContainer>
  );
}
