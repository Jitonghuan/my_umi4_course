import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Form, Select, Button, Input, Spin, DatePicker, Collapse, Popover, List, Skeleton, Divider, Tabs, } from 'antd';
import ChartCaseList from './log-historm';
import { queryLogResultItems } from './type'
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
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
export default function LoggerSearch() {
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
    const [filterForm] = Form.useForm();
    const [rangePickerForm] = Form.useForm();
    const [luceneForm] = Form.useForm();
    const [subInfoForm] = Form.useForm();
    const [envOptions] = useEnvOptions(); //环境下拉框选项数据
    const [envCode, setEnvCode] = useState<string>(''); //环境envcode选择
    const [logStoreOptions] = useLogStoreOptions(envCode); //日志库选项下拉框数据
    const [indexMode, setIndexMode] = useState<string>(""); //日志库选择
    const defaultSelectValue = receiveInfo.startTime ? 'rangePicker' : 'lastTime';
    const [selectOptionType, setSelectOptionType] = useState<string>(defaultSelectValue);
    const [editScreenVisible, setEditScreenVisible] = useState<boolean>(false); //是否展示lucene语法输入框
    const [stowCondition, setStowCondition] = useState<boolean>(false);//是否展开图表
    const [sourceMapVisible, setSourceMapVisible] = useState<boolean>(false)
    const [sourceInfo, setSourceInfo] = useState<any>({})
    const [srollLoading, setScrollLoading] = useState(false); //无限下拉loading
    const [resultLoading, setResultLoading] = useState(false); //日志检索信息loading
    const now = new Date().getTime();
    //默认传最近30分钟，处理为秒级的时间戳
    let start = ((receiveInfo.startTime ? new Date(receiveInfo.startTime).getTime() : now - 5 * 60 * 1000) / 1000).toString();
    let end = ((receiveInfo.endTime ? new Date(receiveInfo.endTime).getTime() : now) / 1000).toString();
    const [startTime, setStartTime] = useState<string>(start)
    const [endTime, setEndTime] = useState<string>(end)
    const [intervalTimeValue, setIntervalTimeValue] = useState<number>(5 * 60 * 1000)
    const [logHistormData, setLogHistormData] = useState<any>([]); //柱状图图表数据
    const [hitCount, setHitCount] = useState<number>(0); //命中次数
    const [detailLogResult, setDetailLogResult] = useState<any>([]); //手风琴一次展示的20条数据
    const [logsResult, setLogsResult] = useState<any>([])//除了第一次剪切到的20条数据剩下的数据
    useEffect(() => {
        if (receiveInfo.startTime || receiveInfo.endTime) {
            rangePickerForm.setFieldsValue({ rangeDate: [moment(start, 'X'), moment(end, 'X')] });
        }
    }, [receiveInfo.startTime, receiveInfo.endTime])
    useLayoutEffect(() => {
        if (Object.keys(receiveInfo).length !== 0) {
            let appCodeArry = [];
            if (receiveInfo.envCode) {
                setEnvCode(receiveInfo.envCode);
                appCodeArry.push('envCode:' + receiveInfo.envCode);
                filterForm.setFieldsValue({
                    envCode: receiveInfo.envCode
                })
            }
            setIndexMode(receiveInfo.indexMode || 'app_log');
            filterForm.setFieldsValue({
                indexMode: receiveInfo.indexMode || 'app_log'
            })
            // if (receiveInfo.message) {
            //     subInfoForm.setFieldsValue({ message: receiveInfo.message });
            // }
            if (messageInfo['message']) {
                let messageDecodedData = decodeURIComponent(escape(window.atob(messageInfo['message'])));

                luceneForm.setFieldsValue({
                    querySql: messageDecodedData,
                });
            }
            if (receiveInfo.traceId) {
                subInfoForm.setFieldsValue({ traceId: receiveInfo.traceId });

            }
            if (receiveInfo.appCode && receiveInfo.indexMode !== 'frontend_log') {

                subInfoForm.setFieldsValue({
                    appCode: receiveInfo.appCode,
                });
            }
            setEditScreenVisible(true);
            queryLogResult()

        }

    }, [])


    const getSelectOption = (type: string) => {
        setSelectOptionType(type);
        if (type === 'lastTime') {
            const now = new Date().getTime();
            let startTimepl = Number((now - intervalTimeValue) / 1000).toString();
            let endTimepl = Number(now / 1000).toString();
            setStartTime(startTimepl);
            setEndTime(endTimepl);
            queryLogResult({ start: startTimepl, end: endTimepl })
        }
        if (type === "rangePicker") {

            rangePickerForm.setFieldsValue({ rangeDate: [moment(startTime, 'X'), moment(endTime, 'X')] });
        }
    };

    //选择环境事件
    const handleEnvCodeChange = (next: string) => {
        setEnvCode(next)
        setDetailLogResult([])
        setLogsResult([])
        setLogHistormData([])
        setHitCount(0)
        setIndexMode("");
        filterForm.setFieldsValue({
            indexMode: undefined
        })

    };
    //切换日志库
    const chooseIndexMode = (n: any) => {
        setIndexMode(n)
        setDetailLogResult([])
        setLogsResult([])
        setLogHistormData([])
        setHitCount(0)

    };
    //选择时间区间
    const selectRangeTime = (time: any, timeString: string) => {

        let start = moment(timeString[0]).unix().toString();
        let end = moment(timeString[1]).unix().toString();
        if (start !== 'NaN' && end !== 'NaN') {
            setStartTime(start);
            setEndTime(end);
            queryLogResult({ start, end })

        }
    };
    //选择时间间隔
    const selectIntervalTime = (value: number) => {
        setIntervalTimeValue(value)
        //rangePickerForm.resetFields();
        const now = new Date().getTime();
        let startTimepl = Number((now - value) / 1000).toString();
        let endTimepl = Number(now / 1000).toString();
        setStartTime(startTimepl);
        setEndTime(endTimepl);
        queryLogResult({ start: startTimepl, end: endTimepl })
    }

    const submitSearch = () => {
        queryLogResult()
    }
    const resetQueryCondition = () => {
        subInfoForm.resetFields();
        luceneForm.resetFields()
        setEditScreenVisible(false);
        queryLogResult()
    }
    const callback = (key: any) => { };
    const queryLogResult = (params?: { start?: string, end?: string }) => {
        setResultLoading(true);
        let querySql = luceneForm.getFieldValue("querySql");
        let searchSubmitItems = subInfoForm.getFieldsValue();
        let filterIs = [];
        if (searchSubmitItems?.appCode) {
            filterIs.push('appCode:' + searchSubmitItems?.appCode);
        }
        if (searchSubmitItems?.podName) {
            filterIs.push('podName:' + searchSubmitItems?.podName);
        }
        if (searchSubmitItems?.traceId) {
            filterIs.push('traceId:' + searchSubmitItems?.traceId);
        }

        let curEnvcode = envCode || filterForm.getFieldValue("envCode")
        filterIs.push('envCode:' + curEnvcode);
        let currentStartTime = startTime;
        let currentEndTime = endTime;
        if (selectOptionType === 'lastTime') {
            const now = new Date().getTime();
            currentStartTime = Number((now - intervalTimeValue) / 1000).toString();
            currentEndTime = Number(now / 1000).toString();
        }
        postRequest(APIS.logSearch, {
            data: {
                envCode: envCode || filterForm.getFieldValue("envCode"),
                indexMode: indexMode || filterForm.getFieldValue("indexMode"),
                querySql,
                startTime: params?.start ? params?.start : currentStartTime,
                endTime: params?.end ? params?.end : currentEndTime,
                filterIs,
                message: searchSubmitItems?.message
            }
        }).then((result: any) => {
            if (result?.success) {
                //柱状图数据 buckets
                let logHistorm = result?.data?.histograms;
                setLogHistormData(logHistorm);
                //命中率
                let hitNumber = result.data.total;
                setHitCount(hitNumber);
                //查询到的日志结果
                let logsData = (result.data.logs || [])?.slice(0);

                //每次只展示前20条
                let cutLogsData = logsData.splice(0, 20);
                setLogsResult(logsData || []);

                let newArryData: any = []
                let mapArry = cutLogsData?.slice(0)
                mapArry?.map((element: any) => {
                    let newInfo = Object.assign({}, element)
                    if (element.hasOwnProperty("traceId")) {
                        let objItem = Object.assign({ traceId: newInfo["traceId"] }, _.omit(element, ["traceId"]))
                        newArryData.push(objItem)
                    } else {
                        newArryData.push(element)
                    }
                })
                setDetailLogResult(newArryData);

            }


        }).finally(() => {
            setResultLoading(false)
        })

    }

    // 无限滚动下拉事件
    const ScrollMore = () => {
        setScrollLoading(true);
        setTimeout(() => {
            let moreList = logsResult?.splice(0, 20) || [];
            let viewlist = detailLogResult.concat(moreList);
            setDetailLogResult(viewlist);
            setScrollLoading(false);
        }, 800);
    };

    return (
        <PageContainer className="logger-search-page">
            <FilterCard className="logger-search-filter">
                <div className="table-caption">
                    <div className="caption-left">
                        <Form layout="inline" form={filterForm} >
                            <Form.Item label="环境Code" name="envCode">
                                <Select
                                    value={envCode}
                                    onChange={handleEnvCodeChange}
                                    options={envOptions}
                                    style={{ width: 140 }}
                                    placeholder="请选择环境"
                                    showSearch
                                />
                            </Form.Item>
                            <Form.Item label="日志库" name="indexMode">
                                <Select
                                    options={logStoreOptions}
                                    onChange={chooseIndexMode}
                                    style={{ width: 140 }}
                                    placeholder="请选择日志库"
                                    showSearch
                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="caption-right">
                        {envCode && indexMode ? (
                            <>
                                <Select options={selectOption} onChange={getSelectOption} value={selectOptionType} />
                                {selectOptionType === 'rangePicker' ? (
                                    <Form form={rangePickerForm}>
                                        <Form.Item name="rangeDate" noStyle>
                                            <RangePicker
                                                allowClear
                                                style={{ width: 360 }}
                                                onChange={(v: any, b: any) => selectRangeTime(v, b)}
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                                }}
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                                        </Form.Item>
                                    </Form>
                                ) : (
                                    <Select style={{ width: 140 }} value={intervalTimeValue} onChange={selectIntervalTime} >
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
                <div>
                    {/* ---------------------------搜索条件------------------------ */}
                    <div className="submit-form">
                        <Form form={subInfoForm} layout="inline" labelCol={{ flex: 4 }}>
                            <p style={{ display: 'flex', width: '100%', marginBottom: 10 }}>
                                <Form.Item label="appCode" name="appCode">
                                    <Input style={{ width: '11vw' }}></Input>
                                </Form.Item>
                                <Form.Item label="podName" name="podName">
                                    <Input style={{ width: '14vw' }}></Input>
                                </Form.Item>
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
                                    <Form form={luceneForm} layout="inline">
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
                                                onPressEnter={submitSearch}
                                            />
                                        </Form.Item>
                                        <Form.Item name="moreInput">
                                            <Input placeholder="搜索" className="moreInput" style={{ width: 0 }} />
                                        </Form.Item>
                                    </Form>
                                </p>
                            ) : null}

                            <Form.Item>
                                <Button htmlType="submit" type="primary" disabled={!envCode || !indexMode} onClick={submitSearch}>
                                    查询
                                </Button>
                            </Form.Item>
                            <Button type="default" style={{ marginLeft: 2 }} disabled={!envCode || !indexMode} onClick={resetQueryCondition} >
                                重置
                                </Button>
                            <Button
                                type="primary"
                                style={{ marginLeft: '2vw' }}
                                onClick={() => {
                                    if (!editScreenVisible) {
                                        setEditScreenVisible(true);
                                    } else {
                                        setEditScreenVisible(false);
                                        luceneForm.resetFields()
                                        //setQuerySql('');
                                    }
                                }}

                            >
                                高级搜索
                         </Button>
                        </Form>

                    </div>
                    {/* ---------------------------柱状图------------------------ */}
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
                        <Spin size="large" spinning={resultLoading}>
                            <div style={{ marginBottom: 4 }}>
                                <ChartCaseList data={logHistormData} loading={resultLoading} hitsData={hitCount} />
                            </div>
                        </Spin>
                    )}
                    {/* ---------------------------无限下拉列表------------------------ */}
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
                            <Spin spinning={resultLoading}>
                                <InfiniteScroll
                                    dataLength={detailLogResult?.length || 0}
                                    next={ScrollMore}
                                    hasMore={detailLogResult?.length < 500}
                                    loader={<Skeleton paragraph={{ rows: 1 }} />}
                                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                    scrollableTarget="scrollableDiv"
                                >
                                    <List
                                        dataSource={detailLogResult}
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
                                                                    right: indexMode === 'frontend_log' ? (
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
                                                                                            // history.push({
                                                                                            //     pathname: "/matrix/trafficmap/tracking"

                                                                                            // }, {
                                                                                            //     entry: "logSearch",
                                                                                            //     envCode: envCode,
                                                                                            //     // appCode:subInfoForm.getFieldValue("appCode")||item?.appCode,
                                                                                            //     traceId: doc.body.innerText,
                                                                                            //     startTime: "",
                                                                                            //     endTime: ""
                                                                                            // })
                                                                                            const url = `/matrix/trafficmap/tracking?envCode=${envCode}&traceId=${doc.body.innerText}&startTime=&endTime=&entry=logSearch`
                                                                                            window.open(url, '_blank')
                                                                                        }} >


                                                                                    </a>


                                                                                        : <a onClick={() => {
                                                                                            // history.push({
                                                                                            //     pathname: "/matrix/trafficmap/tracking"

                                                                                            // }, {
                                                                                            //     entry: "logSearch",
                                                                                            //     envCode: envCode,
                                                                                            //     // appCode:subInfoForm.getFieldValue("appCode")||item?.appCode,
                                                                                            //     traceId: item?.traceId,
                                                                                            //     startTime: startTime,
                                                                                            //     endTime: endTime
                                                                                            // })
                                                                                            const url = `/matrix/trafficmap/tracking?envCode=${envCode}&traceId=${item?.traceId}&startTime=${startTime}&endTime=${endTime}&entry=logSearch`
                                                                                            window.open(url, '_blank')
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
                </div>
            </ContentCard>
            <SourceMapModal
                visible={sourceMapVisible}
                onClose={() => setSourceMapVisible(false)}
                param={sourceInfo}
            />

        </PageContainer>
    )
}