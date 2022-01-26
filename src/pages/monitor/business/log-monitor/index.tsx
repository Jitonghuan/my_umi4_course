/**
 * @description: 创建/编辑日志监控
 * @name {muxi.jth}
 * @date {2022/1/6 19:00}
 */

import React, { useState, useRef } from 'react';
import {
  Collapse,
  Form,
  Select,
  Input,
  Button,
  Row,
  InputNumber,
  Radio,
  Col,
  TimePicker,
  Spin,
  Divider,
  message,
  Space,
} from 'antd';
import PageContainer from '@/components/page-container';
import { FileTextOutlined, EyeFilled, PlusOutlined, DeleteFilled, MinusCircleOutlined } from '@ant-design/icons';
import { putRequest } from '@/utils/request';
import ReactJson from 'react-json-view';
import { ContentCard } from '@/components/vc-page-content';
import { Item } from '../../basic/typing';
import EditorTable from '@cffe/pc-editor-table';
import { editColumns, targetOptions, silenceOptions, rulesOptions, envTypeData, operatorOption } from './schema';
import { useEnvListOptions, useAppOptions } from '../hooks';
import { useLogStoreOptions, useQueryLogSample, useIndexModeFieldsOptions } from './hooks';
import { addMonitor, updateMonitor } from '../service';
import './index.less';
const { Panel } = Collapse;
const { Search } = Input;

