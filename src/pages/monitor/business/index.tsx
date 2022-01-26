// business monitor index
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { List, Card, Table, Collapse, Form, Select, Input, Button, Space, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { PauseCircleFilled, ClockCircleFilled } from '@ant-design/icons';
import { history } from 'umi';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { activeKeyMap, colunms, envTypeData, STATUS_TYPE } from './schema';
import {
  useEnvListOptions,
  useAppOptions,
  useGetListMonitor,
  useEnableMonitor,
  useDisableMonitor,
  useDelMonitor,
} from './hooks';
import './index.less';
const { Panel } = Collapse;
const { Search } = Input;

export default function Dashboard(props: any) {
  const [form] = Form.useForm();
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [appOptions] = useAppOptions();
  const [listSource, tablesource, getListMonitor] = useGetListMonitor();
  const [enableMonitor] = useEnableMonitor();
  const [disableMonitor] = useDisableMonitor();
  const [delMonitor] = useDelMonitor();

  const callback = (key: any) => {
    console.log(key);
  };

  const editMonitor = () => {
    history.push('/matrix/monitor/log-monitor');
  };
  const enableMonitorClick = (monitorName: string) => {
    enableMonitor(monitorName);
  };
  const delMonitorClick = (monitorName: string) => {
    delMonitor(monitorName);
  };
  const disableMonitorClick = (monitorName: string) => {
    disableMonitor(monitorName);
  };
  let listData: any = [];
  for (let i = 0; i < listSource.length; i++) {
    listData = listSource.map((item: any) => {
      return (
        <Collapse onChange={callback}>
          <Panel
            header={
              <p>
                <span>
                  <Tag color="geekblue">{item.monitorName}</Tag>
                </span>
                <span style={{ marginLeft: '20px', display: 'inline-block' }}>
                  <i className="status" style={{ backgroundColor: STATUS_TYPE[item.status].color }}></i>
                  {STATUS_TYPE[item.status].text}
                </span>
                <Space style={{ paddingRight: '20px', float: 'right' }}>
                  <Button type="primary">看板</Button>
                  <Button type="primary" onClick={editMonitor}>
                    编辑
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      enableMonitorClick(item.monitorName);
                    }}
                  >
                    启动
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => {
                      disableMonitorClick(item.monitorName);
                    }}
                  >
                    停止
                  </Button>
                  <Button
                    danger
                    onClick={() => {
                      delMonitorClick(item.monitorName);
                    }}
                  >
                    删除
                  </Button>
                </Space>
              </p>
            }
            key="1"
          >
            <Table
              columns={colunms}
              pagination={false}
              dataSource={item?.MonitorBizMetric}
              rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
            />
          </Panel>
        </Collapse>
      );
    });
  }

  const creatLogMinitor = () => {
    history.push('/matrix/monitor/log-monitor');
  };
  const selectEnvType = (value: string) => {
    getEnvCodeList(value);
  };

  return (
    <PageContainer className="monitor-application">
      <FilterCard>
        <div className="table-caption">
          <div className="caption-left">
            <Form
              layout="inline"
              form={form}
              onFinish={(values: any) => {
                getListMonitor({
                  ...values,
                  pageIndex: 1,
                  pageSize: 20,
                });
              }}
              onReset={() => {
                form.resetFields();
                getListMonitor({
                  pageIndex: 1,
                  // pageSize: pageSize,
                });
              }}
            >
              <Form.Item label="环境大类" name="envTypeCode">
                <Select showSearch style={{ width: 150 }} options={envTypeData} onChange={selectEnvType} />
              </Form.Item>
              <Form.Item label="环境：" name="envCode">
                <Select options={envCodeOption} allowClear showSearch style={{ width: 120 }} />
              </Form.Item>
              <Form.Item label="关联应用" name="appCode">
                <Select showSearch allowClear style={{ width: 120 }} options={appOptions} />
              </Form.Item>
              <Form.Item name="monitorName" label="监控名称">
                <Input placeholder="按监控名称模糊搜索" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="metricName" label="指标名称">
                <Input placeholder="按指标名称模糊搜索" style={{ width: 200 }} />
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
          renderItem={(item: any) => (
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
