import React, { useState } from 'react';
import { List, Collapse, Form, Select, Input, Button, Space, Tag, Empty, Popconfirm } from 'antd';
import PageContainer from '@/components/page-container';
import { PlusOutlined, BarChartOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { envTypeData } from '../schema';
import { useEnvListOptions, useGetListMonitor, useDelMonitor } from './hooks';
import './index.less';
import { useAppOptions } from '@/pages/monitor/business/hooks';
const { Panel } = Collapse;

export default function DpMonitor() {
  const [form] = Form.useForm();
  const [appOptions] = useAppOptions(); // 应用code列表
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [listSource, total, getListMonitor] = useGetListMonitor();
  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code

  const [delMonitor] = useDelMonitor();

  const editMonitor = (item: any) => {
    history.push(
      {
        pathname: '/matrix/monitor/log-prometheus-edit',
      },
      {
        type: 'edit',
        recordData: item,
        bizMonitorType: 'log',
      },
    );
  };

  const onQuery = (page?: number, pageSize?: number) => {
    const values = form.getFieldsValue();
    getListMonitor(page, pageSize, values?.monitorName, values?.appCode, currentEnvCode);
  };

  const delMonitorClick = (id: string) => {
    delMonitor(id, () => {
      onQuery(1, 10);
    });
  };
  let listData: any = [];
  for (let i = 0; i < listSource.length; i++) {
    listData = listSource.map((item: any) => {
      return (
        <Collapse>
          <Panel
            showArrow={false}
            collapsible="disabled"
            header={
              <div>
                <div>
                  <span>
                    <Tag color="geekblue">{item.name}</Tag>
                  </span>
                  <span style={{ marginLeft: '20px', display: 'inline-block' }}>{item.envCode}</span>
                  <span style={{ marginLeft: '20px', display: 'inline-block' }}>{item.appCode}</span>
                </div>
                <Space>
                  <Button
                    type="link"
                    style={{ color: '#5468ff' }}
                    icon={<BarChartOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push({
                        pathname: 'detail',
                        search: `?graphName=${item.name}&url=${encodeURIComponent(
                          item.dashboardUrl,
                        )}&fromPage=business`,
                      });
                    }}
                  >
                    看板
                  </Button>
                  <Button
                    type="link"
                    icon={<FormOutlined />}
                    disabled={item.status === 0}
                    onClick={() => {
                      editMonitor(item);
                    }}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定要删除吗？"
                    onCancel={(e) => {
                      e && e.stopPropagation();
                    }}
                    onConfirm={(e) => {
                      e && e.stopPropagation();
                      delMonitorClick(item.id);
                    }}
                  >
                    <Button
                      danger
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            }
            key="1"
          />
        </Collapse>
      );
    });
  }

  return (
    <PageContainer className="dp-monitor-wrapper" style={{ padding: 0 }}>
      <FilterCard>
        <Form
          layout="inline"
          form={form}
          onFinish={(values: any) => {
            onQuery(1, 10);
          }}
          onReset={() => {
            form.resetFields();
            setCurrentEnvCode('');
            setCurrentEnvType('');
            onQuery(1, 10);
          }}
        >
          <Form.Item label="环境" name="envCode">
            <Select
              style={{ width: '100px' }}
              options={envTypeData}
              value={currentEnvType}
              placeholder="分类"
              onChange={(value) => {
                setCurrentEnvType(value);
                setCurrentEnvCode('');
                getEnvCodeList(value);
              }}
              allowClear
            />
            <Select
              style={{ width: '140px', marginLeft: '5px' }}
              options={envCodeOption}
              placeholder="环境名称"
              onChange={(value) => {
                setCurrentEnvCode(value);
              }}
              value={currentEnvCode}
              allowClear
            />
          </Form.Item>
          <Form.Item label="关联应用" name="appCode">
            <Select options={appOptions} style={{ width: '200px' }} showSearch allowClear />
          </Form.Item>
          <Form.Item label="监控名称" name="monitorName">
            <Input placeholder="请输入" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" ghost>
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
          <Form.Item className="btn-r">
            <Button
              type="primary"
              onClick={() => {
                history.push({
                  pathname: 'alarm-rules',
                  search: 'tab=rules',
                });
              }}
              style={{ margin: '0 10px' }}
            >
              报警规则
            </Button>
            <Button
              type="primary"
              onClick={() => {
                history.push(
                  { pathname: '/matrix/monitor/log-prometheus-edit' },
                  { type: 'add', bizMonitorType: 'log' },
                );
              }}
              icon={<PlusOutlined />}
            >
              新增
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard style={{ width: '100%' }}>
        {listData.length !== 0 ? (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page, pageSize) => {
                onQuery(page, pageSize);
              },
              total: total,
              position: 'bottom',
            }}
            dataSource={listData}
            renderItem={(item: any) => <List.Item>{item}</List.Item>}
          />
        ) : (
          <Empty />
        )}
      </ContentCard>
    </PageContainer>
  );
}
