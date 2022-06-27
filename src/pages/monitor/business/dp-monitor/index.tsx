import React from 'react';
import { List, Table, Collapse, Form, Select, Input, Button, Space, Tag, Empty } from 'antd';
import PageContainer from '@/components/page-container';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { envTypeData, } from '../schema';
import {
  useEnvListOptions,
  useGetListMonitor,
  useEnableMonitor,
  useDisableMonitor,
  useDelMonitor,
} from './hooks';
import './index.less';
const { Panel } = Collapse;

export default function DpMonitor() {
  const [form] = Form.useForm();
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [listSource, total, getListMonitor] = useGetListMonitor();
  const [enableMonitor] = useEnableMonitor();
  const [disableMonitor] = useDisableMonitor();

  const [delMonitor] = useDelMonitor();

  const editMonitor = (item: any) => {
    history.push({
      pathname: '/matrix/monitor/dp-monitor-edit',
      state: {
        type: 'edit',
        recordData: item,
      },
    });
  };
  const enableMonitorClick = (id: string) => {
    enableMonitor(id, () => {
      getListMonitor(1, 5);
    });
  };
  const delMonitorClick = (id: string) => {
    delMonitor(id, () => {
      getListMonitor(1, 5);
    });
  };
  const disableMonitorClick = (id: string) => {
    disableMonitor(id, () => {
      getListMonitor(1, 5);
    });
  };

  let listData: any = [];
  for (let i = 0; i < listSource.length; i++) {
    listData = listSource.map((item: any) => {
      return (
        <Collapse>
          <Panel
            header={
              <div>
                <div>
                  <span>
                    <Tag color="geekblue">{item.monitorName}</Tag>
                  </span>
                  <span style={{ marginLeft: '20px', display: 'inline-block' }}>{item.envCode}</span>
                  <span style={{ marginLeft: '20px', display: 'inline-block' }}>{item.appCode}</span>
                </div>
                <Space>
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.dashboardUrl, '_blank')
                    }}
                  >
                    看板
                  </Button>
                  <Button
                    type="primary"
                    disabled={item.status === 0}
                    onClick={() => {
                      editMonitor(item);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    type="primary"
                    disabled={item.status === 0 ? false : true}
                    onClick={(e) => {
                      e.stopPropagation();
                      enableMonitorClick(item.id);
                    }}
                  >
                    启动
                  </Button>
                  <Button
                    type="dashed"
                    disabled={item.status === 0 ? true : false}
                    onClick={(e) => {
                      e.stopPropagation();
                      disableMonitorClick(item.id);
                    }}
                  >
                    停止
                  </Button>
                  <Button
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      delMonitorClick(item.id);
                    }}
                  >
                    删除
                  </Button>
                </Space>
              </div>
            }
            key="1"
          >
            <Table
              columns={[
                {
                  title: '指标名',
                  dataIndex: 'metricName',
                  width: 150,
                },
                {
                  title: 'sql',
                  dataIndex: 'querySql'
                },
              ]}
              pagination={false}
              scroll={{ y: window.innerHeight - 1010, x: '100%' }}
              dataSource={item?.metricsQuery}
              rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
            />
          </Panel>
        </Collapse>
      );
    });
  }

  return (
    <PageContainer className="dp-monitor-wrapper">
      <FilterCard>
        <Form
          layout="inline"
          form={form}
          onFinish={(values: any) => {
            getListMonitor(1, 5, values?.monitorName, values?.metricName, values?.appCode, values?.envCode);
          }}
          onReset={() => {
            form.resetFields();
            getListMonitor(
              1,
              5,
            );
          }}
        >
          <Form.Item label="环境分类" name="envTypeCode">
            <Select showSearch style={{ width: 110 }} options={envTypeData} onChange={getEnvCodeList} />
          </Form.Item>
          <Form.Item label="环境：" name="envCode">
            <Select options={envCodeOption} allowClear showSearch style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="应用Code" name="appCode">
            <Input placeholder="请输入" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="监控名称" name="monitorName">
            <Input placeholder="请输入" style={{ width: 140 }} />
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
          <Form.Item className="btn-r">
            <Button type="primary" onClick={() => {
              history.push({ pathname: '/matrix/monitor/dp-monitor-edit', state: { type: 'add' } });
            }} icon={<PlusOutlined />}>
              新增
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        {listData.length !== 0 ? (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                getListMonitor(page, 5);
              },
              total: total,
              pageSize: 5,
            }}
            dataSource={listData}
            renderItem={(item: any) => (
              <List.Item
              >
                {item}
              </List.Item>
            )}
          />
        ) : (
          <Empty />
        )}
      </ContentCard>
    </PageContainer>
  );
}
