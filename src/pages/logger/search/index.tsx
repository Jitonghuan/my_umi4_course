import React, { useState, useLayoutEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Input,
  Spin,
  DatePicker,
  TimePicker,
  Collapse,
  Popover,
  List,
  message,
  Skeleton,
  Divider,
  Tabs,
} from 'antd';
import ChartCaseList from './LogHistorm';
import ReactJson from 'react-json-view';
import { history, useLocation } from 'umi';
import { parse } from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as APIS from './service';
import _ from 'lodash';
import { postRequest } from '@/utils/request';
import { QuestionCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions, useIndexModeList } from './hooks';
import SourceMapModal from "@/pages/fe-monitor/basic/components/error/components/source-map";
import { START_TIME_ENUMS, selectOption } from './type';
import moment from 'moment';
import './index.less';

export default function LoggerSearch(props: any) {
  const [sourceMapVisible, setSourceMapVisible] = useState<boolean>(false)
  const [sourceInfo, setSourceInfo] = useState<any>({})
  let location: any = useLocation();
  const query: any = parse(location.search);
  const receiveInfo = query;
  const showWindowHref = () => {
    var sHref = window.location.href;
    var args = sHref.split('?');
    if (args[0] == sHref) {
      return '';
    }
    var arr = args[1].split('&');
    var obj: any = {};
    for (var i = 0; i < arr.length; i++) {
      var arg = arr[i].split('=');
      obj[arg[0]] = arg[1];
    }
    return obj;
  };
  const messageInfo = showWindowHref();
  const { TabPane } = Tabs;
  const { Search } = Input;
  const { Panel } = Collapse;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [subInfoForm] = Form.useForm();
  const [sqlForm] = Form.useForm();
  const [rangePickerForm] = Form.useForm();
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(5 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = ((receiveInfo.startTime ? new Date(receiveInfo.startTime).getTime() : now - startTime) / 1000).toString();
  let end = ((receiveInfo.endTime ? new Date(receiveInfo.endTime).getTime() : now) / 1000).toString();
  if (receiveInfo.startTime || receiveInfo.endTime) {
    rangePickerForm.setFieldsValue({ rangeDate: [moment(start, 'X'), moment(end, 'X')] });
  }
  

  const [stowCondition, setStowCondition] = useState<boolean>(false);
  const [logHistormData, setLogHistormData] = useState<any>([]); //柱状图图表数据
  const [logSearchTableInfo, setLogSearchTableInfo] = useState<any>([]); //手风琴下拉框数据 hits
  const [viewLogSearchTabInfo, setViewlogSeaechTabInfo] = useState<any>(); //手风琴展示数据
  const [hitInfo, setHitInfo] = useState<string>(''); //命中次数
  const [envCode, setEnvCode] = useState<string>(''); //环境envcode选择
  const [logStore, setLogStore] = useState<string>(); //日志库选择
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  const [startRangePicker, setStartRangePicker] = useState<any>(start);
  const [endRangePicker, setEndRangePicker] = useState<any>(end);
  const [querySql, setQuerySql] = useState<string>(''); //querySql选择
  const [podName, setPodName] = useState<string>(''); //podName
  const [appCodeValue, setAppCodeValue] = useState<any[]>([]); //appCode
  const [messageValue, setMessageValue] = useState<string>(''); //message
  const [srollLoading, setScrollLoading] = useState(false); //无限下拉loading
  const [infoLoading, setInfoLoading] = useState(false); //日志检索信息loading
  const [editScreenVisible, setEditScreenVisible] = useState<boolean>(false); //是否展示lucene语法输入框
  const [envOptions] = useEnvOptions(); //环境下拉框选项数据
  const defaultSelectValue = receiveInfo.startTime ? 'rangePicker' : 'lastTime';
  const [selectOptionType, setSelectOptionType] = useState<string>(defaultSelectValue);
  const [logStoreOptions] = useLogStoreOptions(envCode); //日志库选项下拉框数据
  const [queryIndexModeList, indexModeData, setIndexModeData] = useIndexModeList(); //获取字段列表  indexModeList

  useLayoutEffect(() => {
    if (Object.keys(receiveInfo).length !== 0) {
      setStartTime(30 * 60 * 1000);
      const now = new Date().getTime();
      let defaultInterval = 30 * 60 * 1000;
      let start = Number((now - defaultInterval) / 1000).toString();
      let end = Number(now / 1000).toString();
      setEnvCode(receiveInfo.envCode);
      setLogStore(receiveInfo.indexMode);
      let appCodeArry = [];
      if (receiveInfo.envCode) {
        setEnvCode(receiveInfo.envCode);
        appCodeArry.push('envCode:' + receiveInfo.envCode);
      }
      setLogStore(receiveInfo.indexMode || 'app_log');
      if (messageInfo['message']) {
        let messageDecodedData = decodeURIComponent(escape(window.atob(messageInfo['message'])));
        setQuerySql(messageDecodedData);
        sqlForm.setFieldsValue({
          querySql: messageDecodedData,
        });
      }
      if (receiveInfo.traceId) {
        subInfoForm.setFieldsValue({ traceId: receiveInfo.traceId });
        appCodeArry.push('traceId:' + receiveInfo.traceId);
        setAppCodeValue(appCodeArry);
      }
      if (receiveInfo.appCode && receiveInfo.indexMode !== 'frontend_log') {
        appCodeArry.push('appCode:' + receiveInfo.appCode);
        setAppCodeValue(appCodeArry);
        subInfoForm.setFieldsValue({
          appCode: receiveInfo.appCode,
        });
      }
      setEditScreenVisible(true);
      loadMoreData(receiveInfo.indexMode, start, end, sqlForm.getFieldValue('querySql'), messageValue, appCodeArry);
    }
  }, []);
  useLayoutEffect(() => {
    if (!envCode || !logStore) {
      return;
    }
    let info = subInfoForm.getFieldsValue();
    if (!info) {
      message.info('请输入筛选条件进行查询哦～');
    }
  }, [logStore]);

  //使用lucene语法搜索时的事件
  const onSearch = () => {
    let values = sqlForm.getFieldsValue();
    let params = subInfoForm.getFieldsValue();
    let podNameInfo = params?.podName;
    let messageInfo = params?.message;
    let appCodeValue = params?.appCode;
    let appCodeArry = [];
    if (appCodeValue) {
      appCodeArry.push('appCode:' + appCodeValue);
    }
    if (podNameInfo) {
      appCodeArry.push('podName:' + podNameInfo);
    }
    if (params?.traceId) {
      appCodeArry.push('traceId:' + params?.traceId);
    }
    if (params?.level) {
      appCodeArry.push('level:' + params?.level);
    }
    appCodeArry.push('envCode:' + envCode);

    setQuerySql(values.querySql);
    const now = new Date().getTime();
    //默认传最近30分钟，处理为秒级的时间戳
    let start = Number((now - startTime) / 1000).toString();
    let end = Number(now / 1000).toString();
    if (selectOptionType === 'lastTime') {
      setStartTimestamp(start);
      setEndTimestamp(end);
      loadMoreData(logStore, start, end, values.querySql, messageInfo, appCodeArry);
    } else {
      loadMoreData(logStore, startRangePicker, endRangePicker, values.querySql, messageInfo, appCodeArry);
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
    setIndexModeData([]);
    setHitInfo('');
    setLogSearchTableInfo([]);
    setLogHistormData([]);
    setViewlogSeaechTabInfo([]);
  };

  const callback = (key: any) => { };

  let fiterArry: any = [];
  fiterArry.push('envCode:' + envCode);
  //查询
  const submitEditScreen = () => {
    if (editScreenVisible) {
      onSearch();
    } else {
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
      if (params?.traceId) {
        appCodeArry.push('traceId:' + params?.traceId);
      }
      if (params?.level) {
        appCodeArry.push('level:' + params?.level);
      }
      appCodeArry.push('envCode:' + envCode);
      setAppCodeValue(appCodeArry);
      const now = new Date().getTime();
      //默认传最近5分钟，处理为秒级的时间戳
      let start = Number((now - startTime) / 1000).toString();
      let end = Number(now / 1000).toString();
      if (selectOptionType === 'lastTime') {
        setStartTimestamp(start);
        setEndTimestamp(end);
        loadMoreData(logStore, start, end, querySql, messageInfo, appCodeArry);
      } else if (selectOptionType === "rangePicker") {
        loadMoreData(logStore, startRangePicker, endRangePicker, querySql, messageInfo, appCodeArry);
      } else {
        loadMoreData(logStore, startTimestamp, endTimestamp, querySql, messageInfo, appCodeArry);
      }
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
        envCode: envCode || receiveInfo.envCode,
      },
    })
      .then((resp) => {
        if (resp?.success) {
          //柱状图数据 buckets
          let logHistorm = resp?.data?.histograms;
          // setLogHistormData;
          setLogHistormData(logHistorm);
          //手风琴下拉框数据 hits
          let logSearchTableInfodata = resp.data.logs;
          let viewLogSearchTabInfo = logSearchTableInfodata.splice(0, 20);
        
          setLogSearchTableInfo(logSearchTableInfodata);
          let newArryData: any = []
          let mapArry = viewLogSearchTabInfo?.slice(0)
          mapArry?.map((element: any) => {
            let newInfo = Object.assign({}, element)
            if (element.hasOwnProperty("traceId")) {
              let objItem = Object.assign({ traceId: newInfo["traceId"] }, _.omit(element, ["traceId"]))
              newArryData.push(objItem)
            } else {
              newArryData.push(element)
            }
          })



          setViewlogSeaechTabInfo(newArryData);
          //命中率
          let hitNumber = resp.data.total;
          setHitInfo(hitNumber);
          // setLoading(false);
          //setInfoLoading(false);
        }
      })
      .catch(() => {
        // setLoading(false);
        // setInfoLoading(false);
      })
      .finally(() => {
        setInfoLoading(false);
      });
  };

  //切换日志库
  const chooseIndexMode = (n: any) => {
    setLogStore(n);
    //subInfoForm.resetFields();
    setIndexModeData([]);
    setHitInfo('');
    setLogSearchTableInfo([]);
    setLogHistormData([]);
    setViewlogSeaechTabInfo([]);
  };

  //重置筛选信息
  const resetQueryInfo = () => {
    subInfoForm.resetFields();
    setQuerySql('');
    setEditScreenVisible(false);
    setAppCodeValue([]);
    setMessageValue('');
    setPodName('');
    const now = new Date().getTime();
    //submitEditScreen()
   
    loadMoreData(logStore, startTimestamp, endTimestamp, '', '');

  };
  // 无限滚动下拉事件
  const ScrollMore = () => {
    setScrollLoading(true);

    setTimeout(() => {
      let moreList = logSearchTableInfo?.splice(0, 20) || [];
      let vivelist = viewLogSearchTabInfo.concat(moreList);
      setViewlogSeaechTabInfo(vivelist);
      setScrollLoading(false);
    }, 800);
  };

  const getSelectOption = (type: string) => {
    setSelectOptionType(type);
    if (type === 'lastTime') {
      const now = new Date().getTime();
      let startTimepl = Number((now - startTime) / 1000).toString();
      let endTimepl = Number(now / 1000).toString();
      setStartTimestamp(startTimepl);
      setEndTimestamp(endTimepl);
      loadMoreData(logStore, startTimepl, endTimepl, querySql, messageValue, appCodeValue);
    } else {
      setStartRangePicker('');
      setEndRangePicker('');
    }
  };


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
                  allowClear
                  showSearch
                />
              </Form.Item>
              <Form.Item label="日志库">
                <Select
                  value={logStore}
                  onChange={chooseIndexMode}
                  options={logStoreOptions}
                  style={{ width: 140 }}
                  placeholder="请选择日志库"
                  allowClear
                  showSearch
                />
              </Form.Item>
            </Form>
          </div>
          <div className="caption-right">
            {envCode && logStore ? (
              <>
                <Select options={selectOption} onChange={getSelectOption} value={selectOptionType} />
                {selectOptionType === 'rangePicker' ? (
                  <Form form={rangePickerForm}>
                    <Form.Item name="rangeDate" noStyle>
                      <RangePicker
                        allowClear
                        style={{ width: 360 }}
                        onChange={(v: any, b: any) => selectTime(v, b)}
                        // onChange={()=>selectTime}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                      />
                    </Form.Item>
                  </Form>
                ) : (
                  <Select value={startTime} onChange={selectRelativeTime} style={{ width: 140 }}>
                    <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                    {START_TIME_ENUMS.map((time) => (
                      <Select.Option key={time.value} value={time.value}>
                        {time.label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </>
            ) : null}
          </div>
        </div>
      </FilterCard>
      <ContentCard className="page-logger-search-content">
        {/* {!envCode && !logStore ? <div className="empty-holder">请选择环境和日志库</div> : null} */}
        {/* {envCode && logStore ? ( */}
        <div>
          <div style={{ marginBottom: 10, width: '100%' }}>
            <div>
              <Form form={subInfoForm} layout="inline" labelCol={{ flex: 4 }}>
                <p style={{ display: 'flex', width: '100%', marginBottom: 0 }}>
                  <Form.Item label="appCode" name="appCode">
                    <Input style={{ width: '11vw' }}></Input>
                  </Form.Item>
                  <Form.Item label="podName" name="podName">
                    <Input style={{ width: '14vw' }}></Input>
                  </Form.Item>

                  {/* <Form.Item label="level" name="level">
                    <Input style={{ width: '11vw' }}></Input>
                  </Form.Item> */}
                  <Form.Item label="traceId" name="traceId">
                    <Input style={{ width: '36vw' }} placeholder="单行输入"></Input>
                  </Form.Item>
                </p>

                <p className={editScreenVisible ? 'message-input-lucene' : 'message-input'}>
                  <Form.Item label="message" name="message">
                    <Input style={{ width: '28vw' }} placeholder="仅支持精准匹配"></Input>
                  </Form.Item>
                </p>

                {editScreenVisible === true ? (
                  <p>
                    <Form form={sqlForm} layout="inline">
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
                      <Form.Item name="querySql">
                        <Input
                          placeholder="搜索"
                          style={{ width: 758 }}
                          onPressEnter={submitEditScreen}
                        />
                      </Form.Item>
                      <Form.Item name="moreInput">
                        <Input placeholder="搜索" className="moreInput" style={{ width: 0 }} />
                      </Form.Item>
                    </Form>
                  </p>
                ) : null}

                <Form.Item>
                  <Button htmlType="submit" type="primary" disabled={!envCode || !logStore} onClick={submitEditScreen}>
                    查询
                    </Button>
                </Form.Item>
                <Button type="default" style={{ marginLeft: 2 }} disabled={!envCode || !logStore} onClick={resetQueryInfo} >
                  重置
                  </Button>
                {/* <span style={{ paddingLeft: 10, display: 'flex', alignItems: 'center' }}>
                    <a
                      onClick={() => {
                        if (showMore) {
                          setShowMore(false);
                        } else {
                          setShowMore(true);
                        }
                      }}
                    >
                      {showMore ? '收起更多条件' : '更多查询条件...'}
                    </a>
                  </span> */}

                <Button
                  type="primary"
                  style={{ marginLeft: '2vw' }}
                  onClick={() => {
                    // subInfoForm.resetFields();
                    if (!editScreenVisible) {
                      setEditScreenVisible(true);
                    } else {
                      setEditScreenVisible(false);
                      setQuerySql('');
                    }
                  }}

                >
                  高级搜索
                  </Button>
              </Form>
            </div>
          </div>
          <div className="close-button">
            <a
              onClick={() => {
                if (stowCondition) {
                  setStowCondition(false);
                } else {
                  setStowCondition(true);
                }
              }}
            >
              {stowCondition ? '收起命中图表' : '展开命中图表'}
              {stowCondition ? <UpOutlined /> : <DownOutlined />}
            </a>
          </div>
          <Divider style={{ height: 6, marginTop: 0, marginBottom: 0 }} />
          {stowCondition && (
            <Spin size="large" spinning={infoLoading}>
              <div style={{ marginBottom: 4 }}>
                <ChartCaseList data={logHistormData} loading={infoLoading} hitsData={hitInfo} />
              </div>
            </Spin>
          )}

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
                  dataLength={viewLogSearchTabInfo?.length || 0}
                  next={ScrollMore}
                  hasMore={viewLogSearchTabInfo?.length < 500}
                  loader={<Skeleton paragraph={{ rows: 1 }} />}
                  endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    dataSource={viewLogSearchTabInfo}
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
                                  <div style={{ width: '14%', color: '#6495ED' }}>
                                    {moment(item?.['__time__'] * 1000).format('YYYY-MM-DD,HH:mm:ss')}
                                  </div>
                                  <div
                                    style={{ width: '86%', fontSize: 10 }}
                                    dangerouslySetInnerHTML={{ __html: `${JSON.stringify(item)}` }}
                                    className="detailInfo"
                                  />
                                </div>
                              }
                              key={index}
                            >
                              <Tabs defaultActiveKey="1"
                                onChange={callback}
                                tabBarExtraContent={{
                                  right: logStore === 'frontend_log' ? (
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        setSourceInfo({
                                          ...item,
                                          filePath: item.d2,
                                          envCode
                                        });
                                        setSourceMapVisible(true);
                                      }}
                                    >sourceMap 还原</Button>) : null
                                }}
                              >
                                <TabPane tab="表" key="1">

                                  {Object.keys(item)?.map((key: any) => {
                                    return (key === 'traceId' ? (
                                      <p className="tab-header">
                                        <span className="tab-left">traceId:</span>
                                        <span
                                          className="tab-right"

                                        >
                                          {item?.[key]?.includes('span') ? <a dangerouslySetInnerHTML={{ __html: item?.[key] }}
                                            onClick={() => {
                                              var doc: any = new DOMParser().parseFromString(item?.[key], "text/html");              
                                              history.push({
                                                pathname: "/matrix/trafficmap/tracking"

                                              }, {
                                                entry: "logSearch",
                                                envCode: envCode,
                                                // appCode:subInfoForm.getFieldValue("appCode")||item?.appCode,
                                                traceId: doc.body.innerText,
                                                startTime: startTimestamp,
                                                endTime: endTimestamp
                                              })
                                            }} >


                                          </a>


                                            : <a onClick={() => {
                                              history.push({
                                                pathname: "/matrix/trafficmap/tracking"

                                              }, {
                                                entry: "logSearch",
                                                envCode: envCode,
                                                // appCode:subInfoForm.getFieldValue("appCode")||item?.appCode,
                                                traceId: item?.traceId,
                                                startTime: startTimestamp,
                                                endTime: endTimestamp
                                              })
                                            }}>
                                              {item?.[key]}
                                            </a>}

                                        </span>

                                      </p>
                                    ) : key === '@timestamp' ? (
                                      <p className="tab-header">
                                        <span className="tab-left">@timestamp:</span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{
                                            __html: moment(item?.['@timestamp']).format('YYYY-MM-DD,HH:mm:ss'),
                                          }}
                                        ></span>
                                      </p>
                                    ) : key === '__time__' ? (
                                      <p className="tab-header">
                                        <span className="tab-left">time:</span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{
                                            __html: moment(item?.['__time__'] * 1000).format('YYYY-MM-DD,HH:mm:ss'),
                                          }}
                                        ></span>
                                      </p>
                                    ) : (
                                      <p className="tab-header">
                                        <span
                                          className="tab-left"
                                          dangerouslySetInnerHTML={{ __html: `${key}:` }}
                                        ></span>
                                        <span
                                          className="tab-right"
                                          dangerouslySetInnerHTML={{
                                            __html: item?.[key],
                                          }}
                                        ></span>
                                      </p>
                                    ))
                                  })}
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
          <SourceMapModal
            visible={sourceMapVisible}
            onClose={() => setSourceMapVisible(false)}
            param={sourceInfo}
          />
        </div>
        {/* ) : null} */}
      </ContentCard>
    </PageContainer>
  );
}