export default function LogMonitor(props: any) {
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [appOptions] = useAppOptions();
  const [tagrgetForm] = Form.useForm();
  const [getSilenceValue, setGetSilenceValue] = useState(0);
  const [labelTableData, setLabelTableData] = useState<Item[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<Item[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [currentEnvCode, setCurrentEnvCode] = useState<string>('');
  const [currentAppCode, setCurrentAppCode] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<string>('');
  const [logStoreOptions, getRuleIndex] = useLogStoreOptions(); //日志库选项下拉框数据
  const [logSample, loading, getLogSample] = useQueryLogSample();
  const [filterVisiable, setFilterVisiable] = useState<boolean>(false);
  const [indexModeFieldsOption, getIndexModeFields] = useIndexModeFieldsOptions();
  // const [renderForm, setRenderForm] = useState<any>(['targetForm']);
  const renderForm = useRef<any>(['targetForm']);
  const labelFun = (value: Item[]) => {
    setLabelTableData(value);
  };

  const annotationsFun = (value: Item[]) => {
    setAnnotationsTableData(value);
  };
  const selectTarget = (value: any) => {
    setCurrentTarget(value);
  };
  const selectEnvType = (value: string) => {
    getEnvCodeList(value);
  };
  const selectEnvCode = (value: string) => {
    setCurrentEnvCode(value);
    getRuleIndex(value);
  };
  const selectIndex = (index: string) => {
    setCurrentIndex(index);
    getIndexModeFields(currentEnvCode, index);
  };
  const selectAppCode = (appCode: string) => {
    setCurrentAppCode(appCode);
  };
  const queryLogSample = () => {
    getLogSample(currentEnvCode, currentIndex, currentAppCode);
  };

  const creatLogMinitor = () => {};

  const getFields = () => {
    let length = renderForm.current.length + 1;
    renderForm.current.push('targetForm' + length);
  };
  console.log('renderForm', renderForm);
  return (
    <PageContainer className="monitor-log">
      <ContentCard>
        <div>
          <Collapse bordered={false} defaultActiveKey={['1']} className="log-config-collapse">
            <Panel header="日志源配置" key="1">
              <div className="log-config">
                <div className="log-config-left">
                  <Form labelCol={{ flex: '100px' }}>
                    <Form.Item label="监控名称" name="monitorName">
                      <Input style={{ width: '362px' }}></Input>
                    </Form.Item>
                    <Form.Item label="选择环境" name="envCode">
                      <Select
                        style={{ width: '140px' }}
                        options={envTypeData}
                        onChange={selectEnvType}
                        allowClear
                      ></Select>
                      <Select
                        style={{ width: '220px' }}
                        options={envCodeOption}
                        onChange={selectEnvCode}
                        allowClear
                      ></Select>
                    </Form.Item>
                    <Form.Item label="选择日志索引" name="index">
                      <Select
                        style={{ width: '362px' }}
                        options={logStoreOptions}
                        onChange={selectIndex}
                        showSearch
                        allowClear
                      ></Select>
                    </Form.Item>
                    <Form.Item label="应用" name="appCode">
                      <Select
                        style={{ width: '362px' }}
                        options={appOptions}
                        onChange={selectAppCode}
                        showSearch
                        allowClear
                      ></Select>
                    </Form.Item>
                  </Form>
                </div>
                <div className="log-config-right">
                  <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <FileTextOutlined />
                      日志抓取结果预览
                    </span>
                    <span>
                      <Button type="primary" onClick={queryLogSample}>
                        <EyeFilled />
                        日志抓取预览
                      </Button>
                    </span>
                  </div>

                  <div className="log-board">
                    <Spin spinning={loading} style={{ height: '100%', overflow: 'auto' }}>
                      <ReactJson
                        src={logSample}
                        name={false}
                        theme="apathy"
                        style={{ height: '100%', overflow: 'auto' }}
                        collapsed={false}
                      />
                    </Spin>
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>

          <Collapse bordered={false} defaultActiveKey={['1']} className="target-config-collapse">
            <Panel header={`指标配置`} key="2">
              <div className="target-config">
                <div className="target-config-left">
                  <Form labelCol={{ flex: '100px' }} form={tagrgetForm}>
                    <div className="target-item">指标项</div>
                    <Form.List name="users">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ marginBottom: 8, display: 'block' }} direction="vertical">
                              <Form.Item
                                {...restField}
                                label="指标名称"
                                name={['metricName', 'first']}
                                rules={[{ required: true, message: 'Missing first name' }]}
                              >
                                <Input
                                  style={{ width: '352px' }}
                                  placeholder="指标名称仅支持数字、字母、下划线"
                                ></Input>
                              </Form.Item>
                              <Form.Item
                                label="指标类型"
                                {...restField}
                                name={['metricType', 'second']}
                                rules={[{ required: true, message: 'Missing last name' }]}
                              >
                                <Select
                                  style={{ width: '352px' }}
                                  options={targetOptions}
                                  value={currentTarget}
                                  onChange={selectTarget}
                                ></Select>
                              </Form.Item>
                              {currentTarget === 'Histogram' && (
                                <Form.Item label="Buckets" name="buckets">
                                  <Input style={{ width: 352 }} placeholder="格式: 0.001;0.05;0.1   	冒号分割"></Input>
                                </Form.Item>
                              )}
                              {currentTarget === 'Summary' && (
                                <div>
                                  <Form.Item label="Objectives" name="objectives">
                                    <Input
                                      style={{ width: 352 }}
                                      placeholder="格式: 0.5: 0.05;0.1:0.01 冒号分割"
                                    ></Input>
                                  </Form.Item>
                                  <Form.Item label="MaxAge" name="MaxAge">
                                    <Input style={{ width: 352 }} placeholder="MaxAge"></Input>
                                  </Form.Item>
                                  <Form.Item label="AgeBuckets" name="AgeBuckets">
                                    <Input style={{ width: 352 }} placeholder="AgeBuckets"></Input>
                                  </Form.Item>
                                </div>
                              )}
                              <Form.Item
                                label="指标值字段"
                                {...restField}
                                name={['metricValueField', 'third']}
                                rules={[{ required: true, message: 'Missing last name' }]}
                              >
                                <Select style={{ width: '352px' }} options={indexModeFieldsOption}></Select>
                              </Form.Item>
                              <Form.Item label="指标描述" name={['metricDesc', 'forth']} {...restField}>
                                <Input style={{ width: 352 }}></Input>
                              </Form.Item>
                              <Form.List name="filters">
                                {(fields, { add, remove }) => (
                                  <>
                                    <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ width: 414, marginLeft: 40 }}
                                      >
                                        新增过滤条件
                                      </Button>
                                    </Form.Item>
                                    {fields.map(({ key, name, ...restField }) => (
                                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item {...restField} name={['key', 'first']}>
                                          <Select
                                            style={{ width: 140, marginLeft: 40 }}
                                            options={indexModeFieldsOption}
                                            placeholder="选择过滤字段"
                                          ></Select>
                                        </Form.Item>
                                        <Form.Item {...restField} name={['operator', 'second']}>
                                          <Select
                                            style={{ width: 80, paddingLeft: 5 }}
                                            options={operatorOption}
                                          ></Select>
                                        </Form.Item>
                                        <Form.Item {...restField} name={['value', 'last']}>
                                          <Input style={{ width: 180, marginLeft: 5 }} placeholder="输入字段值"></Input>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                      </Space>
                                    ))}
                                  </>
                                )}
                              </Form.List>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                              <Divider />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="primary"
                              style={{ width: 414, marginLeft: 40 }}
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              继续新增指标
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.Item>
                      <Button
                        type="primary"
                        // onClick={() => add()}
                      >
                        保存监控配置
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                <div className="target-config-right">
                  <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <FileTextOutlined />
                      指标预览
                    </span>
                    <span>
                      <Button type="primary">
                        <EyeFilled />
                        指标预览
                      </Button>
                    </span>
                  </div>
                  <div className="target-board">
                    <Spin spinning={loading} style={{ height: '100%', overflow: 'auto' }}>
                      <ReactJson
                        src={logSample}
                        name={false}
                        theme="apathy"
                        style={{ height: '100%', overflow: 'auto' }}
                        collapsed={false}
                      />
                    </Spin>
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>

          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="报警配置" key="3">
              <Form labelCol={{ flex: '148px' }}>
                <Form.Item
                  label="报警名称"
                  name="name"
                  rules={[
                    {
                      whitespace: true,
                      required: true,
                      message: '请输入正确的名称',
                      // message: "请输入正确的名称(字母数字开头、结尾，支持 '-' , '.')",
                      // pattern: /^[\d|a-z]+$|^[\d|a-z][(a-z\d\-\.)]*[\d|a-z]$|^[\d|a-z]+$/,
                      type: 'string',
                      max: 200,
                    },
                  ]}
                >
                  <Input placeholder="请输入" style={{ width: '400px' }}></Input>
                </Form.Item>
                <Form.Item
                  label="告警表达式(PromQL)"
                  name="expression"
                  rules={[{ required: true, message: '请输入告警表达式!' }]}
                >
                  <Input.TextArea placeholder="请输入" style={{ width: '400px' }}></Input.TextArea>
                </Form.Item>
                <Row>
                  <Form.Item
                    label="报警持续时间"
                    name="duration"
                    rules={[{ required: true, message: '请输入报警持续时间!' }]}
                  >
                    <InputNumber style={{ width: '290px' }} />
                  </Form.Item>
                  <Form.Item name="timeType" noStyle initialValue="m" className="extraStyleTime">
                    <Select style={{ width: '20%' }} placeholder="选择时间单位" allowClear>
                      <Select.Option value="h">小时</Select.Option>
                      <Select.Option value="m">分钟</Select.Option>
                      <Select.Option value="s">秒</Select.Option>
                    </Select>
                  </Form.Item>
                </Row>

                <Form.Item label="报警级别" name="level" rules={[{ required: true, message: '请选择告警级别!' }]}>
                  <Select options={rulesOptions} placeholder="请选择" style={{ width: '400px' }} allowClear></Select>
                </Form.Item>
                <Form.Item label="报警消息" name="message" required={true}>
                  <Input placeholder="消息便于更好识别报警" style={{ width: '400px' }}></Input>
                </Form.Item>
                <Form.Item label="通知对象" name="receiver">
                  <Select mode="multiple" showSearch style={{ width: '400px' }} allowClear></Select>
                </Form.Item>
                <Form.Item
                  label="是否静默"
                  name="silence"
                  style={{ verticalAlign: 'sub' }}
                  rules={[{ required: true, message: '请选择是否静默!' }]}
                >
                  <Radio.Group
                    options={silenceOptions}
                    value={getSilenceValue}
                    onChange={(e) => {
                      setGetSilenceValue(e.target.value);
                    }}
                  ></Radio.Group>
                </Form.Item>
                <Row>
                  <Col span={5}></Col>
                  <Col span={19}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => prevValues.silence !== curValues.silence}
                    >
                      {getSilenceValue !== 0 ? (
                        <Form.Item
                          name="silenceTime"
                          rules={[
                            {
                              required: true,
                              message: '请选择',
                            },
                          ]}
                        >
                          <TimePicker.RangePicker format="HH:mm" style={{ width: '90%', marginTop: 8 }} />
                        </Form.Item>
                      ) : null}
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="高级配置" rules={[{ required: true, message: '请填写高级配置!' }]}>
                  <Form.Item noStyle>
                    <span>标签（Labels):</span>
                    <EditorTable
                      columns={editColumns}
                      onChange={labelFun}
                      value={labelTableData}
                      style={{ width: '90%' }}
                    ></EditorTable>
                    <span>注释（Annotations):</span>
                    <EditorTable
                      columns={editColumns}
                      onChange={annotationsFun}
                      value={annotationsTableData}
                      style={{ width: '90%' }}
                    ></EditorTable>
                  </Form.Item>
                </Form.Item>
              </Form>
              <div style={{ marginTop: 14 }}>
                <Button type="primary" onClick={creatLogMinitor}>
                  新增报警
                </Button>
              </div>
            </Panel>
          </Collapse>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
