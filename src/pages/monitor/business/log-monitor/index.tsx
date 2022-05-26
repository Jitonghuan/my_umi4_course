/**
 * @description: 创建/编辑日志监控
 * @name {muxi.jth}
 * @date {2022/1/6 19:00}
 */

import React, { useState, useRef, useEffect } from 'react';
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
} from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import moment, { Moment } from 'moment';
import useRequest from '@/utils/useRequest';
import { history } from 'umi';
import { FileTextOutlined, EyeFilled, PlusOutlined, DeleteFilled, MinusCircleOutlined } from '@ant-design/icons';
import { putRequest, postRequest } from '@/utils/request';
import ReactJson from 'react-json-view';
import { ContentCard } from '@/components/vc-page-content';
import { Item } from '../../basic/typing';
import EditorTable from '@cffe/pc-editor-table';
import {
  editColumns,
  targetOptions,
  silenceOptions,
  rulesOptions,
  envTypeData,
  operatorOption,
  stepTableMap,
} from './schema';
import { useEnvListOptions, useAppOptions } from '../hooks';
import { useLogStoreOptions, useQueryLogSample, useIndexModeFieldsOptions } from './hooks';
import { addMonitor, updateMonitor, createRules, updateRules } from '../service';
import './index.less';
const { Panel } = Collapse;
const { Search } = Input;

