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
  Descriptions,
  Row,
  Col,
  List,
  message,
  Avatar,
  Skeleton,
  Divider,
  Tabs,
} from 'antd';
import ChartCaseList from './LogHistorm';
import { AnsiUp } from 'ansi-up';
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
  const { TabPane } = Tabs;
  const { Search } = Input;
  const { Panel } = Collapse;
  const { Option } = Select;
  let ansi_up = new AnsiUp();
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
  const [loading, setLoading] = useState(false); //无限下拉loading
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

  tagListArryIs = localStorage.LOG_SEARCH_FILTER_IS ? JSON.parse(localStorage.LOG_SEARCH_FILTER_IS) : [];
  tagListArryNot = localStorage.LOG_SEARCH_FILTER_NOT ? JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT) : [];

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

    tagListArryIs = filterIs;
    tagListArryNot = filterNot;

    localStorage.LOG_SEARCH_FILTER_IS = JSON.stringify(tagListArryIs);
    localStorage.LOG_SEARCH_FILTER_NOT = JSON.stringify(tagListArryNot);
  };

  const loadMoreData = (n: any = logStore) => {
    if (loading) {
      return;
    }
    setLoading(true);
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
    })
      .then((resp) => {
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
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
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
  return (
    <PageContainer className="content">
      <FilterCard>
        <Row>
          <Col span={17}>
            <Form layout="inline">
              <Form.Item label="环境Code">
                <Select
                  value={envCode}
                  onChange={handleEnvCodeChange}
                  options={envOptions}
                  style={{ width: 140 }}
                  placeholder="请选择环境"
                />
              </Form.Item>
              <Form.Item label="日志库">
                <Select
                  value={logStore}
                  onChange={chooseIndexMode}
                  options={logStoreOptions}
                  style={{ width: 140 }}
                  placeholder="请选择日志库"
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={7}>
            <RangePicker
              style={{ width: 150 }}
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
                style={{ width: 140 }}
              >
                <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
            </span>
          </Col>
        </Row>
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
            <div style={{ marginBottom: 18, width: '100%' }}>
              <div>
                <Form layout="inline" labelCol={{ flex: 4 }}>
                  <Form.Item label="appCode">
                    <Input style={{ width: 120 }}></Input>
                  </Form.Item>
                  <Form.Item label="traceId">
                    <Select placeholder="请选择" style={{ width: 120 }} defaultValue="filterIs">
                      <Select.Option key="filterIs" value="filterIs">
                        是
                      </Select.Option>
                      <Select.Option key="filterNot" value="filterNot">
                        否
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="message">
                    <Input style={{ width: 180 }} placeholder="单行输入"></Input>
                  </Form.Item>
                </Form>
              </div>
              <div style={{ marginTop: 4, width: '100%', marginLeft: 30 }}>
                <Form form={editScreenForm} onFinish={submitEditScreen} layout="inline">
                  <Form.Item label="字段" name="fields">
                    <Select placeholder="envCode" allowClear style={{ width: 120 }} options={indexModeData}></Select>
                  </Form.Item>
                  <Form.Item label="运算符" name="isfilter" style={{ marginLeft: 4 }}>
                    <Select placeholder="请选择" style={{ width: 120 }}>
                      <Select.Option key="filterIs" value="filterIs">
                        是
                      </Select.Option>
                      <Select.Option key="filterNot" value="filterNot">
                        否
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="值" name="editValue" style={{ marginLeft: 44, width: 280 }}>
                    <Input style={{ width: 180 }} placeholder="单行输入"></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      <PlusOutlined />
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" style={{ marginLeft: 2 }} onClick={() => setEditScreenVisible(true)}>
                      高级搜索
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="default" onClick={() => setEditScreenVisible(false)}>
                      关闭高级搜索
                    </Button>
                  </Form.Item>
                </Form>
                <div style={{ marginTop: 4 }}>
                  {tagListArryIs?.map((el: any, index: number) => {
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
                </div>
                {editScreenVisible === true ? (
                  <div style={{ marginTop: 4 }}>
                    <Popover title="查看lucene语法" placement="topLeft" content="">
                      <Button>
                        lucene
                        <QuestionCircleOutlined />
                      </Button>
                    </Popover>
                    <Search placeholder="搜索" allowClear onSearch={onSearch} style={{ width: 290 }} />
                  </div>
                ) : null}
              </div>
            </div>
            <Divider style={{ height: 10, marginTop: 0, marginBottom: 0 }} />
            <div>
              <ChartCaseList data={logHistormData} loading={loading} hitsData={hitInfo} />
            </div>
            <div>
              {/* let html = ansi_up.ansi_to_html(resultLogData);
               if (dom) {
                dom.innerHTML = html;
                 }
                }; */}

              <div
                id="scrollableDiv"
                style={{
                  height: 400,
                  overflow: 'auto',
                  padding: '0 16px',
                  border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
              >
                <InfiniteScroll
                  dataLength={50}
                  next={loadMoreData}
                  hasMore={logSearchTableInfo?.length < 1000}
                  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                  endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    dataSource={logSearchTableInfo}
                    renderItem={(item: any, index) => (
                      <List.Item key={item}>
                        <Collapse onChange={callback}>
                          {
                            // let html = ansi_up.ansi_to_html(JSON.stringify(item?._source));
                            // let panelInfo = document.getElementById('panelInfo');
                            // if (panelInfo) {
                            //   panelInfo.innerHTML = html;
                            // }

                            // {console.log('logSearchTableInfo0000000',logSearchTableInfo)}
                            // return (
                            <Panel
                              className="panelInfo"
                              style={{ whiteSpace: 'pre-line', lineHeight: 2, fontSize: 14, wordBreak: 'break-word' }}
                              header={
                                <div style={{ display: 'flex' }}>
                                  <div style={{ width: '15%' }}>2021年11月23日</div>{' '}
                                  <div style={{ width: '85%' }}>{JSON.stringify(item?._source)}</div>
                                </div>
                              }
                              key={index}
                            >
                              {/* <p>{JSON.stringify(item?._source)}</p> */}
                              <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="表" key="1">
                                  <p>
                                    <span>@timestamp:</span>
                                    <span>{item?._source?.appCode}</span>
                                  </p>
                                  Content of Tab Pane 1
                                </TabPane>
                                <TabPane tab="JSON" key="2">
                                  Content of Tab Pane 2
                                </TabPane>
                              </Tabs>
                            </Panel>
                            // )}
                          }
                          {/* {logSearchTableInfo?.map((item: any, index: number) => {








                          })} */}
                        </Collapse>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </div>
          </div>
        ) : null}
      </ContentCard>
    </PageContainer>
  );
}
