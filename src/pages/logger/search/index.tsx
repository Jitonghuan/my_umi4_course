// 日志检索
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Form,
  Select,
  Button,
  Input,
  Tag,
  Spin,
  Modal,
  DatePicker,
  TimePicker,
  Collapse,
  Popover,
  Row,
  Col,
  List,
  message,
  Avatar,
  Skeleton,
  Divider,
} from 'antd';
import ChartCaseList from './LogHistorm';
import InfiniteScroll from 'react-infinite-scroll-component';
import {} from './hooks';
import * as APIS from './service';
import { getRequest, postRequest } from '@/utils/request';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useFrameUrl, useIndexModeList } from './hooks';
import moment from 'moment';
import './index.less';
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
  const { Search } = Input;
  const { Panel } = Collapse;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [editScreenForm] = Form.useForm();
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [logHistormData, setLogHistormData] = useState<any>([]);
  const [logSearchTableInfo, setLogSearchTableInfo] = useState<any>();
  console.log('logSearchTableInfo', logSearchTableInfo);
  const [hitInfo, setHitInfo] = useState<string>(''); //命中次数
  const [timestamp, setTimestamp] = useState<any>(''); //时间
  const [loading, setLoading] = useState(false);
  const [editScreenVisible, setEditScreenVisible] = useState<boolean>(false);
  const [envCode, setEnvCode] = useState<string>();
  const [editEnvCode, setEditEnvCode] = useState<string>('');
  const [logStore, setLogStore] = useState<string>();
  const [envOptions] = useEnvOptions();
  const [logStoreOptions] = useLogStoreOptions(envCode);
  const [frameUrl, urlLoading, logType] = useFrameUrl(envCode, logStore);
  const [queryIndexModeList, indexModeData, setIndexModeData] = useIndexModeList();
  const [framePending, setFramePending] = useState(false);
  const timmerRef = useRef<any>();
  const frameRef = useRef<any>();
  // const tagListArryIs = useRef<any>();
  // const tagListArryNot = useRef<any>();
  let tagListArryIs: any = [];
  let tagListArryNot: any = [];

  const onSearch = (values: any) => {};
  useEffect(() => {
    if (logType === '1') {
      setFramePending(!!frameUrl);
    }
  }, [frameUrl]);

  const handleEnvCodeChange = (next: string) => {
    setEnvCode(next);
    setLogStore(undefined);
  };

  const callback = (key: any) => {
    console.log(key);
  };
  const handleFrameComplete = () => {
    clearTimeout(timmerRef.current);
    timmerRef.current = setTimeout(() => {
      setFramePending(false);
    }, 500);
  };

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
  // if (!localStorage.LOG_SEARCH_FILTER_IS) {
  //   (localStorage.LOG_SEARCH_FILTER_IS = JSON.stringify('')),
  //     (tagListArryIs = JSON.parse(localStorage.LOG_SEARCH_FILTER_IS));
  //   tagListArryNot = JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT);
  // } else if (localStorage.LOG_SEARCH_FILTER_IS) {
  //   tagListArryIs = JSON.parse(localStorage.LOG_SEARCH_FILTER_IS);
  //   tagListArryNot = JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT);
  // }
  // tagListArryIs = localStorage.LOG_SEARCH_FILTER_IS ? JSON.parse(localStorage.LOG_SEARCH_FILTER_IS) : [];
  // tagListArryNot = localStorage.LOG_SEARCH_FILTER_NOT ? JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT) : [];

  useEffect(() => {}, []);

  const submitEditScreen = (params: any) => {
    let filterIs = localStorage.LOG_SEARCH_FILTER_IS ? JSON.parse(localStorage.LOG_SEARCH_FILTER_IS) : [];
    let filterNot = localStorage.LOG_SEARCH_FILTER_NOT ? JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT) : [];

    let key = params.fields;
    let value = params.editValue;
    if (params.isfilter === 'filterIs') {
      filterIs.push(key + ':' + value);
    } else if (params.isfilter === 'filterNot') {
      filterNot.push(key + ':' + value);
    }
    postRequest(APIS.logSearch, {
      data: {
        startTime: start,
        endTime: end,
        querySql: '',
        filterIs: filterIs || tagListArryIs || [],
        filterNot: filterNot || tagListArryNot || [],
        envCode: envCode,
        indexMode: logStore,
      },
    }).then((resp) => {
      if (resp?.success) {
        //柱状图数据 buckets
        let logHistorm = resp?.data?.aggregations?.aggs_over_time?.buckets;
        setLogHistormData(logHistorm);
        //手风琴下拉框数据 hits
        let logSearchTableInfodata = resp.data.hits.hits;
        setLogSearchTableInfo(logSearchTableInfodata);
      }
    });

    localStorage.LOG_SEARCH_FILTER_IS = JSON.stringify(filterIs);
    localStorage.LOG_SEARCH_FILTER_NOT = JSON.stringify(filterNot);

    tagListArryIs = localStorage.LOG_SEARCH_FILTER_IS ? JSON.parse(localStorage.LOG_SEARCH_FILTER_IS) : [];
    tagListArryNot = localStorage.LOG_SEARCH_FILTER_NOT ? JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT) : [];

    // tagListArryIs = JSON.parse(localStorage.LOG_SEARCH_FILTER_IS);
    // console.log(tagListArryIs);
    // tagListArryNot = JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT);
  };
  const queryLogInfo = (n: any = logStore) => {
    postRequest(APIS.logSearch, {
      data: {
        startTime: start,
        endTime: end,
        querySql: '',
        filterIs: tagListArryIs || [],
        filterNot: tagListArryNot || [],
        envCode: envCode,
        indexMode: n,
      },
    }).then((resp) => {
      if (resp?.success) {
        //柱状图数据 buckets
        let logHistorm = resp?.data?.aggregations?.aggs_over_time?.buckets;
        setLogHistormData;
        setLogHistormData(logHistorm);
        //手风琴下拉框数据 hits
        let logSearchTableInfodata = resp.data.hits.hits;
        setLogSearchTableInfo(logSearchTableInfodata);
        //命中率
        let hitNumber = resp.data.hits.total.value;
        setHitInfo(hitNumber);
      }
    });
  };

  const closeTagIs = (index: number, type: string) => {
    tagListArryIs.splice(index, 1);
    localStorage.LOG_SEARCH_FILTER_IS = JSON?.stringify(tagListArryIs);
    queryLogInfo();
  };

  const closeTagNot = (index: number, type: string) => {
    tagListArryNot.splice(index, 1);
    localStorage.LOG_SEARCH_FILTER_NOT = JSON?.stringify(tagListArryNot);
    queryLogInfo();
  };

  const chooseIndexMode = (n: any) => {
    setLogStore(n);
    queryIndexModeList(envCode, n)
      .then(() => {
        queryLogInfo(n);
      })
      .catch(() => {
        setIndexModeData([]);
        setHitInfo('');
        setLogSearchTableInfo('');
        setLogHistormData('');
      });
  };
  //实现无限加载滚动

  const content = (
    <div>
      <Form form={editScreenForm} onFinish={submitEditScreen} labelCol={{ flex: '100px' }}>
        <Row>
          <Col span={12}>
            <Form.Item label="字段" name="fields">
              <Select placeholder="envCode" allowClear style={{ width: 120 }} options={indexModeData}></Select>
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
        <Row>
          <Col span={24} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item>
              <Button
                htmlType="reset"
                onClick={() => {
                  setEditScreenVisible(false);
                }}
              >
                取消
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setEditScreenVisible(false);
                }}
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
              onChange={chooseIndexMode}
              options={logStoreOptions}
              style={{ width: 200 }}
              placeholder="请选择日志库"
            />
          </Form.Item>
          <s className="flex-air"></s>
        </Form>
      </FilterCard>
      <ContentCard className="page-logger-search-content">
        {logType === '1' && (urlLoading || framePending) ? (
          <div className="loading-wrapper">
            <Spin tip="加载中" />
          </div>
        ) : null}

        {/* {(logType==="1")&&!urlLoading && (!envCode || !logStore) ? <div className="empty-holder">请选择环境和日志库</div> : null} */}

        {logType === '1' && !urlLoading && envCode && logStore && !frameUrl ? (
          <div className="empty-holder">未找到日志检索页面</div>
        ) : null}

        {logType === '1' && !urlLoading && frameUrl ? (
          <iframe onLoad={handleFrameComplete} src={frameUrl} frameBorder="0" ref={frameRef} />
        ) : null}

        {!envCode && !logStore ? <div className="empty-holder">请选择环境和日志库</div> : null}

        {logType === '0' && envCode && logStore ? (
          <div>
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
              <span>
                {tagListArryIs?.map((el: any, index: number) => {
                  {
                    console.log(el, 'esdasdsadasdas');
                  }
                  return (
                    <Tag
                      closable={true}
                      visible={true}
                      color="green"
                      onClose={() => {
                        closeTagIs(index, 'LOG_SEARCH_FILTER_IS');
                      }}
                    >
                      {el}
                    </Tag>
                  );
                })}
                {tagListArryNot?.map((el: any, index: number) => {
                  return (
                    <Tag
                      closable={true}
                      color="gold"
                      visible={true}
                      onClose={() => {
                        closeTagNot(index, 'LOG_SEARCH_FILTER_NOT');
                      }}
                    >
                      <span style={{ color: 'red' }}>非</span> {el}
                    </Tag>
                  );
                })}
              </span>
            </div>
            <Divider />
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
                <Select
                  value={startTime}
                  onChange={(value) => {
                    setStartTime(value);
                  }}
                  style={{ width: 150 }}
                >
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
              <ChartCaseList data={logHistormData} loading={loading} hitsData={hitInfo} />
            </div>
            <div>
              <Collapse defaultActiveKey={['1']} onChange={callback}>
                {logSearchTableInfo?.map((item: any, index: number) => {
                  // {console.log('logSearchTableInfo0000000',logSearchTableInfo)}
                  return (
                    <Panel header={item?._source?.timestamp} key={index}>
                      <p>{JSON.stringify(item?._source)}</p>
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </div>
        ) : null}
      </ContentCard>
    </PageContainer>
  );
}