export default function LogMonitor(props: any) {
  let type = props.location.state?.type || props.location.query?.type;
  let recordData = props.location.state?.recordData;
  const [envCodeOption, getEnvCodeList] = useEnvListOptions();
  const [appOptions] = useAppOptions();
  const [tagrgetForm] = Form.useForm();
  const [alarmForm] = Form.useForm();
  const [logForm] = Form.useForm();
  const [getSilenceValue, setGetSilenceValue] = useState(0);
  const [labelTableData, setLabelTableData] = useState<Item[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<Item[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [currentEnvCode, setCurrentEnvCode] = useState<string>('');
  const [currentAppCode, setCurrentAppCode] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<string>('');
  const [currentEnvType, setCurrentEnvType] = useState<string>('');
  const [currentIndexModeField, setCurrentIndexModeField] = useState<string>('');
  const [logStoreOptions, getRuleIndex] = useLogStoreOptions(); //日志库选项下拉框数据
  const [logSample, loading, getLogSample] = useQueryLogSample();
  const [filterVisiable, setFilterVisiable] = useState<boolean>(false);
  const [indexModeFieldsOption, getIndexModeFields] = useIndexModeFieldsOptions();
  const [editDisable, setEditDisable] = useState<boolean>(false);
  const [selectNum, setSelectNum] = useState<string>('');
  const [initLength, setInitLength] = useState<number>(0);
  // const [, updateState] = React.useState();
  // const forceUpdate = React.useCallback(() => updateState({} as any), []);

  const labelFun = (value: Item[]) => {
    setLabelTableData(value);
  };

  const annotationsFun = (value: Item[]) => {
    setAnnotationsTableData(value);
  };
  const selectTarget = (value: any) => {
    setCurrentTarget(value);

    // forceUpdate();
  };
  const selectEnvType = (value: string) => {
    getEnvCodeList(value);
    setCurrentEnvType(value);
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
  const changeIndexModeField = (indexModeField: string) => {
    setCurrentIndexModeField(indexModeField);
  };

  //新增
  const { run: createRulesFun } = useRequest({
    api: createRules,
    method: 'POST',
    successText: '新增成功',
    isSuccessModal: true,
    onSuccess: () => {
      message.info('新增成功！');
    },
  });

  //编辑
  const { run: updateRulesFun } = useRequest({
    api: updateRules,
    method: 'PUT',
    successText: '编辑成功',
    isSuccessModal: true,
    onSuccess: () => {
      message.info('编辑成功！');
    },
  });
  const onSubmit = (value: any) => {
    if (type === 'add') {
      // createRulesFun({ ...value, serviceId });
    } else {
      // updateRulesFun({ ...value, serviceId });
    }
  };
  //收集数据
  const onFinish = () => {
    alarmForm.validateFields().then((value) => {
      const obj = {
        ...value,
        receiver: (value?.receiver || []).join(','),
        labels: stepTableMap(labelTableData),
        annotations: stepTableMap(annotationsTableData),
        duration: `${value.duration}${value.timeType}`,
      };
      if (value?.silence) {
        obj.silenceStart = moment(value.silenceTime[0]).format('HH:mm');
        obj.silenceEnd = moment(value.silenceTime[1]).format('HH:mm');
        delete obj.silenceTime;
      }
      if (type === 'edit') {
        // obj.id = record?.id;
      }
      delete obj.timeType;
      onSubmit && onSubmit(obj);
    });
  };
  const onChangeTab = () => {
    setSelectNum('1');
  };
  const submitMintorConfig = async () => {
    // setSelectNum('3');
    logForm.validateFields().then((logparams) => {
      tagrgetForm.validateFields().then((targetParams) => {
        let metricOptionsObject = {}; //根据metrics对象选择值拿到的
        let continueMetricList: any = []; //继续新增的指标项
        let continueMetricOptionsObject = {};
        if (targetParams?.metricType === 'histogram') {
          metricOptionsObject = { buckets: targetParams.buckets };
        } else if (targetParams?.metricType === 'summary') {
          metricOptionsObject = {
            objectives: targetParams.objectives,
            MaxAge: targetParams.MaxAge,
            AgeBuckets: targetParams.AgeBuckets,
          };
        }

        targetParams?.metrics?.map((item: any) => {
          if (item?.metricType.second === 'histogram') {
            continueMetricOptionsObject = { buckets: item.buckets };
          } else if (item?.metricType.second === 'summary') {
            continueMetricOptionsObject = {
              objectives: item.objectives,
              MaxAge: item.MaxAge,
              AgeBuckets: item.AgeBuckets,
            };
          }

          continueMetricList.push({
            filters: item.filters,
            metricDesc: item.metricDesc.forth,
            metricName: item.metricName.first,
            metricType: item.metricType.second,
            metricValueField: item?.metricValueField?.third || '',
            metricOptions: continueMetricOptionsObject,
          });
        });
        if (type === 'add') {
          postRequest(addMonitor, { data: { ...logparams, envCode: currentEnvCode, metrics: continueMetricList } })
            .then((resp) => {
              if (resp?.success) {
                message.info('新增成功！');
              }
            })
            .then(() => {
              history.push('/matrix/monitor/business');
              // setEditDisable(true);
            });
        }
        if (type === 'edit') {
          putRequest(updateMonitor, {
            data: { ...logparams, envCode: currentEnvCode, metrics: continueMetricList, id: recordData.id },
          })
            .then((resp) => {
              if (resp?.success) {
                message.info('编辑成功！');
              }
            })
            .then(() => {
              history.push('/matrix/monitor/business');
              // setEditDisable(true);
            });
        }
      });
    });
  };

  //编辑回显数据
  useEffect(() => {
    if (type === 'add') {
      tagrgetForm.setFieldsValue({
        metrics: [{}],
      });
      setEditDisable(false);
      return;
    }
    if (type === 'edit') {
      setEditDisable(true);
    }
    logForm.setFieldsValue({
      monitorName: recordData?.monitorName,
      appCode: recordData?.appCode,
      index: recordData?.index,
    });
    if (recordData?.envCode) {
      getRuleIndex(recordData?.envCode);
    }

    if (recordData?.envCode && recordData?.index) {
      getIndexModeFields(recordData?.envCode, recordData?.index);
    }

    if (recordData?.envCode.indexOf('dev') != -1) {
      setCurrentEnvType('dev');
      getEnvCodeList('dev');
    } else if (recordData?.envCode.indexOf('test') != -1) {
      setCurrentEnvType('test');
      getEnvCodeList('test');
    } else if (recordData?.envCode.indexOf('pre') != -1) {
      setCurrentEnvType('pre');
      getEnvCodeList('pre');
    } else if (recordData?.envCode.indexOf('prod') != -1) {
      setCurrentEnvType('prod');
      getEnvCodeList('prod');
    }
    setCurrentEnvCode(recordData?.envCode);
    let metricsArry: any = [];
    recordData?.MonitorBizMetric?.map((item: any, index: number) => {
      metricsArry.push({
        filters: item?.filters,
        metricDesc: { forth: item?.metricDesc },
        metricName: { first: item?.metricName },
        metricType: { second: item?.metricType },
        metricValueField: { third: item?.metricValueField },
        buckets: item?.metricOptions?.buckets,
        objectives: item?.metricOptions?.objectives,
        MaxAge: item?.metricOptions?.MaxAge,
        AgeBuckets: item?.metricOptions?.AgeBuckets,
      });
    });

    setInitLength(recordData?.MonitorBizMetric.length);

    tagrgetForm.setFieldsValue({
      metrics: metricsArry || [{}],
    });
  }, [type]);

  return (
    <PageContainer className="monitor-log">
      <ContentCard>
        <div>
          <Collapse bordered={false} defaultActiveKey={['1']} className="log-config-collapse">
            <Panel header="日志源配置" key="1">
              <div className="log-config">
                <div className="log-config-left">
                  <Form labelCol={{ flex: '100px' }} form={logForm}>
                    <Form.Item
                      label="监控名称"
                      name="monitorName"
                      rules={[{ required: true, message: '请输入监控名称!' }]}
                    >
                      <Input style={{ width: '362px' }}></Input>
                    </Form.Item>
                    <Form.Item label="选择环境" name="envCode" required={true}>
                      <Select
                        style={{ width: '140px' }}
                        options={envTypeData}
                        value={currentEnvType}
                        onChange={selectEnvType}
                        allowClear
                      ></Select>
                      <Select
                        style={{ width: '220px' }}
                        options={envCodeOption}
                        onChange={selectEnvCode}
                        value={currentEnvCode}
                        allowClear
                      ></Select>
                    </Form.Item>
                    <Form.Item
                      label="选择日志索引"
                      name="index"
                      rules={[{ required: true, message: '请选择日志索引!' }]}
                    >
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

          <Collapse bordered={false} className="target-config-collapse" defaultActiveKey={['2']}>
            <Panel header={`指标配置`} key="2">
              <div className="target-config">
                <div className="target-config-left">
                  <Form labelCol={{ flex: '100px' }} form={tagrgetForm}>
                    <div className="target-item">指标项</div>
                    <Form.List name="metrics">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ marginBottom: 8, display: 'block' }} direction="vertical">
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.name.metricName == curValues.name.metricName
                                }
                              >
                                <Form.Item
                                  {...restField}
                                  label="指标名称"
                                  name={[name, 'metricName', 'first']}
                                  rules={[{ required: true, message: '输入指标名称' }]}
                                >
                                  <Input
                                    style={{ width: '352px' }}
                                    disabled={key <= initLength - 1}
                                    placeholder="指标名称仅支持数字、字母、下划线"
                                  ></Input>
                                </Form.Item>

                                <Form.Item
                                  label="指标类型"
                                  {...restField}
                                  name={[name, 'metricType', 'second']}
                                  rules={[{ required: true, message: '选择指标类型' }]}
                                >
                                  <Select
                                    style={{ width: '352px' }}
                                    options={targetOptions}
                                    // value={currentTarget}
                                    // name={[name,'currentTarget']}
                                    onChange={selectTarget}
                                  ></Select>
                                </Form.Item>

                                <Form.Item noStyle shouldUpdate>
                                  {() => {
                                    if (
                                      tagrgetForm.getFieldsValue(['metrics']).metrics[name]?.metricType?.second ===
                                      'histogram'
                                    ) {
                                      return (
                                        <Form.Item
                                          dependencies={[name, 'metricType', 'second']}
                                          label="Buckets"
                                          name={[name, 'buckets']}
                                        >
                                          <Input
                                            style={{ width: 352 }}
                                            placeholder="格式: 0.001;0.05;0.1   	冒号分割"
                                          ></Input>
                                        </Form.Item>
                                      );
                                    } else if (
                                      tagrgetForm.getFieldsValue(['metrics']).metrics[name]?.metricType?.second ===
                                      'summary'
                                    ) {
                                      return (
                                        <div>
                                          <Form.Item
                                            dependencies={[name, 'metricType', 'second']}
                                            label="Objectives"
                                            name={[name, 'objectives']}
                                          >
                                            <Input
                                              style={{ width: 352 }}
                                              placeholder="格式: 0.5: 0.05;0.1:0.01 冒号分割"
                                            ></Input>
                                          </Form.Item>
                                          <Form.Item
                                            dependencies={[name, 'metricType', 'second']}
                                            label="MaxAge"
                                            name={[name, 'MaxAge']}
                                          >
                                            <Input style={{ width: 352 }} placeholder="MaxAge"></Input>
                                          </Form.Item>
                                          <Form.Item
                                            dependencies={[name, 'metricType', 'second']}
                                            label="AgeBuckets"
                                            name={[name, 'AgeBuckets']}
                                          >
                                            <Input style={{ width: 352 }} placeholder="AgeBuckets"></Input>
                                          </Form.Item>
                                        </div>
                                      );
                                    } else if (
                                      tagrgetForm.getFieldsValue(['metrics']).metrics[name]?.metricType?.second !==
                                      'counter'
                                    ) {
                                      return (
                                        <Form.Item
                                          label="指标值字段"
                                          {...restField}
                                          name={[name, 'metricValueField', 'third']}
                                          rules={[{ required: true, message: '选择指标值字段' }]}
                                          dependencies={[name, 'metricType', 'second']}
                                        >
                                          <Select style={{ width: '352px' }} options={indexModeFieldsOption}></Select>
                                        </Form.Item>
                                      );
                                    }
                                  }}
                                </Form.Item>
                              </Form.Item>

                              <Form.Item
                                dependencies={[name, 'metricType', 'second']}
                                label="指标描述"
                                name={[name, 'metricDesc', 'forth']}
                                {...restField}
                              >
                                <Input style={{ width: 352 }}></Input>
                              </Form.Item>
                              <Form.List name={[name, 'filters']}>
                                {(field, { add, remove }) => (
                                  <>
                                    {/* {console.log(
                                      'name',
                                      tagrgetForm.getFieldsValue(['metrics', name, 'metricType', 'second']).metrics[
                                        name
                                      ]?.metricType?.second,
                                    )} */}
                                    <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        // disabled={editDisable}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ width: 414, marginLeft: 40 }}
                                      >
                                        新增过滤条件
                                      </Button>
                                    </Form.Item>
                                    {field.map(({ key, name, ...restField }) => (
                                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'key']}
                                          rules={[{ required: true, message: '请选择过滤字段!' }]}
                                        >
                                          <Select
                                            style={{ width: 140, marginLeft: 40 }}
                                            options={indexModeFieldsOption}
                                            placeholder="选择过滤字段"
                                            // disabled={editDisable}
                                            onChange={changeIndexModeField}
                                            value={currentIndexModeField}
                                          ></Select>
                                        </Form.Item>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'operator']}
                                          rules={[{ required: true, message: '请选择!' }]}
                                        >
                                          <Select
                                            style={{ width: 80, paddingLeft: 5 }}
                                            options={operatorOption}
                                            // disabled={editDisable}
                                          ></Select>
                                        </Form.Item>
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'value']}
                                          rules={[{ required: true, message: '请输入字段值!' }]}
                                        >
                                          <Input
                                            style={{ width: 180, marginLeft: 5 }}
                                            placeholder="输入字段值"
                                            // disabled={editDisable}
                                          ></Input>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                      </Space>
                                    ))}
                                  </>
                                )}
                              </Form.List>
                              <DeleteFilled style={{ color: '#346c9c' }} onClick={() => remove(name)} />
                              <Divider />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="primary"
                              style={{ width: 414, marginLeft: 40 }}
                              onClick={() => add()}
                              block
                              // disabled={editDisable}
                              icon={<PlusOutlined />}
                            >
                              继续新增指标
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.Item>
                      <Button type="primary" onClick={submitMintorConfig}>
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
                    {/* <Spin  style={{ height: '100%', overflow: 'auto' }}> */}
                    <ReactJson
                      src={[]}
                      name={false}
                      theme="apathy"
                      style={{ height: '100%', overflow: 'auto' }}
                      collapsed={false}
                    />
                    {/* </Spin> */}
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>

          {/* <Collapse bordered={false} activeKey={[selectNum]} onChange={onChangeTab}>
            <Panel header="报警配置" key="3">
              <Form labelCol={{ flex: '148px' }} form={alarmForm} onFinish={onFinish}>
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
                <Form.Item>
                  <Button type="primary">{type === 'add' ? '新增报警' : '编辑报警'}</Button>
                </Form.Item>
              </Form>
            </Panel>
          </Collapse> */}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
