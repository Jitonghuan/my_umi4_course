import React, { useState,useEffect } from 'react';
import { List, Table, Collapse, Form, Select, Input, Button, Space, Tag, Empty } from 'antd';
import PageContainer from '@/components/page-container';
import {
  PlusOutlined,
  BarChartOutlined,
  FormOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { envTypeData } from '../schema';
import { useEnvListOptions, useGetListMonitor, useEnableMonitor, useDisableMonitor, useDelMonitor } from './hooks';
import './index.less';
import { useAppOptions } from '@/pages/monitor/business/hooks';
const { Panel } = Collapse;

export default function DpMonitor(props:any) {
  const {tab,queryMonitorName}=props
  const [form] = Form.useForm();
  // let location:any = useLocation();
  // const query :any= parse(location.search);
  const [appOptions] = useAppOptions(); // 应用code列表
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [listSource, total, getListMonitor] = useGetListMonitor(queryMonitorName,tab);
  const [enableMonitor] = useEnableMonitor();
  const [disableMonitor] = useDisableMonitor();
  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code

  const [delMonitor] = useDelMonitor();
  useEffect(()=>{
    if(queryMonitorName&&tab==="db"){
     // debugger

      form.setFieldsValue({
        monitorName:queryMonitorName
      })
      getListMonitor(1, 10,queryMonitorName);


    }
  },[tab,queryMonitorName])

  const editMonitor = (item: any) => {
    history.push(
      {
        pathname: '/matrix/monitor/dp-monitor-edit',
      },
      {
        type: 'edit',
        recordData: item,
        bizMonitorType: 'db',
      },
    );
  };
  const enableMonitorClick = (id: string) => {
    enableMonitor(id, () => {
      getListMonitor(1, 10);
    });
  };
  const delMonitorClick = (id: string) => {
    delMonitor(id, () => {
      getListMonitor(1, 10);
    });
  };
  const disableMonitorClick = (id: string) => {
    disableMonitor(id, () => {
      getListMonitor(1, 10);
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
                    type="link"
                    style={{ color: '#5468ff' }}
                    icon={<BarChartOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push({
                        pathname: 'detail',
                        search: `?graphName=${item.monitorName}&url=${encodeURIComponent(
                          item.dashboardUrl,
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
                    disabled={item.status === 0}
                    onClick={() => {
                      editMonitor(item);
                    }}
                  >
                    编辑
                  </Button>
                  {item.status === 0 ? (
                    <Button
                      type="link"
                      style={{ color: '#52c41a' }}
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        enableMonitorClick(item.id);
                      }}
                    >
                      启用
                    </Button>
                  ) : (
                    <Button
                      type="link"
                      style={{ color: '#FF7B15' }}
                      icon={<PauseCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        disableMonitorClick(item.id);
                      }}
                    >
                      停用
                    </Button>
                  )}
                  <Button
                    danger
                    type="link"
                    icon={<DeleteOutlined />}
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
                  dataIndex: 'querySql',
                },
                {
                  title: '指标描述',
                  width: 200,
                  dataIndex: 'metricDescription',
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
    <PageContainer className="dp-monitor-wrapper" style={{ padding: 0 }}>
      <FilterCard>
        <Form
          layout="inline"
          form={form}
          onFinish={(values: any) => {
            getListMonitor(1, 10, values?.monitorName, values?.metricName, values?.appCode, currentEnvCode);
          }}
          onReset={() => {
            form.resetFields();
            setCurrentEnvCode('');
            setCurrentEnvType('');
            getListMonitor(1, 10);
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
          <Form.Item label="指标名称" name="metricName">
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
                history.push({ pathname: '/matrix/monitor/dp-monitor-edit' }, { type: 'add', bizMonitorType: 'db' });
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
              onChange: (page) => {
                getListMonitor(page, 10);
              },
              total: total,
              pageSize: 10,
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
