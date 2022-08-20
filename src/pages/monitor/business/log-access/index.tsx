// business monitor index
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState } from 'react';
import { List, Table, Collapse, Form, Select, Input, Button, Space, Tag, Empty } from 'antd';
import PageContainer from '@/components/page-container';
import {
  BarChartOutlined,
  DeleteOutlined,
  FormOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { colunms, envTypeData, STATUS_TYPE } from '../schema';
import {
  useEnvListOptions,
  useAppOptions,
  useGetListMonitor,
  useEnableMonitor,
  useDisableMonitor,
  useDelMonitor,
} from '../hooks';
import './index.less';
const { Panel } = Collapse;

export default function LogAccess() {
  const [form] = Form.useForm();
  const [currentEnvType, setCurrentEnvType] = useState<string>(''); // 环境大类
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [appOptions] = useAppOptions();
  const [listSource, total, getListMonitor] = useGetListMonitor();
  const [enableMonitor] = useEnableMonitor();
  const [disableMonitor] = useDisableMonitor();

  const [delMonitor] = useDelMonitor();

  const callback = (key: any) => {
    console.log(key);
  };

  const editMonitor = (item: any) => {
    history.push({
      pathname: '/matrix/monitor/log-monitor',
      state: {
        type: 'edit',
        recordData: item,
      },
    });
  };
  const enableMonitorClick = (monitorName: string) => {
    enableMonitor(monitorName);
    setTimeout(() => {
      getListMonitor(1, 5);
    }, 300);
  };
  const delMonitorClick = (monitorName: string) => {
    delMonitor(monitorName);
    setTimeout(() => {
      getListMonitor(1, 5);
    }, 300);
  };
  const disableMonitorClick = (monitorName: string) => {
    disableMonitor(monitorName);
    setTimeout(() => {
      getListMonitor(1, 5);
    }, 300);
  };
  // //触发分页
  // const pageSizeClick = (pagination: any) => {
  //   //  setPageIndexInfo(pagination.current);
  //   setPageCurrentIndex(pagination.current);
  //   let obj = {
  //     pageIndex: pagination.current,
  //     pageSize: pagination.pageSize,
  //   };
  //   getListMonitor(obj)
  // };
  let listData: any = [];
  for (let i = 0; i < listSource.length; i++) {
    listData = listSource.map((item: any) => {
      return (
        <Collapse onChange={callback}>
          <Panel
            header={
              <div>
                <div>
                  <span>
                    <Tag color="geekblue">{item.monitorName}</Tag>
                  </span>
                  <span style={{ marginLeft: '20px', display: 'inline-flex', alignItems: 'center' }}>
                    <i
                      className="status"
                      style={{ backgroundColor: STATUS_TYPE[item.status].color, marginRight: '5px' }}
                    />
                    {STATUS_TYPE[item.status].text}
                  </span>
                </div>
                <Space>
                  <Button type="link" icon={<BarChartOutlined />} style={{ color: '#5468ff' }}>
                    看板
                  </Button>
                  <Button
                    type="link"
                    icon={<FormOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
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
                        enableMonitorClick(item.monitorName);
                      }}
                    >
                      启动
                    </Button>
                  ) : (
                    <Button
                      type="link"
                      style={{ color: '#FF7B15' }}
                      icon={<PauseCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        disableMonitorClick(item.monitorName);
                      }}
                    >
                      停止
                    </Button>
                  )}
                  <Button
                    danger
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      delMonitorClick(item.monitorName);
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
              columns={colunms}
              pagination={false}
              // onChange={pageSizeClick}
              scroll={{ y: window.innerHeight - 1010, x: '100%' }}
              dataSource={item?.MonitorBizMetric}
              rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
            />
          </Panel>
        </Collapse>
      );
    });
  }

  const creatLogMinitor = () => {
    history.push({ pathname: '/matrix/monitor/log-monitor', state: { type: 'add' } });
  };
  const selectEnvType = (value: string) => {
    setCurrentEnvType(value);
    getEnvCodeList(value);
  };

  return (
    <PageContainer className="monitor-business">
      <FilterCard>
        <Form
          layout="inline"
          form={form}
          onFinish={(values: any) => {
            getListMonitor(1, 5, values?.monitorName, values?.metricName, values?.appCode, currentEnvCode);
          }}
          onReset={() => {
            setCurrentEnvCode('');
            setCurrentEnvType('');
            form.resetFields();
            getListMonitor(
              1,
              5,
              // pageSize: pageSize,
            );
          }}
        >
          <Form.Item label="环境" name="envCode">
            <Select
              style={{ width: '100px' }}
              options={envTypeData}
              value={currentEnvType}
              onChange={selectEnvType}
              allowClear
            />
            <Select
              style={{ width: '140px', marginLeft: '5px' }}
              options={envCodeOption}
              onChange={(value) => {
                setCurrentEnvCode(value);
              }}
              value={currentEnvCode}
              allowClear
            />
          </Form.Item>
          <Form.Item label="关联应用" name="appCode">
            <Select showSearch allowClear style={{ width: 140 }} options={appOptions} />
          </Form.Item>
          <Form.Item name="monitorName" label="监控名称">
            <Input placeholder="按监控名称模糊搜索" style={{ width: 209 }} />
          </Form.Item>
          <Form.Item name="metricName" label="指标名称">
            <Input placeholder="按指标名称模糊搜索" style={{ width: 220 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" ghost>
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset" >
              重置
            </Button>
          </Form.Item>
          <Form.Item className="btn-r">
            <Button type="primary" onClick={creatLogMinitor} icon={<PlusOutlined />}>
              创建业务监控
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
                console.log(page);
                getListMonitor(page, 5);
              },
              total: total,
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
        ) : (
          <Empty />
        )}
      </ContentCard>
    </PageContainer>
  );
}
