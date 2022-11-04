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
import ChartCaseList from './log-historm';
import htmr from 'htmr';
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
const { Search } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
export default function LoggerSearch() {
    let location: any = useLocation();
    const query: any = parse(location.search);
    const receiveInfo = query;
    const [filterForm]=Form.useForm();
    const [rangePickerForm] = Form.useForm();
    const [envOptions] = useEnvOptions(); //环境下拉框选项数据
    const [envCode, setEnvCode] = useState<string>(''); //环境envcode选择
    const [logStoreOptions] = useLogStoreOptions(envCode); //日志库选项下拉框数据
    const [indexMode, setIndexMode] = useState<string>(); //日志库选择
    const defaultSelectValue = receiveInfo.startTime ? 'rangePicker' : 'lastTime';
    const [selectOptionType, setSelectOptionType] = useState<string>(defaultSelectValue);

    const getSelectOption = (type: string) => {
        setSelectOptionType(type);
        if (type === 'lastTime') {
        
        } else {
         
        }
      };
    
    //选择环境事件
  const handleEnvCodeChange = (next: string) => {
    // setEnvCode(next);
    // setLogStore(undefined);
    // setIndexModeData([]);
    // setHitInfo('');
    // setLogSearchTableInfo([]);
    // setLogHistormData([]);
    // setViewlogSeaechTabInfo([]);
  };
  //切换日志库
  const chooseIndexMode = (n: any) => {
    // setLogStore(n);
    // //subInfoForm.resetFields();
    // setIndexModeData([]);
    // setHitInfo('');
    // setLogSearchTableInfo([]);
    // setLogHistormData([]);
    // setViewlogSeaechTabInfo([]);
  };
   //选择时间间隔
   const selectTime = (time: any, timeString: string) => {
    
    let start = moment(timeString[0]).unix().toString();
    let end = moment(timeString[1]).unix().toString();
    if (start !== 'NaN' && end !== 'NaN') {
    
    } else {
     
    }
  };

    return (
        <PageContainer className="logger-search-page">
            <FilterCard>
                <div className="table-caption">
                    <div className="caption-left">
                        <Form layout="inline" form={filterForm} onFinish={(values:any)=>{

                        }} onReset={()=>{
                            filterForm.resetFields()
                        }}>
                            <Form.Item label="环境Code" name="envCode">
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
                            <Form.Item label="日志库" name="indexMode">
                                <Select
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
                        {envCode && indexMode ? (
                            <>
                                <Select options={selectOption} onChange={getSelectOption} value={selectOptionType} />
                                {selectOptionType === 'rangePicker' ? (
                                    <Form form={rangePickerForm}>
                                        <Form.Item name="rangeDate" noStyle>
                                            <RangePicker
                                                allowClear
                                                style={{ width: 360 }}
                                                onChange={(v: any, b: any) => selectTime(v, b)}
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                                }}
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                                        </Form.Item>
                                    </Form>
                                ) : (
                                    <Select  style={{ width: 140 }}>
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

        </PageContainer>
    )
}