// business monitor index
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { List, Card, Table, Collapse, Form, Select, Input, Button, Space } from 'antd';
import PageContainer from '@/components/page-container';
import { PauseCircleFilled, ClockCircleFilled } from '@ant-design/icons';
import { history } from 'umi';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';
const { Panel } = Collapse;
const { Search } = Input;
const activeKeyMap: Record<string, any> = {
  'prometheus-add': 'prometheus',
  'prometheus-edit': 'prometheus',
};

export default function Dashboard(props: any) {
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
        {/* <Panel header="监控名称" key="2">
      <p>{text}</p>
    </Panel>
    <Panel header="监控名称" key="3">
      <p>{text}</p>
    </Panel> */}
      </Collapse>,
    );
  }
  const creatLogMinitor = () => {
    history.push('/matrix/monitor/business/log-monitor');
  };

  return (
    <PageContainer className="monitor-application">
      <FilterCard>
        <div className="table-caption">
          <div className="caption-left">
            <Form
              layout="inline"
              // form={formTmpl}
              // onFinish={(values: any) => {
              //   queryList({
              //     ...values,
              //     pageIndex: 1,
              //     pageSize: 20,
              //   });
              // }}
              onReset={() => {
                // formTmpl.resetFields();
                // queryList({
                //   pageIndex: 1,
                //   // pageSize: pageSize,
                // });
              }}
            >
              <Form.Item label="环境大类" name="envTypeCode">
                <Select
                  showSearch
                  style={{ width: 150 }}
                  // options={envTypeData}
                />
              </Form.Item>
              <Form.Item label="环境：" name="envCode">
                <Select
                  // options={envDatas}
                  allowClear
                  // onChange={(n) => {
                  //   setenvCode(n);
                  // }}
                  showSearch
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="关联应用" name="templateType">
                <Select
                  showSearch
                  allowClear
                  style={{ width: 120 }}
                  // options={templateTypes}
                  // onChange={(n) => {
                  //   setTemplateType(n);
                  // }}
                />
              </Form.Item>
              <Form.Item name="appCategoryCode">
                <Search placeholder="按监控名称或指标名称模糊搜索" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="ghost" htmlType="reset">
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="caption-right">
            <span>
              <Button type="primary" onClick={creatLogMinitor}>
                创建日志监控
              </Button>
            </span>
          </div>
        </div>
      </FilterCard>
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
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
            // key={item.title}
            >
              {item}
            </List.Item>
          )}
        />
        ,
      </ContentCard>
    </PageContainer>
  );
}
