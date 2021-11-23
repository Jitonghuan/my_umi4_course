// 日志检索
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Form,
  Select,
  Spin,
  Button,
  Input,
  Tag,
  Tooltip,
  Modal,
  DatePicker,
  TimePicker,
  Collapse,
  Popover,
  Row,
  Col,
} from 'antd';
import ChartCaseList from './LogHistorm';
import { useLoggerData } from './hooks';
import * as APIS from './service';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useFrameUrl } from './hooks';
import moment from 'moment';
import './index.less';
const { Search } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
// 时间枚举
export const START_TIME_ENUMS = [
  {
    label: 'Last 30 minutes',
    value: 30 * 60 * 1000,
  },
  {
    label: 'Last 1 hours',
    value: 60 * 60 * 1000,
  },
  {
    label: 'Last 6 hours',
    value: 6 * 60 * 60 * 1000,
  },
  {
    label: 'Last 12 hours',
    value: 12 * 60 * 60 * 1000,
  },
  {
    label: 'Last 24 hours',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: 'Last 3 days',
    value: 24 * 60 * 60 * 1000 * 3,
  },
  {
    label: 'Last 7 days',
    value: 24 * 60 * 60 * 1000 * 7,
  },
  {
    label: 'Last 30 days',
    value: 24 * 60 * 60 * 1000 * 30,
  },
];

export default function LoggerSearch(props: any) {
  const [editScreenForm] = Form.useForm();
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const [logHistormData, logHistormLoading] = useLoggerData(); //柱状图数据
  const [editScreenVisible, setEditScreenVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const [editInputValue, setEditInputValue] = useState<string>('');
  const [envCode, setEnvCode] = useState<string>();
  const [editEnvCode, setEditEnvCode] = useState<string>('');
  const [logStore, setLogStore] = useState<string>();
  const [envOptions] = useEnvOptions();
  const [logStoreOptions] = useLogStoreOptions(envCode);
  const [frameUrl, urlLoading] = useFrameUrl(envCode, logStore);
  const [framePending, setFramePending] = useState(false);
  const timmerRef = useRef<any>();
  const frameRef = useRef<any>();
  const onSearch = (values: any) => {};

  useEffect(() => {
    setFramePending(!!frameUrl);
  }, [frameUrl]);

  const handleEnvCodeChange = (next: string) => {
    setEnvCode(next);
    setLogStore(undefined);
  };

  const callback = (key: any) => {
    console.log(key);
  };

  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;

  function range(start: any, end: any) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const PickerWithType = (type: any, onChange: any) => {
    if (type === 'time') return <TimePicker onChange={onChange} />;
    if (type === 'date') return <DatePicker onChange={onChange} />;
    return <DatePicker picker={type} onChange={onChange} />;
  };
  const submitEditScreen = (params: any) => {
    console.log('params', params);
    let editCode = '';
    if (params.isfilter === 'filterIs') {
      let filterIs: object = {
        key: params.fields,
        value: params.editValue,
      };
    } else {
      let filterNot: object = {
        key: params.fields,
        value: params.editValue,
      };
    }
  };

  const content = (
    <div>
      <Form form={editScreenForm} onFinish={submitEditScreen} labelCol={{ flex: '100px' }}>
        <Row>
          <Col span={12}>
            <Form.Item label="字段" name="fields">
              <Select
                placeholder="envCode"
                allowClear
                style={{ width: 120 }}
                //  value={editEnvCode}
                //  onChange={handleEnvCode}
                options={envOptions}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="运算符" name="isfilter">
              <Select placeholder="请选择" style={{ width: 120 }}>
                <Select.Option key="filterIs" value="filterIs">
                  是
                </Select.Option>
                <Select.Option key="filterNot" value="filterNot">
                  否
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="值" name="editValue">
              <Input style={{ width: 140 }} placeholder="单行输入"></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ display: 'flex', float: 'right' }}>
          <Col span={12}>
            <Form.Item>
              <Button htmlType="reset" onClick={() => setEditScreenVisible(false)}>
                取消
              </Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => setEditScreenVisible(false)}
              >
                保存
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );

  return (
    <PageContainer>
      <FilterCard>
        <Form layout="inline">
          <Form.Item label="环境Code">
            <Select
              value={envCode}
              onChange={handleEnvCodeChange}
              options={envOptions}
              style={{ width: 200 }}
              placeholder="请选择环境"
            />
          </Form.Item>
          <Form.Item label="日志库">
            <Select
              value={logStore}
              onChange={(n) => setLogStore(n)}
              options={logStoreOptions}
              style={{ width: 200 }}
              placeholder="请选择日志库"
            />
          </Form.Item>
          <s className="flex-air"></s>
        </Form>
      </FilterCard>
      <ContentCard className="page-logger-search-content">
        <div style={{ marginBottom: 18 }}>
          <Popover
            placement="bottomLeft"
            title="编辑筛选"
            content={content}
            trigger="click"
            overlayStyle={{ width: 600 }}
            visible={editScreenVisible}
          >
            <Button
              type="primary"
              onClick={() => {
                setEditScreenVisible(true);
              }}
            >
              <PlusOutlined />
              添加筛选查询
            </Button>
          </Popover>
        </div>
        <div>
          <Popover title="查看lucene语法" placement="topLeft" content="">
            <Button>
              lucene
              <QuestionCircleOutlined />
            </Button>
          </Popover>
          <Search placeholder="搜索" allowClear onSearch={onSearch} style={{ width: 290 }} />

          <RangePicker
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
          <span>
            <Select value={startTime} onChange={(value) => setStartTime(value)} style={{ width: 150 }}>
              <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
              {START_TIME_ENUMS.map((time) => (
                <Select.Option key={time.value} value={time.value}>
                  {time.label}
                </Select.Option>
              ))}
            </Select>
          </span>
          <Button type="default">查询</Button>
        </div>
        <div style={{ marginBottom: 20, marginTop: 20 }}>
          <ChartCaseList data={logHistormData} loading={logHistormLoading} />
        </div>
        <div>
          <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="This is panel header 1" key="1">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 2" key="2">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3">
              <p>{text}</p>
            </Panel>
          </Collapse>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
