import React, { useState, useEffect } from 'react';
import { Table, Form, Select, Input, Button, Space, Empty, Popconfirm } from 'antd';
import PageContainer from '@/components/page-container';
import { PlusOutlined, FormOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { parse } from 'query-string';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { envTypeData } from '../schema';
import { useEnvListOptions, useGetListMonitor, useDelMonitor } from './hooks';
import './index.less';
import { useAppOptions } from '@/pages/monitor/business/hooks';

export default function DpMonitor(props: any) {
  const [form] = Form.useForm();
  const { tab, queryMonitorName } = props;
  // let location:any = useLocation();
  // const query :any= parse(location.search);
  const [appOptions] = useAppOptions(); // 应用code列表
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [listSource, total, getListMonitor] = useGetListMonitor(queryMonitorName, tab);
  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code

  const [delMonitor] = useDelMonitor();
  useEffect(() => {
    if (queryMonitorName && tab === 'interface') {
      form.setFieldsValue({
        name: queryMonitorName,
      });
      getListMonitor(1, 10, queryMonitorName);
    }
  }, [tab, queryMonitorName]);
  const editMonitor = (item: any) => {
    history.push(
      {
        pathname: '/matrix/monitor/prometheus-edit',
        search: `name=${item.name}`,
        // query: {
        //   name: item.name
        // },
      },
      {
        type: 'edit',
        recordData: item,
        bizMonitorType: 'interface',
      },
    );
  };

  const onQuery = (page?: number, pageSize?: number) => {
    const values = form.getFieldsValue();
    getListMonitor(page, pageSize, values?.name, values?.metricName, values?.appCode, currentEnvCode);
  };

  const delMonitorClick = (id: string) => {
    delMonitor(id, () => {
      onQuery(1, 10);
    });
  };

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
          <Form.Item label="监控名称" name="name">
            <Input placeholder="请输入" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="URL" name="metricsUrl">
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
                  { pathname: '/matrix/monitor/prometheus-edit' },
                  { type: 'add', bizMonitorType: 'interface' },
                );
              }}
              icon={<PlusOutlined />}
            >
              新增
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        {listSource.length !== 0 ? (
          <Table
            pagination={{
              onChange: (page, pageSize) => {
                onQuery(page, pageSize);
              },
              total: total,
            }}
            dataSource={listSource}
            bordered
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                width: 70,
              },
              {
                title: '监控名称',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '关联环境',
                dataIndex: 'envCode',
                key: 'envCode',
              },
              {
                title: '关联应用',
                dataIndex: 'appCode',
                key: 'appCode',
              },
              {
                title: 'URL',
                dataIndex: 'metricsUrl',
                key: 'metricsUrl',
              },
              {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                align: 'center',
                width: 80,
                render: (_: string, record: any) => (
                  <Space>
                    <Button
                      type="link"
                      style={{ color: '#5468ff' }}
                      icon={<BarChartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push({
                          pathname: 'detail',
                          search: `?graphName=${record.name}&url=${encodeURIComponent(
                            record.dashboardUrl,
                          )}&fromPage=business`,
                        });
                        // window.open(item.dashboardUrl, '_blank');
                      }}
                    >
                      看板
                    </Button>
                    <Button
                      type="link"
                      icon={<FormOutlined />}
                      onClick={() => {
                        editMonitor(record);
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
                        delMonitorClick(record.id);
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
                ),
              },
            ]}
          />
        ) : (
          <Empty />
        )}
      </ContentCard>
    </PageContainer>
  );
}
