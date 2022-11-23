import React, { useState, useEffect } from 'react';
import {
  Form, Select, Input, Button, Divider,
  message, Space, Collapse, Table, Tag, Tooltip, Popconfirm
} from 'antd';
import PageContainer from '@/components/page-container';
import {
  PlusOutlined
} from '@ant-design/icons';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import {postRequest, getRequest, delRequest} from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';
import RulesEdit from '@/pages/logger/logger-alarm/editor';

import { envTypeData } from '../../schema';
import { useEnvListOptions, useAppOptions } from '../hooks';
import { logAdd } from '../../service';
import {deleteRule, getMonitorList, switchRule} from '@/pages/logger/logger-alarm/service';
import './index.less';

const { Panel } = Collapse;

const ALERT_LEVEL: Record<number, { text: string; value: number; color: string }> = {
  2: { text: '警告', value: 2, color: 'yellow' },
  3: { text: '严重', value: 3, color: 'orange' },
  4: { text: '灾难', value: 4, color: 'red' },
};

type StatusTypeItem = {
  color: string;
  tagText: string;
  buttonText: string;
  status: number;
};

const STATUS_TYPE: Record<number, StatusTypeItem> = {
  0: { tagText: '已启用', buttonText: '禁用', color: 'green', status: 1 },
  1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
};

