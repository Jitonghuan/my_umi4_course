import React, {useEffect, useState} from 'react';
import {
  Form,
  Select,
  Button,
  Input,
  Spin,
  DatePicker,
  Collapse,
  Popover,
  List,
  Skeleton,
  Divider,
  Tabs,
} from 'antd';
import ChartCaseList from './LogHistorm';
import ReactJson from 'react-json-view';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as APIS from './service';
import { postRequest } from '@/utils/request';
import { QuestionCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEnvOptions, useLogStoreOptions } from './hooks';
import { START_TIME_ENUMS, selectOption } from './type';
import moment from 'moment';
import './index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

export default function LoggerSearch(props: any) {
  const { initData } = props;
  const [querySql, setQuerySql] = useState<string>(initData.expression || '');
  const [selectOptionType, setSelectOptionType] = useState<string>('lastTime');
  const [timeRange, setTimeRange] = useState<any>(START_TIME_ENUMS[3].value);
  const [latestTimeI, setLatestTimeI] = useState(3);

  const [stowCondition, setStowCondition] = useState<boolean>(false);
  const [logHistormData, setLogHistormData] = useState<any>([]); //柱状图图表数据
  const [logSearchTableInfo, setLogSearchTableInfo] = useState<any>(); //手风琴下拉框数据 hits
  const [viewLogSearchTabInfo, setViewlogSeaechTabInfo] = useState<any>(); //手风琴展示数据
  const [hitInfo, setHitInfo] = useState<string>(''); //命中次数
  const [envCode, setEnvCode] = useState<string>(initData.envCode || ''); //环境envcode选择
  const [logStore, setLogStore] = useState<string>(initData.index || ''); //日志库选择
  const [srollLoading, setScrollLoading] = useState(false); //无限下拉loading
  const [infoLoading, setInfoLoading] = useState(false); //日志检索信息loading
  const [envOptions] = useEnvOptions(); //环境下拉框选项数据

  const [logStoreOptions] = useLogStoreOptions(envCode); //日志库选项下拉框数据

  useEffect(() => {
    setEnvCode(initData.envCode);
    setQuerySql(initData.expression);
    setLogStore(initData.index);
    loadMoreData({
      envCode: initData.envCode,
      indexMode: initData.index,
      querySql: initData.expression
    });
  }, [initData])

  // 时间改变
  const onTimeChange = (value: any) => {
    setTimeRange(value);
    loadMoreData({
      startTime: value && value[0] ? moment(value[0]).unix() + '' : null,
      endTime: value && value[1] ? moment(value[1]).unix() + '' : null,
    });
  };

  // 选择环境事件
  const handleEnvCodeChange = (next: string) => {
    setEnvCode(next);
    setLogStore('');
    setHitInfo('');
    setLogSearchTableInfo('');
    setLogHistormData([]);
    setViewlogSeaechTabInfo([]);
  };

  //接收参数：日志库选择logStore,日期开始时间，日期结束时间，querySql,运算符为是（filterIs）,运算符为否（filterNot）,环境Code（envCode）
  const loadMoreData = (param?: any) => {
    if (!querySql && !param?.querySql) {
      return;
    }
    setInfoLoading(true);
    postRequest(APIS.logSearch, {
      data: {
        startTime: timeRange && timeRange[0] ? moment(timeRange[0]).unix() + '' : null,
        endTime: timeRange && timeRange[1] ? moment(timeRange[1]).unix() + '' : null,
        querySql,
        indexMode: logStore,
        envCode: envCode || props.envCode,
        ...param || {},
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
          setViewlogSeaechTabInfo(viewLogSearchTabInfo);
          //命中率
          let hitNumber = resp.data.total;
          setHitInfo(hitNumber);
          // setLoading(false);
          setInfoLoading(false);
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
    setHitInfo('');
    setLogSearchTableInfo('');
    setLogHistormData([]);
    setViewlogSeaechTabInfo([]);
  };

  //重置筛选信息
  const resetQueryInfo = () => {
    setQuerySql('');
    loadMoreData({
      querySql: ''
    });
  };
  // 无限滚动下拉事件
  const ScrollMore = () => {
    setScrollLoading(true);

    setTimeout(() => {
      let moreList = logSearchTableInfo.splice(0, 20);
      let vivelist = viewLogSearchTabInfo.concat(moreList);
      setViewlogSeaechTabInfo(vivelist);
      setScrollLoading(false);
    }, 1500);
  };

  const getSelectOption = (type: string) => {
    setSelectOptionType(type);
    if (type !== 'rangePicker') {
      setLatestTimeI(-1);
      setTimeRange([]);
    }
  };

  //实现无限加载滚动
  // @ts-ignore
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
            {envCode && logStore ? (
              <>
                <Select options={selectOption} onChange={getSelectOption} value={selectOptionType} />
                {selectOptionType === 'rangePicker' ? (
                  <RangePicker
                    value={timeRange}
                    style={{ width: 360 }}
                    onChange={onTimeChange}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                ) : (
                  <Select
                    value={latestTimeI}
                    onChange={(val) => {
                      setLatestTimeI(val);
                      onTimeChange(START_TIME_ENUMS[val].value);
                    }}
                    style={{ width: 160 }}
                  >
                    {START_TIME_ENUMS.map((time, i) => (
                      <Select.Option key={i} value={i}>
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
        {!envCode && !logStore ? <div className="empty-holder">请选择环境和日志库</div> : null}
        {envCode && logStore ? (
          <div>
            <div style={{ marginBottom: 10, width: '100%' }}>
              <Form layout="inline">
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
                <Form.Item>
                  <Input
                    placeholder={`例: d1: "abc" AND d2: "xyz"`}
                    allowClear
                    value={querySql}
                    onChange={(e) => {
                      setQuerySql(e.target.value);
                      props.onChange && props.onChange(e.target.value);
                    }}
                    style={{ width: 658 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary" onClick={() => loadMoreData()}>
                    预览
                  </Button>
                  <Button type="default" style={{ margin: '0 2px 0 5px' }} onClick={resetQueryInfo} danger>
                    重置
                  </Button>
                </Form.Item>
              </Form>
              <div style={{ width: '100%', textAlign: 'right' }}>
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
                          <Collapse>
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
                                <Tabs defaultActiveKey="1">
                                  <TabPane tab="表" key="1">
                                    {Object.keys(item)?.map((key: any) => {
                                      return key === '@timestamp' ? (
                                        <p className="tab-header">
                                          <span className="tab-left">@timestamp:</span>
                                          <span
                                            className="tab-right"
                                            dangerouslySetInnerHTML={{
                                              __html: moment(item?.['@timestamp']).format('YYYY-MM-DD,HH:mm:ss'),
                                            }}
                                          />
                                        </p>
                                      ) : key === '__time__' ? (
                                        <p className="tab-header">
                                          <span className="tab-left">time:</span>
                                          <span
                                            className="tab-right"
                                            dangerouslySetInnerHTML={{
                                              __html: moment(item?.['__time__'] * 1000).format('YYYY-MM-DD,HH:mm:ss'),
                                            }}
                                          />
                                        </p>
                                      ) : (
                                        <p className="tab-header">
                                          <span
                                            className="tab-left"
                                            dangerouslySetInnerHTML={{ __html: `${key}:` }}
                                          />
                                          <span
                                            className="tab-right"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.[key],
                                            }}
                                          />
                                        </p>
                                      );
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
          </div>
        ) : null}
      </ContentCard>
    </PageContainer>
  );
}
