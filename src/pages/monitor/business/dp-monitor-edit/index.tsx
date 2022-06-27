import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  InputNumber,
  Spin,
  Divider,
  message,
  Space, Modal,
} from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import {
  ExclamationOutlined,
  CheckOutlined,
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  EyeFilled
} from '@ant-design/icons';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';

import { envTypeData } from './schema';
import { useEnvListOptions, useAppOptions } from '../hooks';
import {
  useQueryLogSample,
  useDbType,
} from './hooks';
import { addDbMonitor, updateDbMonitor} from '../service';
import './index.less';
import * as APIS from "@/pages/monitor/business/service";
const { TextArea } = Input;

export default function DpMonitorEdit(props: any) {
  let type = props.location.state?.type || props.location.query?.type;
  let recordData = props.location.state?.recordData;
  const [appOptions] = useAppOptions(); // 应用code列表
  const [envCodeOption, getEnvCodeList] = useEnvListOptions(); // 环境code列表
  const [dbTypeOptions] = useDbType(); // 数据库类型列表
  const [dbAddressOptions, setDbAddressOptions] = useState<IOption[]>([]); // 数据库地址列表

  const [currentEnvType, setCurrentEnvType] = useState<string>(''); // 环境大类
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code
  const [dbType, setDbType] = useState(''); // 数据库类型
  const [dbAddr, setDbAddr] = useState(''); // 数据库地址
  const [unit, setUnit] = useState('s'); // 单位

  const [visible, setVisible] = useState(false);
  const [logSample, loading, getLogSample] = useQueryLogSample();

  const [tagrgetForm] = Form.useForm();
  const [logForm] = Form.useForm();

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
        })
      })
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
    if (res?.success) {
      Object.assign(list[key], {
        validate: true
      })
      tagrgetForm.setFieldsValue({
        metricsQuery:list
      });
      message.success('校验通过～')
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
      if (data.metricsQuery) {
        for (const item of data.metricsQuery) {
          if (!item.validate) {
            return message.warning('请先测试sql是否正确');
          }
        }
      }
      if (type === 'edit') {
        postRequest(updateDbMonitor, {
          data: { ...data, id: recordData.id },
        })
          .then((resp) => {
            if (resp?.success) {
              message.info('编辑成功！');
              history.push('/matrix/monitor/business');
            }
          })
      } else {
        postRequest(addDbMonitor, { data })
          .then((resp) => {
            if (resp?.success) {
              message.info('新增成功！');
              history.push('/matrix/monitor/business');
            }
          })
      }
    }
  };

  //编辑回显数据
  useEffect(() => {
    if (type === 'add') {
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
          getEnvCodeList(item.value);
        }
      }
    }

    let metricsQuery =  recordData.metricsQuery || [];
    for (const item of metricsQuery) {
      Object.assign(item, {
        validate: true
      })
    }
    setDbAddr(recordData?.dbAddr);
    setDbType(recordData?.dbType);
    setCurrentEnvCode(recordData?.envCode);
    tagrgetForm.setFieldsValue({
      metricsQuery,
    });
  }, [type]);

  return (
    <PageContainer className="monitor-log">
      <ContentCard>
        <div className="monitor-log-btn-wrapper">
          <Button type="primary" onClick={onSubmit}>
            保存配置
          </Button>
          <Button
            style={{ marginLeft: '15px' }}
            onClick={() => {
              history.goBack();
            }}
            >
            取消
          </Button>
        </div>
        <Divider />
        <div>
          <div className="target-item">
            <span>数据源配置</span>
          </div>
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
                    addonAfter={(
                      <Select defaultValue="s" value={unit} onChange={setUnit} style={{ width: 80 }}>
                        <Select.Option value="s">秒</Select.Option>
                        <Select.Option value="m">分钟</Select.Option>
                        <Select.Option value="h">小时</Select.Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>

          <Divider />

          <div className="target-config">
            <div className="target-config-left">
              <Form labelCol={{ flex: '110px' }}  form={tagrgetForm}>
                <div className="target-item">
                  <span>指标配置</span>
                  <Button
                    type="primary"
                    ghost
                    onClick={onPreview}
                  >
                    <EyeFilled />
                    指标抓取预览
                  </Button>
                </div>
                <Form.List name="metricsQuery">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div>
                          <div style={{color: '#1972cc', marginBottom: '10px'}}>
                            指标{name + 1} <DeleteOutlined onClick={() => remove(name)} />
                          </div>
                          <Space key={key} className="space-list-item" direction="vertical">
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.name.metricName == curValues.name.metricName
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
                              <Form.Item
                                label="查询sql"
                                name={[name, 'querySql']}
                                rules={[{ required: true, message: '输入查询sql' }]}
                                {...restField}
                              >
                                <TextArea
                                  rows={2}
                                  onChange={() => {
                                    let metricsQuery = tagrgetForm.getFieldValue('metricsQuery');
                                    Object.assign(metricsQuery[name], {
                                      validate: false
                                    })
                                    tagrgetForm.setFieldsValue({
                                      metricsQuery
                                    })
                                  }}
                                />
                              </Form.Item>
                              <Form.Item
                                label="结果列"
                                name={[name, 'valueColumn']}
                                rules={[{ required: true, message: '输入结果列' }]}
                                {...restField}
                              >
                                <Input />
                              </Form.Item>
                            </Form.Item>
                            <Form.List name={[name, 'labelColumn']}>
                              {(field, { add, remove }) => (
                                <>
                                  <div style={{ width: '100%' }}>
                                    <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ width: 240, marginLeft: 30 }}
                                      >
                                        选取自定义标签(列名)
                                      </Button>
                                    </Form.Item>
                                  </div>
                                  {field.map(({ key, name, ...restField }) => (
                                    <div key={key} className="filters-list-wrapper">
                                      <Form.Item
                                        {...restField}
                                        name={[name]}
                                        rules={[{ required: true, message: '请输入!' }]}
                                      >
                                        <Input
                                          style={{ width: 210, marginLeft: 5 }}
                                          placeholder="输入"
                                        />
                                      </Form.Item>
                                      <MinusCircleOutlined onClick={() => remove(name)} />
                                    </div>
                                  ))}
                                </>
                              )}
                            </Form.List>
                            <Form.Item noStyle>
                              <Button style={{ margin: "0 30px" }} type="primary" ghost onClick={() => {onSqlTest(name)}}>查询测试</Button>
                              {
                                <Form.Item
                                  shouldUpdate={(prevValues, curValues) => {
                                    return prevValues?.metricsQuery[name]?.validate !== curValues?.metricsQuery[name]?.validate
                                  }}
                                >
                                  {({ getFieldValue }) =>
                                    getFieldValue(['metricsQuery', name, 'validate']) ? (
                                      <span style={{ color: '#389e0d', fontSize: '16px' }} ><CheckOutlined />校验通过</span>
                                    ) : (
                                      <span style={{ color: '#ff4d4f', fontSize: '16px' }}><ExclamationOutlined  />未校验</span>
                                    )
                                  }
                                </Form.Item>
                              }
                            </Form.Item>
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
      </ContentCard>
    </PageContainer>
  );
}