export default function DpMonitorEdit(props: any) {
  let location:any = useLocation();
  const query :any= parse(location.search);
  let type = location.state?.type || query?.type;
  let bizMonitorType =location.state?.bizMonitorType || query?.bizMonitorType;
  const [recordData, setRecordData] = useState<any>(location.state?.recordData || {});
  const [appOptions] = useAppOptions(); // 应用code列表
  const [envCodeOption, getEnvCodeList] = useEnvListOptions(); // 环境code列表

  const [currentEnvType, setCurrentEnvType] = useState<string>(''); // 环境大类
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code

  const [rulesData, setRulesData] = useState<any[]>([]);
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);
  const [rulesType, setRulesType] = useState('add');
  const [rulesRecord, setRulesRecord] = useState({});
  const [rulesTotal, setRulesTotal] = useState(0);

  const [logForm] = Form.useForm();

  // 环境大类更改
  const selectEnvType = (value: string) => {
    setCurrentEnvType(value);
    setCurrentEnvCode('');
    getEnvCodeList(value);
  };

  function getParam() {
    return new Promise((resolve, reject) => {
      logForm.validateFields().then((logparams) => {
        const data = {
          ...logparams,
          envCode: currentEnvCode,
        }
        resolve(data);
      }).catch(() => {
        resolve(false)
      })
    })
  }

  const onSubmit = async () => {
    const params: any = await getParam();
    const data = {
      ...params
    }
    if (type === 'add') {
      postRequest(logAdd, { data })
        .then((resp) => {
          if (resp?.success) {
            message.success('新增成功！');
            setRecordData(resp?.data);
          }
        })
    }
  };

  //编辑回显数据
  useEffect(() => {
    if (type === 'add') {
      logForm.setFieldsValue({
        labels: []
      });
      return;
    }
    logForm.setFieldsValue({
      ...recordData
    });

    if (recordData?.envCode) {
      for (const item of envTypeData) {
        if (recordData?.envCode?.indexOf(item.value) != -1) {
          setCurrentEnvType(item.value);
          void getEnvCodeList(item.value);
        }
      }
    }

    setCurrentEnvCode(recordData?.envCode);
    void getRuleList();
  }, [type]);

  // 删除告警
  async function onDelRule (record: any) {
    const res = await delRequest(`${deleteRule}/${record.id}`);
    if (res?.success) {
      message.success('删除成功');
      void getRuleList({
        pageIndex: 1,
        pageSize: 20
      })
    }
  }

  // 启用， 禁用告警
  async function onEnableRule (data: any) {
    const res = await postRequest(switchRule, {
      data
    })
    if (res?.success) {
      message.success('操作成功');
      void getRuleList({
        pageIndex: 1,
        pageSize: 20
      })
    }
  }

  // 告警列表
  async function getRuleList (page?: any) {
    const res = await getRequest(getMonitorList, {
      data: {
        bizMonitorId: recordData?.id,
        bizMonitorType,
        pageIndex: page?.pageIndex || 1,
        pageSize: page?.pageSize || 20
      }
    })
    const { dataSource, pageInfo } = res?.data || {};
    setRulesData(dataSource || []);
    setRulesTotal(pageInfo?.total || 0);
  }


  return (
    <PageContainer className="monitor-log">
      <ContentCard>
        <div className="monitor-log-wrapper">
          <div className="monitor-log-btn-wrapper">
            <Button type="primary" onClick={onSubmit}>
              保存监控配置
            </Button>
            <Button
              style={{ marginLeft: '15px' }}
              onClick={() => {
                history.back();
              }}
            >
              取消
            </Button>
          </div>
          <Divider />
          <div className="monitor-log-content">
            <Collapse ghost defaultActiveKey={["1"]}>
              <Panel
                key="1"
                header={
                  <div className="target-item">
                    <span>日志表盘配置</span>
                  </div>
                }
              >
                <div className="log-config">
                  <div className="log-config-left">
                    <Form labelCol={{ flex: '110px' }} layout="inline" form={logForm}>
                      <Form.Item
                        label="监控名称"
                        name="name"
                        rules={[{ required: true, message: '请输入监控名称!' }]}
                      >
                        <Input disabled={type === 'edit'} />
                      </Form.Item>
                      <Form.Item label="选择环境" name="envCode" required={true}>
                        <Select
                          style={{ width: '140px' }}
                          options={envTypeData}
                          value={currentEnvType}
                          disabled={type === 'edit'}
                          onChange={selectEnvType}
                          allowClear
                        />
                        <Select
                          style={{ width: '218px' }}
                          options={envCodeOption}
                          disabled={type === 'edit'}
                          onChange={(value => {
                            setCurrentEnvCode(value);
                          })}
                          value={currentEnvCode}
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item label="应用" name="appCode">
                        <Select
                          options={appOptions}
                          disabled={type === 'edit'}
                          showSearch
                          allowClear
                        />
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Panel>
            </Collapse>

            <Divider />
            <Collapse ghost defaultActiveKey={["1"]}>
              <Panel
                key="1"
                header={
                  <div className="target-item">
                    <span>报警配置</span>
                    <Button
                      type="primary"
                      ghost
                      disabled={!recordData?.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRulesType('add');
                        setRulesVisible(true);
                      }}
                      icon={<PlusOutlined />}
                    >
                      新增报警
                    </Button>
                  </div>
                }
              >
                <Table
                  columns={[
                    {
                      title: '报警名称',
                      dataIndex: 'name',
                      key: 'name',
                      width: 140,
                    },
                    {
                      title: '告警表达式',
                      dataIndex: 'expression',
                      key: 'expression',
                      width: 220,
                      render: (text: string) => (
                        <Tooltip title={text}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 220,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {text}
                          </span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: '告警消息',
                      dataIndex: 'message',
                      key: 'message',
                      width: 200,
                    },
                    {
                      title: '报警级别',
                      dataIndex: 'level',
                      key: 'level',
                      render: (text: number) => <Tag color={ALERT_LEVEL[text]?.color}>{ALERT_LEVEL[text]?.text}</Tag>,
                      width: 120,
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      key: 'status',
                      width: 100,
                      render: (text: number) => <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].tagText}</Tag>,
                    },
                    {
                      title: '操作',
                      dataIndex: 'option',
                      key: 'news',
                      width: 150,
                      render: (_: string, record) => (
                        <Space>
                          <a
                            onClick={() => {
                              setRulesType('edit');
                              setRulesRecord(record);
                              setRulesVisible(true);
                            }}
                          >
                            编辑
                          </a>
                          <Popconfirm
                            title="确认删除？"
                            onConfirm={() => {
                              onDelRule(record)
                            }}
                            okText="是"
                            cancelText="否"
                          >
                            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
                          </Popconfirm>
                          <Popconfirm
                            title={`确认${STATUS_TYPE[record.status as number].buttonText}`}
                            onConfirm={() => {
                              onEnableRule({
                                id: record.id,
                                status: STATUS_TYPE[record.status as number].status,
                                bizMonitorId: recordData?.id,
                                bizMonitorType,
                              });
                            }}
                            okText="是"
                            cancelText="否"
                          >
                            <a>{STATUS_TYPE[record.status as number].buttonText}</a>
                          </Popconfirm>
                        </Space>
                      ),
                    }
                  ]}
                  pagination={{
                    total: rulesTotal,
                    pageSize: 20,
                    current: 1,
                    onChange: (page, pageSize) => {
                      void getRuleList({
                        pageIndex: page,
                        pageSize
                      })
                    }
                  }}
                  rowKey="id"
                  scroll={{ x: '100%' }}
                  dataSource={rulesData}
                  rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
                />
              </Panel>
            </Collapse>
          </div>
        </div>
        <RulesEdit
          initData={{
            envCode: currentEnvCode,
            ...rulesRecord
          }}
          bizMonitorId={recordData?.id}
          mode={rulesVisible ? (recordData?.id ? 'ADD' : 'EDIT') : 'HIDE'}
          bizMonitorType={bizMonitorType}
          onClose={() => setRulesVisible(false)}
          onSave={() => {
            setRulesVisible(false);
            void getRuleList({
              pageIndex: 1,
              pageSize: 20
            })
          }}
        />
      </ContentCard>
    </PageContainer>
  );
}
