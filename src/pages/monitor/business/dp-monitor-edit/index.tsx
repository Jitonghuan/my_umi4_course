import React, { useState, useEffect } from 'react';
import {
  Form, Select, Input, Button, InputNumber, Spin, Divider,
  message, Space, Modal, Collapse, Row, Table, Tag, Tooltip, Popconfirm
} from 'antd';
import PageContainer from '@/components/page-container';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  EyeFilled
} from '@ant-design/icons';
import {postRequest, getRequest, delRequest} from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';
import RulesEdit from '../rules-edit';

import { envTypeData } from '../schema';
import { useEnvListOptions, useAppOptions } from '../hooks';
import {
  useQueryLogSample
} from './hooks';
import {addDbMonitor, deleteRules, rulesList, ruleSwitch, updateDbMonitor, getDbType} from '../service';
import './index.less';
import * as APIS from "@/pages/monitor/business/service";
import {Item} from "@/pages/monitor/basic/typing";

const { TextArea } = Input;
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
  const [dbTypeOptions, setDbTypeOptions] = useState<any>([]); // 数据库类型列表
  const [dbAddressOptions, setDbAddressOptions] = useState<IOption[]>([]); // 数据库地址列表

  const [currentEnvType, setCurrentEnvType] = useState<string>(''); // 环境大类
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code
  const [dbType, setDbType] = useState(''); // 数据库类型
  const [dbAddr, setDbAddr] = useState(''); // 数据库地址
  const [unit, setUnit] = useState('h'); // 单位

  const [visible, setVisible] = useState(false);
  const [logSample, loading, getLogSample] = useQueryLogSample();

  const [rulesData, setRulesData] = useState<any[]>([]);
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);
  const [rulesType, setRulesType] = useState('add');
  const [rulesRecord, setRulesRecord] = useState({});
  const [rulesTotal, setRulesTotal] = useState(0);
  const [sqlRes, setSqlRes] = useState<any>({});

  const [tagrgetForm] = Form.useForm();
  const [logForm] = Form.useForm();

  // 获取数据库类型
  async function getDbTypeData() {
    const res = await getRequest(getDbType, {});
    const next = (res?.data || []).map((item: any) => ({
      label: item,
      value: item,
    }));
    setDbTypeOptions(next);
    const dbType = next.length ? next[0].value : '';
    setDbType(dbType);
    logForm.setFieldsValue({
      dbType
    });
  }

  // 获取数据库地址
  function getDbAddress() {
    if (!currentEnvCode || !dbType) {
      return;
    }
    getRequest(APIS.getDbAddr, {
      params: {
        envCode: currentEnvCode,
        dbType,
      }
    }).then((result) => {
      const next = (result?.data || []).map((item: any) => ({
        label: item,
        value: item,
      }));

      setDbAddressOptions(next);
      if (type === 'add') {
        const dbAddr = next.length ? next[0].value : '';
        setDbAddr(dbAddr);
        logForm.setFieldsValue({
          dbAddr
        });
      }
    });
  }

  useEffect(() => {
    getDbAddress();
  }, [currentEnvCode, dbType])

  // 环境大类更改
  const selectEnvType = (value: string) => {
    setCurrentEnvType(value);
    setCurrentEnvCode('');
    resetDbAddr();
    getEnvCodeList(value);
  };

  // 清空数据库地址
  function resetDbAddr () {
    setDbAddr('');
    logForm.setFieldsValue({
      dbAddr: ''
    });
  }

  function getParam() {
    return new Promise((resolve, reject) => {
      logForm.validateFields().then((logparams) => {
        tagrgetForm.validateFields().then((targetParams) => {
          const data = {
            ...logparams,
            collectIntervalNum: logparams.collectIntervalNum.toString(),
            collectIntervalUnit: unit,
            dbType,
            dbAddr,
            envCode: currentEnvCode,
            metricsQuery: targetParams.metricsQuery
          }
          resolve(data);
        }).catch(() => {
          resolve(false)
        })
      }).catch(() => {
        resolve(false)
      })
    })
  }

  function resetValidate(name: number) {
   // debugger
    let metricsQuery = tagrgetForm.getFieldValue('metricsQuery');
    Object.assign(metricsQuery[name], {
      valueColumn: '',
      labelColumn: []
    })
    const obj = JSON.parse(JSON.stringify(sqlRes));
    obj[name] = {
      labels: [],
      values: []
    }
    setSqlRes(obj);
    tagrgetForm.setFieldsValue({
      metricsQuery
    })
  }

  // sql 测试
  async function onSqlTest(key: number) {
    let list = tagrgetForm.getFieldsValue()?.metricsQuery || [];
    const param = list[key] || {}
    const res = await postRequest(APIS.postSqlTest, {
      data: {
        envCode: currentEnvCode,
        dbType,
        dbAddr,
        ...param
      }
    })
    let obj = JSON.parse(JSON.stringify(sqlRes));
    obj[key] = {
      labels: res?.data?.labels || [],
      values: res?.data?.values || []
    }
   
    setSqlRes(obj);
    if (res?.success) {
      message.success('解析成功')
    }
  }

  const onPreview = async () => {
    const data: any = await getParam();
    if (data) {
      getLogSample(data);
      setVisible(true);
    }
  };

  const onSubmit = async () => {
    const data: any = await getParam();
    if (data) {
      if (type === 'edit') {
        postRequest(updateDbMonitor, {
          data: { ...data, id: recordData.id },
        })
          .then((resp) => {
            if (resp?.success) {
              message.success('编辑成功！');
            }
          })
      } else {
        postRequest(addDbMonitor, { data })
          .then((resp) => {
            if (resp?.success) {
              message.success('新增成功！');
              setRecordData(resp?.data);
            }
          })
      }
    } else {
      message.warning('请填写完整')
    }
  };

  //编辑回显数据
  useEffect(() => {
    if (type === 'add') {
      void getDbTypeData();
      tagrgetForm.setFieldsValue({
        metricsQuery: [{}],
      });
      return;
    }
    logForm.setFieldsValue({
      ...recordData
    });

    if(recordData?.collectIntervalUnit) {
      setUnit(recordData.collectIntervalUnit);
    }

    if (recordData?.envCode) {
      for (const item of envTypeData) {
        if (recordData?.envCode?.indexOf(item.value) != -1) {
          setCurrentEnvType(item.value);
          void getEnvCodeList(item.value);
        }
      }
    }

    let metricsQuery =  recordData?.metricsQuery || [];
    setDbAddr(recordData?.dbAddr);
    setDbType(recordData?.dbType);
    setCurrentEnvCode(recordData?.envCode);
    tagrgetForm.setFieldsValue({
      metricsQuery,
    });
    void getRuleList();
  }, [type]);

  // 删除告警
  async function onDelRule (record: any) {
    const res = await delRequest(`${deleteRules}/${record.id}`);
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
    const res = await postRequest(ruleSwitch, {
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
    const res = await getRequest(rulesList, {
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
                    <span>数据源配置</span>
                  </div>
                }
              >
                <div className="log-config">
                  <div className="log-config-left">
                    <Form labelCol={{ flex: '110px' }} layout="inline" form={logForm}>
                      <Form.Item
                        label="监控名称"
                        name="monitorName"
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
                            resetDbAddr();
                          })}
                          value={currentEnvCode}
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item label="应用" name="appCode">
                        <Select
                          options={appOptions}
                          showSearch
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item
                        label="数据库类型"
                        name="dbType"
                        rules={[{ required: true, message: '请选择数据库类型!' }]}
                      >
                        <Select
                          options={dbTypeOptions}
                          value={dbType}
                          disabled={type === 'edit'}
                          onChange={(value => {
                            setDbType(value);
                            resetDbAddr();
                          })}
                          showSearch
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item
                        label="数据库地址"
                        name="dbAddr"
                        rules={[{ required: true, message: '请选择数据库地址!' }]}
                      >
                        <Select
                          value={dbAddr}
                          disabled={type === 'edit'}
                          options={dbAddressOptions}
                          showSearch
                          onChange={setDbAddr}
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item name="collectIntervalNum" label="采集间隔" rules={[{ required: true, message: '请填写采集间隔' }]}>
                        <InputNumber
                          step={1}
                          min={unit === 'm' ? 5 : 1}
                          addonAfter={(
                            <Select defaultValue="h" value={unit} onChange={setUnit} style={{ width: 80 }}>
                              <Select.Option value="m">分钟</Select.Option>
                              <Select.Option value="h">小时</Select.Option>
                            </Select>
                          )}
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
                    <span>指标配置</span>
                    <Button
                      type="primary"
                      ghost
                      onClick={(e) => {
                        e.stopPropagation();
                        void onPreview()
                      }}
                    >
                      <EyeFilled />
                      指标抓取预览
                    </Button>
                  </div>
                }
              >
                <div className="target-config">
                  <div className="target-config-left">
                    <Form labelCol={{ flex: '110px' }}  form={tagrgetForm}>
                      <Form.List name="metricsQuery">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <div>
                                <div style={{color: '#1972cc', marginBottom: '10px'}}>
                                  指标{name + 1} <DeleteOutlined onClick={() =>{remove(name);} } />
                                </div>
                                <Space key={key} className="space-list-item" direction="vertical">
                                  <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                      prevValues.name.metricName !== curValues.name.metricName
                                      // ||
                                      
                                      // prevValues.name.valueColumn !== curValues.name.valueColumn||
                                      // prevValues.name.valueColumn == curValues.name.valueColumn
                                      
                                    }
                                  >
                                    <Form.Item
                                      {...restField}
                                      label="指标名称"
                                      name={[name, 'metricName']}
                                      rules={[{ required: true, message: '输入指标名称' }]}
                                    >
                                      <Input
                                        placeholder="指标名称仅支持数字、字母、下划线"
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      label="指标描述"
                                      name={[name, 'metricDescription']}
                                      rules={[{ required: true, message: '输入指标描述' }]}
                                    >
                                      <Input />
                                    </Form.Item>
                                    <Row>
                                      <Form.Item
                                        label="查询sql"
                                        name={[name, 'querySql']}
                                        rules={[{ required: true, message: '输入查询sql' }]}
                                        {...restField}
                                      >
                                        <TextArea
                                          rows={2}
                                          onChange={() => resetValidate(name)}
                                        />
                                      </Form.Item>
                                      <Form.Item noStyle>
                                        <Button style={{ margin: "2px 30px" }} type="primary" ghost onClick={() => {onSqlTest(name)}}>解析sql</Button>
                                      </Form.Item>
                                    </Row>
                                    <Form.Item
                                      label="指标值"
                                      name={[name, 'valueColumn']}
                                      rules={[{ required: true, message: '输入指标值' }]}
                                      {...restField}
                                     // shouldUpdate={true}
                                    >
                                      <Select>
                                        {
                                          (sqlRes[name]?.values || []).map((item: string) => (
                                            <Select.Option key={item} value={item}>{item}</Select.Option>
                                          ))
                                        }
                                      </Select>
                                    </Form.Item>
                                  </Form.Item>
                                  <Form.List name={[name, 'labelColumn']}>
                                    {(field, { add, remove }) => (
                                      <>
                                        <div style={{ width: '100%' }}>
                                          <Form.Item>
                                            <Button
                                              type="dashed"
                                              onClick={() => {
                                                add();
                                              }}
                                              block
                                              icon={<PlusOutlined />}
                                              style={{ width: 370, marginLeft: 110 }}
                                            >
                                              选取自定义标签(列名)
                                            </Button>
                                          </Form.Item>
                                        </div>
                                        {field.map(({ key: labelKey, name: labelName, ...restField }) => (
                                          <div key={key + '_' + labelKey} className="filters-list-wrapper">
                                            <Form.Item
                                              {...restField}
                                              name={[labelName]}
                                              rules={[{ required: true, message: '请输入!' }]}
                                            >
                                              <Select style={{ width: 370, marginLeft: 86 }}>
                                                {
                                                  (sqlRes[key]?.labels || []).map((item: string) => (
                                                    <Select.Option key={item} value={item}>{item}</Select.Option>
                                                  ))
                                                }
                                              </Select>
                                            </Form.Item>
                                            <MinusCircleOutlined
                                              onClick={() => {
                                                remove(labelName);
                                              }}
                                            />
                                          </div>
                                        ))}
                                      </>
                                    )}
                                  </Form.List>
                                </Space>
                                <Divider />
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                type="primary"
                                style={{ width: 414, marginLeft: 30 }}
                                onClick={() => add()}
                                block
                                // disabled={editDisable}
                                icon={<PlusOutlined />}
                              >
                                新增指标
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
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
                    {
                      !recordData?.id ? (
                          <Tooltip placement="topLeft" title="请先保存监控配置">
                            <Button
                              type="primary"
                              disabled
                              ghost
                              icon={<PlusOutlined />}
                            >
                              新增报警
                            </Button>
                          </Tooltip>
                      ) : (
                        <Button
                          type="primary"
                          ghost
                          onClick={(e) => {
                            e.stopPropagation();
                            setRulesType('add');
                            setRulesVisible(true);
                          }}
                          icon={<PlusOutlined />}
                        >
                          新增报警
                        </Button>
                      )
                    }
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
                      render: (_: string, record: Item) => (
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
        <Modal
          title="结果预览"
          visible={visible}
          width="80%"
          onCancel={() => {
            setVisible(false);
          }}
          footer={null}
        >
          <div className="log-monitor-board-con">
            <Spin spinning={loading} style={{ height: '100%', overflow: 'auto' }}>
              <pre style={{ color: '#fff' }}>{logSample}</pre>
            </Spin>
          </div>
        </Modal>
        <RulesEdit
          visible={rulesVisible}
          record={rulesRecord}
          bizMonitorId={recordData?.id}
          bizMonitorType={bizMonitorType}
          envCode={currentEnvCode}
          onCancel={() => setRulesVisible(false)}
          onConfirm={() => {
            setRulesVisible(false);
            void getRuleList({
              pageIndex: 1,
              pageSize: 20
            })
          }}
          type={rulesType}
          entryType="biz-db"
          monitorName={logForm?.getFieldValue('monitorName')}
          />
      </ContentCard>
    </PageContainer>
  );
}
