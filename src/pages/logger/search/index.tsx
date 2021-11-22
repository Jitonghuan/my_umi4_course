// 日志搜索
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Select, Spin, Button, Input, Tag, Tooltip, Space, DatePicker, TimePicker, Collapse } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useFrameUrl } from './hooks';
import moment from 'moment';
import './index.less';
const { Search } = Input;
const { Panel } = Collapse;

export default function LoggerSearch(props: any) {
  const [tags, setTags] = useState<any[]>(['Tag 2', 'Tag 3']);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const [editInputValue, setEditInputValue] = useState<string>('');
  const [envCode, setEnvCode] = useState<string>();
  const [logStore, setLogStore] = useState<string>();
  const [envOptions] = useEnvOptions();
  const [logStoreOptions] = useLogStoreOptions(envCode);
  const [frameUrl, urlLoading] = useFrameUrl(envCode, logStore);
  const [framePending, setFramePending] = useState(false);
  const timmerRef = useRef<any>();
  const frameRef = useRef<any>();

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

  const handleClose = (removedTag: any) => {
    const tagData = tags.filter((tag) => tag !== removedTag);
    console.log(tagData);
    setTags(tagData);
  };

  const handleEditInputChange = (e: any) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;

    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');

    return {
      tags: newTags,
      editInputIndex: -1,
      editInputValue: '',
    };
  };

  const onSearch = (values: any) => {};

  const { Option } = Select;
  const { RangePicker } = DatePicker;

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
        <div>
          <Button>+添加筛选查询</Button>
        </div>

        <div>
          <span style={{ display: 'inline-block', border: '1px  splid gray' }}>lucene</span>
          <Search
            addonBefore={<QuestionCircleOutlined />}
            placeholder="input search text"
            allowClear
            onSearch={onSearch}
            style={{ width: 304 }}
          />
          <RangePicker
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
          <Button>查询</Button>
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
