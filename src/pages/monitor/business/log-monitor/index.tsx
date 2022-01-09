/**
 * @description: 创建/编辑日志监控
 * @name {muxi.jth}
 * @date {2022/1/6 19:00}
 */

import React, { useState } from 'react';
import {
  List,
  Card,
  Table,
  Collapse,
  Form,
  Select,
  Input,
  Button,
  Space,
  Row,
  InputNumber,
  Radio,
  Col,
  TimePicker,
} from 'antd';
import PageContainer from '@/components/page-container';
import {
  PauseCircleFilled,
  ClockCircleFilled,
  FileTextOutlined,
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { Item } from '../../basic/typing';
import EditorTable from '@cffe/pc-editor-table';
import './index.less';
const { Panel } = Collapse;
const { Search } = Input;
const activeKeyMap: Record<string, any> = {
  'prometheus-add': 'prometheus',
  'prometheus-edit': 'prometheus',
};

export default function LogMonitor(props: any) {
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;
  const [getSilenceValue, setGetSilenceValue] = useState(0);
  const [labelTableData, setLabelTableData] = useState<Item[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<Item[]>([]);

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const callback = (key: any) => {
    console.log(key);
  };
  const editColumns = [
    {
      title: '键（点击可修改）',
      dataIndex: 'key',
      editable: true,
      width: '45%',
    },
    {
      title: '值（点击可修改）',
      dataIndex: 'value',
      key: 'value',
      editable: true,
      width: '45%',
    },
  ];

  const colunms = [
    {
      title: '指标名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '指标类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '过滤条件',
      dataIndex: 'filter',
      key: 'filter',
    },
  ];
  const rulesOptions = [
    {
      key: 2,
      value: 2,
      label: '警告',
    },
    {
      key: 3,
      value: 3,
      label: '严重',
    },
    {
      key: 4,
      value: 4,
      label: '灾难',
    },
  ];
  const silenceOptions = [
    {
      key: 1,
      value: 1,
      label: '是',
    },
    {
      key: 0,
      value: 0,
      label: '否',
    },
  ];
  const labelFun = (value: Item[]) => {
    setLabelTableData(value);
  };

  const annotationsFun = (value: Item[]) => {
    setAnnotationsTableData(value);
  };

  const listData = [];
  for (let i = 0; i < 9; i++) {
    listData.push(
      <Collapse onChange={callback}>
        <Panel
          header={
            <p>
              <span>"监控名称"</span>
              <span style={{ marginLeft: '20px', display: 'inline-block' }}>
                <PauseCircleFilled style={{ color: 'red' }} />
                停止
              </span>
              <Space style={{ paddingRight: '20px', float: 'right' }}>
                <Button type="primary">看板</Button>
                <Button type="primary">编辑</Button>
                <Button type="primary">启动</Button>
                <Button type="dashed">停止</Button>
              </Space>
            </p>
          }
          key="1"
        >
          <Table
            columns={colunms}
            pagination={false}
            rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
          />
        </Panel>
      </Collapse>,
    );
  }
  const creatLogMinitor = () => {};

  return (
    <PageContainer className="monitor-log">
      <ContentCard>
        <div>
          <Collapse bordered={false} defaultActiveKey={['1']} className="log-config-collapse">
            <Panel header="日志源配置" key="1">
              <div className="log-config">
                <div className="log-config-left">
                  <Form labelCol={{ flex: '100px' }}>
                    <Form.Item label="监控名称">
                      <Input style={{ width: '220px' }}></Input>
                    </Form.Item>
                    <Form.Item label="选择环境">
                      <Select style={{ width: '140px' }}></Select> <Select style={{ width: '220px' }}></Select>
                    </Form.Item>
                    <Form.Item label="应用">
                      <Select style={{ width: '220px' }}></Select>
                    </Form.Item>
                    <Form.Item label="选择日志索引">
                      <Select style={{ width: '220px' }}></Select>
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
                      <Button type="primary">
                        <EyeFilled />
                        日志抓取预览
                      </Button>
                    </span>
                  </div>
                  <div className="log-board"></div>
                </div>
              </div>
            </Panel>
          </Collapse>

          <Collapse bordered={false} defaultActiveKey={['1']} className="target-config-collapse">
            <Panel
              header={`指标配置    上报指标格式：指标名称(过滤字段1="值1",  过滤字段2="值2")   指标值   时间戳`}
              key="2"
            >
              <div className="target-config">
                <div className="target-config-left">
                  <Form labelCol={{ flex: '100px' }}>
                    <Form.Item label="时间戳字段">
                      <Select style={{ width: '220px' }}></Select>
                    </Form.Item>
                    <div className="target-item">指标项</div>
                    <Form.Item label="指标名称">
                      <Input style={{ width: '220px' }}></Input>
                    </Form.Item>
                    <Form.Item label="指标类型">
                      <Select style={{ width: '220px' }}></Select>
                    </Form.Item>
                    <Form.Item label="指标值字段">
                      <Select style={{ width: '220px' }}></Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="dashed"
                        // onClick={() => add()}
                        style={{ width: '50%', marginLeft: 40 }}
                        icon={<PlusOutlined />}
                      >
                        新增过滤条件
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Select style={{ width: 100, marginLeft: 40 }}></Select>
                      <Select style={{ width: 80, paddingLeft: 10 }}></Select>
                      <Input style={{ width: 180, paddingLeft: 10 }}></Input>
                      <span style={{ marginLeft: 10, color: '#1973cc' }}>
                        {' '}
                        <DeleteFilled />
                      </span>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="dashed"
                        // onClick={() => add()}
                        style={{ width: '50%', marginLeft: 40 }}
                        icon={<PlusOutlined />}
                      >
                        继续新增指标
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        // onClick={() => add()}
                      >
                        报存监控配置
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
                  <div className="target-board"></div>
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
            </Panel>
          </Collapse>
        </div>
        <div style={{ marginTop: 14 }}>
          <Button type="primary">新增报警</Button>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
