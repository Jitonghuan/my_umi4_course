import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
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
import { postRequest, getRequest } from '@/utils/request';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useFrameUrl, useIndexModeList } from './hooks';
import moment from 'moment';
import './index.less';
// 时间枚举
export const START_TIME_ENUMS = [
  {
    label: 'Last 15 minutes',
    value: 15 * 60 * 1000,
  },
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
  const [rangePickerForm] = Form.useForm();
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(15 * 60 * 1000);
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
  const [startRangePicker, setStartRangePicker] = useState<any>();
  const [endRangePicker, setEndRangePicker] = useState<any>();
  const [querySql, setQuerySql] = useState<string>(''); //querySql选择
  const [podName, setPodName] = useState<string>(''); //podName
  const [appCodeValue, setAppCodeValue] = useState<any[]>([]); //appCode
  const [messageValue, setMessageValue] = useState<string>(''); //message
  const [srollLoading, setScrollLoading] = useState(false); //无限下拉loading
  const [infoLoading, setInfoLoading] = useState(false); //日志检索信息loading
  const [editScreenVisible, setEditScreenVisible] = useState<boolean>(false); //是否展示lucene语法输入框
  const [editConditionType, setEditConditionType] = useState<boolean>(false); //使用高级搜索时禁用筛选条件输入
  const [envOptions] = useEnvOptions(); //环境下拉框选项数据
  const [logStoreOptions] = useLogStoreOptions(envCode); //日志库选项下拉框数据
  // const [frameUrl, urlLoading, logType] = useFrameUrl(envCode, logStore);
  const [frameUrl, setFrameUrl] = useState<string>('');
  const [logType, setLogType] = useState<string>('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [queryIndexModeList, indexModeData, setIndexModeData] = useIndexModeList(); //获取字段列表  indexModeList
  const [framePending, setFramePending] = useState(false);
  const timmerRef = useRef<any>();
  const frameRef = useRef<any>();
  let urlType = '';
  var iframe = document.createElement('iframe');
  useLayoutEffect(() => {
    if (!envCode || !logStore) {
      setUrlLoading(false);
      setFrameUrl('');
      return;
    }
    setUrlLoading(true);
    getRequest(APIS.getSearchUrl, {
      data: { envCode, logStore },
    })
      .then((result) => {
        if (result.success) {
          if (result.data.logType === '1') {
            setFrameUrl(result.data.url || '');
            setLogType('1');
            urlType = '1';
          } else {
            setLogType('0');
            urlType = '0';
          }
          queryIndexModeList(envCode, logStore)
            .then(() => {
              if (urlType === '0') {
                loadMoreData(logStore, startTimestamp, endTimestamp);
              }
            })
            .catch(() => {
              setIndexModeData([]);
              setHitInfo('');
              setLogSearchTableInfo('');
              setLogHistormData('');
            });
        }
      })
      .finally(() => {});
  }, [logStore]);
  useEffect(() => {
    if (logType === '1') {
      setFramePending(!!frameUrl);
    }
  }, [frameUrl]);
  //使用lucene语法搜索时的事件
  const onSearch = (values: any) => {
    subInfoForm.resetFields();
    setQuerySql(values);
    const now = new Date().getTime();
    //默认传最近30分钟，处理为秒级的时间戳
    let start = Number((now - startTime) / 1000).toString();
    let end = Number(now / 1000).toString();
    if (startTimestamp !== start) {
      setStartTimestamp(start);
      setEndTimestamp(end);

      loadMoreData(logStore, start, end, values, messageValue, appCodeValue);
    } else {
      loadMoreData(logStore, startTimestamp, endTimestamp, values, messageValue, appCodeValue);
    }
  };

  //选择时间间隔
  const selectTime = (time: any, timeString: string) => {
    let start = moment(timeString[0]).unix().toString();
    let end = moment(timeString[1]).unix().toString();
    if (start !== 'NaN' && end !== 'NaN') {
      setStartRangePicker(start);
      setEndRangePicker(end);
      loadMoreData(logStore, start, end, querySql, messageValue, appCodeValue);
    } else {
      loadMoreData(logStore, startTimestamp, endTimestamp, querySql, messageValue, appCodeValue);
    }
  };

  // 选择就近时间触发的事件
  const selectRelativeTime = (value: any) => {
    rangePickerForm.resetFields();
    setStartRangePicker('');
    setEndRangePicker('');

    const now = new Date().getTime();
    setStartTime(value);
    let startTimepl = Number((now - value) / 1000).toString();
    let endTimepl = Number(now / 1000).toString();
    setStartTimestamp(startTimepl);
    setEndTimestamp(endTimepl);
    loadMoreData(logStore, startTimepl, endTimepl, querySql, messageValue, appCodeValue);
  };
  //选择环境事件
  const handleEnvCodeChange = (next: string) => {
    setEnvCode(next);
    setLogStore(undefined);
  };

  const callback = (key: any) => {};
  const handleFrameComplete = () => {
    setUrlLoading(false);
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
  let fiterArry: any = [];
  fiterArry.push('envCode:' + envCode);
  //查询
  const submitEditScreen = () => {
    let params = subInfoForm.getFieldsValue();
    let podNameInfo = params?.podName;
    // let querySqlInfo = params?.message;
    let messageInfo = params?.message;
    let appCodeValue = params?.appCode;
    setMessageValue(messageInfo);
    // setQuerySql(querySqlInfo);
    setPodName(podNameInfo);
    let appCodeArry = [];
    if (appCodeValue) {
      appCodeArry.push('appCode:' + appCodeValue);
    }
    if (podNameInfo) {
      appCodeArry.push('podName:' + podNameInfo);
    }
    appCodeArry.push('envCode:' + envCode);
    setAppCodeValue(appCodeArry);
    const now = new Date().getTime();
    //默认传最近30分钟，处理为秒级的时间戳
    let start = Number((now - startTime) / 1000).toString();
    let end = Number(now / 1000).toString();

    if (startTimestamp !== start && !startRangePicker && !endRangePicker) {
      setStartTimestamp(start);
      setEndTimestamp(end);
      loadMoreData(logStore, start, end, querySql, messageInfo, appCodeArry);
    } else if (startRangePicker || endRangePicker) {
      loadMoreData(logStore, startRangePicker, endRangePicker, querySql, messageInfo, appCodeArry);
    } else {
      loadMoreData(logStore, startTimestamp, endTimestamp, querySql, messageInfo, appCodeArry);
    }
  };

  //接收参数：日志库选择logStore,日期开始时间，日期结束时间，querySql,运算符为是（filterIs）,运算符为否（filterNot）,环境Code（envCode）
  const loadMoreData = (
    n: any = logStore,
    startTimeParam?: string,
    endTimeParam?: string,
    querySqlParam?: string,
    // podNameParam?: string,
    messageParam?: any,
    appCodeParam?: any,
  ) => {
    // setLoading(true);
    setInfoLoading(true);
    postRequest(APIS.logSearch, {
      data: {
        indexMode: n,
        startTime: startTimeParam || startTimestamp,
        endTime: endTimeParam || endTimestamp,
        querySql: querySqlParam || '',
        // podName: podNameParam || '',
        message: messageParam || '',
        filterIs: appCodeParam || fiterArry || [],
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

  //切换日志库
  const chooseIndexMode = (n: any) => {
    setLogStore(n);
    subInfoForm.resetFields();
  };

  //重置筛选信息
  const resetQueryInfo = () => {
    subInfoForm.resetFields();
    setAppCodeValue([]);
    // setQuerySql('');
    setMessageValue('');
    setPodName('');
    const now = new Date().getTime();
    //默认传最近30分钟，处理为秒级的时间戳
    let start = Number((now - startTime) / 1000).toString();
    let end = Number(now / 1000).toString();
    if (startTimestamp !== start) {
      setStartTimestamp(start);
      setEndTimestamp(end);
      loadMoreData(logStore, start, end, querySql, '');
    } else {
      loadMoreData(logStore, startTimestamp, endTimestamp, querySql, '');
    }
  };
  // 无限滚动下拉事件
  const ScrollMore = () => {
    setScrollLoading(true);

    setTimeout(() => {
      let moreList = logSearchTableInfo.splice(0, 20);
      let vivelist = vivelogSearchTabInfo.concat(moreList);
      setVivelogSeaechTabInfo(vivelist);
      setScrollLoading(false);
    }, 1800);
  };
  // let html =ansi_up.ansi_to_html(JSON.stringify(vivelogSearchTabInfo));
  // var scrollableDiv= document.getElementById("scrollableDiv"); //statusLog 即是页面需要展示内容的div
  // if(scrollableDiv){
  //   scrollableDiv.innerHTML=html
  // }

  //实现无限加载滚动
  return (
    <PageContainer className="content">
      <FilterCard>
        <div className="table-caption">
          <div className="caption-left">
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
          </div>
          <div className="caption-right">
            {logType === '0' && envCode && logStore ? (
              <div>
                <Form form={rangePickerForm}>
                  <Form.Item name="rangeDate" noStyle>
                    <RangePicker
                      allowClear
                      style={{ width: 200 }}
                      onChange={(v: any, b: any) => selectTime(v, b)}
                      // onChange={()=>selectTime}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                      }}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </Form.Item>
                  <Select value={startTime} onChange={selectRelativeTime} style={{ width: 140 }}>
                    <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                    {START_TIME_ENUMS.map((time) => (
                      <Select.Option key={time.value} value={time.value}>
                        {time.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form>
              </div>
            ) : null}
          </div>
        </div>
      </FilterCard>
      <ContentCard className="page-logger-search-content">
        {logType === '1' && (urlLoading || framePending) ? (
          <div className="loading-wrapper">
            <Spin tip="加载中" spinning={urlLoading} />
          </div>
        ) : null}
        {/* {urlLoading?  <div className="loading-wrapper">
            <Spin tip="加载中" spinning={urlLoading} />
          </div>:null} */}

        {/* {(logType==="1")&&!urlLoading && (!envCode || !logStore) ? <div className="empty-holder">请选择环境和日志库</div> : null} */}

        {logType === '1' && !urlLoading && envCode && logStore && !frameUrl ? (
          <div className="empty-holder">未找到日志检索页面</div>
        ) : null}

        {logType === '1' && frameUrl ? (
          <iframe onLoad={handleFrameComplete} src={frameUrl} frameBorder="0" ref={frameRef} />
        ) : null}

        {!envCode && !logStore ? <div className="empty-holder">请选择环境和日志库</div> : null}

        {logType === '0' && envCode && logStore ? (
          <div>
            <div style={{ marginBottom: 18, width: '100%' }}>
              <div>
                <Form form={subInfoForm} layout="inline" labelCol={{ flex: 4 }}>
                  <Form.Item label="appCode" name="appCode">
                    <Input style={{ width: 120 }} disabled={editConditionType}></Input>
                  </Form.Item>
                  <Form.Item label="podName" name="podName">
                    <Input style={{ width: 140 }} disabled={editConditionType}></Input>
                  </Form.Item>
                  <Form.Item label="message" name="message">
                    <Input style={{ width: 300 }} placeholder="单行输入" disabled={editConditionType}></Input>
                  </Form.Item>

                  <Form.Item>
                    <Button htmlType="submit" type="primary" onClick={submitEditScreen}>
                      查询
                    </Button>
                  </Form.Item>
                  <Button type="default" style={{ marginLeft: 2 }} onClick={resetQueryInfo}>
                    重置
                  </Button>

                  <Button
                    type="primary"
                    style={{ marginLeft: '8vw' }}
                    onClick={() => {
                      subInfoForm.resetFields();
                      // setTurnOnButton(true)
                      if (!editScreenVisible) {
                        setEditScreenVisible(true);
                        setEditConditionType(true);
                      } else {
                        setEditScreenVisible(false);
                        setEditConditionType(false);
                      }

                      setQuerySql('');
                      setMessageValue('');
                      setPodName('');
                      setAppCodeValue([]);
                    }}
                  >
                    高级搜索
                  </Button>
                  {/* <span style={{color: '#708090' }}>双击关闭</span> */}
                </Form>
              </div>

              <div style={{ marginTop: 4, width: '100%' }}>
                {editScreenVisible === true ? (
                  <div style={{ marginTop: 4 }}>
                    <Divider />
                    <Popover
                      title="查看lucene语法"
                      placement="topLeft"
                      content={
                        <a
                          target="_blank"
                          href="https://lucene.apache.org/core/8_5_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html"
                        >
                          lucene语法网址
                        </a>
                      }
                    >
                      <Button>
                        lucene
                        <QuestionCircleOutlined />
                      </Button>
                    </Popover>
                    <Search placeholder="搜索" allowClear onSearch={onSearch} style={{ width: 758 }} />
                  </div>
                ) : null}
              </div>
            </div>
            <Divider style={{ height: 10, marginTop: 0, marginBottom: 0 }} />
            <Spin size="large" spinning={infoLoading}>
              <div style={{ marginBottom: 4 }}>
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
                                  <div style={{ display: 'flex', maxHeight: 138, overflow: 'hidden' }}>
                                    <div style={{ width: '20%', color: '#6495ED' }}>
                                      {moment(item?._source['@timestamp']).format('YYYY-MM-DD,HH:mm:ss')}
                                    </div>
                                    {/* <div style={{ width: '85%' }}>{JSON.stringify(item?._source)}</div> */}
                                    <div
                                      style={{ width: '80%' }}
                                      dangerouslySetInnerHTML={{ __html: JSON.stringify(item?._source) }}
                                    >
                                      {/* {ansi_up.ansi_to_html(JSON.stringify(item?._source))} */}
                                    </div>
                                  </div>
                                }
                                key={index}
                              >
                                <Tabs defaultActiveKey="1" onChange={callback}>
                                  <TabPane tab="表" key="1">
                                    <div style={{ marginLeft: 14 }}>
                                      {Object.keys(item?._source).map((key: any) => {
                                        return (
                                          <p className="tab-header">
                                            <span
                                              className="tab-left"
                                              dangerouslySetInnerHTML={{ __html: `${key}:` }}
                                            ></span>
                                            <span
                                              className="tab-right"
                                              dangerouslySetInnerHTML={{ __html: JSON.stringify(item?._source[key]) }}
                                            ></span>
                                          </p>
                                        );
                                      })}
                                      <p className="tab-header">
                                        <span className="tab-left">_id:</span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{ __html: item?._id }}
                                        ></span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_index:</span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{ __html: item?._index }}
                                        ></span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_score:</span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{ __html: item?._score }}
                                        ></span>
                                      </p>
                                      <p className="tab-header">
                                        <span className="tab-left">_type:</span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{ __html: item?._type }}
                                        ></span>
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
