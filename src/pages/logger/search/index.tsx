import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Form,
  Select,
  Button,
  Input,
  Tag,
  Spin,
  DatePicker,
  TimePicker,
  Collapse,
  Popover,
  Row,
  Col,
  List,
  Skeleton,
  Divider,
  Tabs,
} from 'antd';
import ChartCaseList from './LogHistorm';
import ReactJson from 'react-json-view';
import { AnsiUp } from 'ansi-up';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as APIS from './service';
import { postRequest } from '@/utils/request';
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
  const [subInfoForm] = Form.useForm();
  const [editScreenForm] = Form.useForm();
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [logHistormData, setLogHistormData] = useState<any>([]); //柱状图图表数据
  const [logSearchTableInfo, setLogSearchTableInfo] = useState<any>(); //手风琴下拉框数据 hits
  const [vivelogSearchTabInfo, setVivelogSeaechTabInfo] = useState<any>(); //手风琴展示数据
  const [hitInfo, setHitInfo] = useState<string>(''); //命中次数
  const [envCode, setEnvCode] = useState<string>(''); //环境envcode选择
  const [logStore, setLogStore] = useState<string>(); //日志库选择
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  const [querySql, setQuerySql] = useState<string>(''); //querySql选择
  let tagListArryIs: any = []; //运算符为是
  let tagListArryNot: any = []; //运算符为否
  tagListArryIs = localStorage.LOG_SEARCH_FILTER_IS ? JSON.parse(localStorage.LOG_SEARCH_FILTER_IS) : [];
  tagListArryNot = localStorage.LOG_SEARCH_FILTER_NOT ? JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT) : [];
  const [srollLoading, setScrollLoading] = useState(false); //无限下拉loading
  const [infoLoading, setInfoLoading] = useState(false); //日志检索信息loading
  const [editScreenVisible, setEditScreenVisible] = useState<boolean>(false); //是否展示lucene语法输入框
  const [envOptions] = useEnvOptions(); //环境下拉框选项数据
  const [logStoreOptions] = useLogStoreOptions(envCode); //日志库选项下拉框数据
  const [frameUrl, urlLoading, logType] = useFrameUrl(envCode, logStore);
  const [queryIndexModeList, indexModeData, setIndexModeData] = useIndexModeList(); //获取字段列表  indexModeList
  const [framePending, setFramePending] = useState(false);
  const timmerRef = useRef<any>();
  const frameRef = useRef<any>();

  useEffect(() => {
    if (logType === '1') {
      setFramePending(!!frameUrl);
    }
  }, [frameUrl]);
  //使用lucene语法搜索时的事件
  const onSearch = (values: any) => {
    setQuerySql(values);
    loadMoreData(logStore, startTimestamp, endTimestamp, values, tagListArryIs, tagListArryNot);
  };

  //选择时间间隔
  const selectTime = (time: any, timeString: string) => {
    let start = moment(timeString[0]).unix().toString();
    let end = moment(timeString[1]).unix().toString();
    setStartTimestamp(start);
    setEndTimestamp(end);

    if (start !== 'NaN' && end !== 'NaN') {
      loadMoreData(logStore, start, end, querySql, tagListArryIs, tagListArryNot);
    } else {
      loadMoreData(logStore, startTimestamp, endTimestamp, querySql, tagListArryIs, tagListArryNot);
    }
  };

  // 选择就近时间触发的事件
  const selectRelativeTime = (value: any) => {
    setStartTime(value);
    let startTimepl = Number((now - value) / 1000).toString();
    let endTimepl = Number(now / 1000).toString();
    setStartTimestamp(startTimepl);
    setEndTimestamp(endTimepl);
    loadMoreData(logStore, startTimepl, endTimepl, querySql);
  };
  //选择环境事件
  const handleEnvCodeChange = (next: string) => {
    setEnvCode(next);
    setLogStore(undefined);
  };

  const callback = (key: any) => {};
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

  //输入appCode、message、traceId时按下回车键触发查询日志事件
  const subInfo = () => {
    let params = subInfoForm.getFieldsValue();
    let filterIs = localStorage.LOG_SEARCH_FILTER_IS ? JSON.parse(localStorage.LOG_SEARCH_FILTER_IS) : [];
    let filterNot = localStorage.LOG_SEARCH_FILTER_NOT ? JSON.parse(localStorage.LOG_SEARCH_FILTER_NOT) : [];
    let querySqlInfo = params?.message;
    let value = params?.appCode;
    filterIs.push('appCode:' + value);
    setQuerySql(querySqlInfo);
    tagListArryIs = filterIs;
    localStorage.LOG_SEARCH_FILTER_IS = JSON.stringify(tagListArryIs);
    loadMoreData(logStore, startTimestamp, endTimestamp, querySqlInfo, filterIs);
  };

  //选择字段触发事件
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
    setInfoLoading(true);
    tagListArryIs = filterIs;
    tagListArryNot = filterNot;
    localStorage.LOG_SEARCH_FILTER_IS = JSON.stringify(tagListArryIs);
    localStorage.LOG_SEARCH_FILTER_NOT = JSON.stringify(tagListArryNot);
    loadMoreData(logStore, startTimestamp, endTimestamp, querySql, filterIs, filterNot);
  };

  //接收参数：日志库选择logStore,日期开始时间，日期结束时间，querySql,运算符为是（filterIs）,运算符为否（filterNot）,环境Code（envCode）
  const loadMoreData = (
    n: any = logStore,
    startTime?: string,
    endTime?: string,
    querySqlParam?: string,
    filterIsParam?: any,
    filterNotParam?: any,
  ) => {
    // setLoading(true);
    setInfoLoading(true);
    postRequest(APIS.logSearch, {
      data: {
        indexMode: n,
        startTime: startTime || startTimestamp,
        endTime: endTime || endTimestamp,
        querySql: querySqlParam || '',
        filterIs: tagListArryIs || [],
        filterNot: tagListArryNot || [],
        envCode: envCode,
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
          let vivelogSearchTabInfo = logSearchTableInfodata.splice(0, 20);
          setLogSearchTableInfo(logSearchTableInfodata);

          setVivelogSeaechTabInfo(vivelogSearchTabInfo);
          //命中率
          let hitNumber = resp.data.hits.total.value;
          setHitInfo(hitNumber);
          // setLoading(false);
          setInfoLoading(false);
        }
      })
      .catch(() => {
        // setLoading(false);
        setInfoLoading(false);
      });
  };
  //关闭tag是
  const closeTagIs = (index: number, type: string) => {
    tagListArryIs.splice(index, 1);
    localStorage.LOG_SEARCH_FILTER_IS = JSON?.stringify(tagListArryIs);
    loadMoreData(logStore, startTimestamp, endTimestamp, querySql);
    // editScreenForm.resetFields();
    // subInfoForm.resetFields();
  };
  //关闭tag否
  const closeTagNot = (index: number, type: string) => {
    tagListArryNot.splice(index, 1);
    localStorage.LOG_SEARCH_FILTER_NOT = JSON?.stringify(tagListArryNot);
    loadMoreData(logStore, startTimestamp, endTimestamp, querySql);
    // editScreenForm.resetFields();
  };
  //切换日志库
  const chooseIndexMode = (n: any) => {
    setLogStore(n);
    queryIndexModeList(envCode, n)
      .then(() => {
        loadMoreData(n, startTimestamp, endTimestamp);
      })
      .catch(() => {
        setIndexModeData([]);
        setHitInfo('');
        setLogSearchTableInfo('');
        setLogHistormData('');
      });
  };
  // 无限滚动下拉事件
  const ScrollMore = () => {
    setScrollLoading(true);

    setTimeout(() => {
      let moreList = logSearchTableInfo.splice(0, 20);
      let vivelist = vivelogSearchTabInfo.concat(moreList);
      setVivelogSeaechTabInfo(vivelist);
      setScrollLoading(false);
    }, 2000);
  };

  //实现无限加载滚动
  return (
    <PageContainer className="content">
      <FilterCard>
        <Row>
          <Col span={14}>
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
          <Col span={10}>
            {logType === '0' && envCode && logStore ? (
              <div>
                <RangePicker
                  style={{ width: 200 }}
                  onChange={(v: any, b: any) => selectTime(v, b)}
                  // onChange={()=>selectTime}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
                <span>
                  <Select value={startTime} onChange={selectRelativeTime} style={{ width: 140 }}>
                    <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                    {START_TIME_ENUMS.map((time) => (
                      <Select.Option key={time.value} value={time.value}>
                        {time.label}
                      </Select.Option>
                    ))}
                  </Select>
                </span>
              </div>
            ) : null}
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
                <Form form={subInfoForm} layout="inline" labelCol={{ flex: 4 }}>
                  <Form.Item label="appCode" name="appCode">
                    <Input style={{ width: 120 }} onPressEnter={subInfo}></Input>
                  </Form.Item>
                  <Form.Item label="message" name="message">
                    <Input
                      style={{ width: 180 }}
                      placeholder="单行输入"
                      onPressEnter={subInfo}
                      addonBefore="like"
                    ></Input>
                  </Form.Item>
                  <Form.Item label="traceId">
                    <Input placeholder="单行输入" style={{ width: 350 }}></Input>
                  </Form.Item>
                </Form>
              </div>
              <div style={{ marginTop: 4, width: '100%', marginLeft: 18 }}>
                <Form form={editScreenForm} onFinish={submitEditScreen} layout="inline">
                  <Form.Item label="字段" name="fields" rules={[{ required: true }]}>
                    <Select placeholder="envCode" allowClear style={{ width: 120 }} options={indexModeData}></Select>
                  </Form.Item>
                  <Form.Item label="运算符" name="isfilter" style={{ marginLeft: 7 }} rules={[{ required: true }]}>
                    <Select placeholder="请选择" style={{ width: 180 }}>
                      <Select.Option key="filterIs" value="filterIs">
                        是
                      </Select.Option>
                      <Select.Option key="filterNot" value="filterNot">
                        否
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="值"
                    name="editValue"
                    style={{ marginLeft: 20, width: 280 }}
                    rules={[{ required: true }]}
                  >
                    <Input style={{ width: 180 }} placeholder="单行输入"></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      <PlusOutlined />
                    </Button>
                  </Form.Item>
                  <Button
                    type="primary"
                    style={{ marginLeft: 2 }}
                    onClick={() => setEditScreenVisible(true)}
                    onDoubleClick={() => setEditScreenVisible(false)}
                  >
                    高级搜索
                  </Button>
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
            <Spin size="large" spinning={infoLoading}>
              <div>
                <ChartCaseList data={logHistormData} loading={infoLoading} hitsData={hitInfo} />
              </div>
            </Spin>
            <div>
              <div
                id="scrollableDiv"
                style={{
                  height: 940,
                  overflow: 'auto',
                  padding: '0 16px',
                  border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
              >
                <Spin spinning={infoLoading}>
                  <InfiniteScroll
                    dataLength={vivelogSearchTabInfo?.length || 0}
                    next={ScrollMore}
                    hasMore={vivelogSearchTabInfo?.length < 500}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                  >
                    <List
                      dataSource={vivelogSearchTabInfo}
                      loading={srollLoading}
                      renderItem={(item: any, index) => (
                        <List.Item key={index}>
                          <Collapse onChange={callback}>
                            {
                              <Panel
                                className="panelInfo"
                                style={{ whiteSpace: 'pre-line', lineHeight: 2, fontSize: 14, wordBreak: 'break-word' }}
                                header={
                                  <div style={{ display: 'flex' }}>
                                    <div style={{ width: '20%', color: '#6495ED' }}>{item?._source['@timestamp']}</div>
                                    {/* <div style={{ width: '85%' }}>{JSON.stringify(item?._source)}</div> */}
                                    <div style={{ width: '80%' }}>
                                      {ansi_up.ansi_to_html(JSON.stringify(item?._source))}
                                    </div>
                                  </div>
                                }
                                key={index}
                              >
                                <Tabs defaultActiveKey="1" onChange={callback}>
                                  <TabPane tab="表" key="1">
                                    <div style={{ marginLeft: 14 }}>
                                      <p className="tab-header">
                                        <span className="tab-left">@timestamp:</span>
                                        <span className="tab-right">{item?._source['@timestamp']}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">@version:</span>
                                        <span className="tab-right">{item?._source['@version']}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_id:</span>
                                        <span className="tab-right">{item?._id}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_index:</span>
                                        <span className="tab-right">{item?._index}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_score:</span>
                                        <span className="tab-right">{item?._score}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_type:</span>
                                        <span className="tab-right">{item?._type}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">appCode:</span>
                                        <span className="tab-right">{item?._source?.appCode}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">envCode:</span>
                                        <span className="tab-right">{item?._source?.envCode}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">hostName:</span>
                                        <span className="tab-right">{item?._source?.hostName}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">log:</span>
                                        <span className="tab-right">{item?._source?.log}</span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">tags:</span>
                                        <span className="tab-right">{item?._source?.tags[0]}</span>
                                      </p>
                                    </div>
                                  </TabPane>
                                  <TabPane tab="JSON" key="2">
                                    <ReactJson src={item} name={false} />
                                  </TabPane>
                                </Tabs>
                              </Panel>
                            }
                          </Collapse>
                        </List.Item>
                      )}
                    />
                  </InfiniteScroll>
                </Spin>
              </div>
            </div>
          </div>
        ) : null}
      </ContentCard>
    </PageContainer>
  );
}
