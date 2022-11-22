import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Modal, Select, DatePicker } from 'antd';
import { cpmConfig, avgConfig, srConfig, failConfig } from '../schema';
import { Line } from '@ant-design/charts';
import { START_TIME_ENUMS, selectOption } from '../../../../schema';
import DetailContext from '../../../../context';
import { getEndpointDetail } from '../../../../../service';
import moment from 'moment';
import './index.less';
const { RangePicker } = DatePicker;

interface IProps {
    visible: boolean;
    onClose: () => void;
    data: any;
}
export default function ChartModal(props: IProps) {
    const { visible, onClose, data } = props;
    const { appCode, envCode, startTime, appId, deployName, count, isClick, podIps, endTime, selectTimeType } = useContext(DetailContext);
    const [modalTimeType, setModalTimeType] = useState<string>(selectTimeType || 'lastTime');
    const [modalStart, setModalStart] = useState<any>('');
    const [modalEnd, setModalEnd] = useState<any>('');
    const [rangeTime, setRangeTime] = useState<any>([]);
    const [chartData, setChartData] = useState<any>({});
    useEffect(() => {
        if (visible && data) {
            setChartData(data);
        }
    }, [data, visible])

    useEffect(() => {
        if (selectTimeType === 'lastTime') {
            setModalStart(startTime);
        } else {
            setRangeTime([moment(startTime * 1000), moment(endTime * 1000)]);
        }
    }, [startTime, endTime, selectTimeType])

    const typeChange = (v: string) => {
        setModalTimeType(v);
        let start, end;
        if (v === 'lastTime') {
            start = 5 * 60 * 1000;
            end = 0;
            setModalStart(start);
            setModalEnd(end);
        } else {
            let startRange = moment().subtract(5, 'minutes');
            let endRange = moment();
            setRangeTime([moment(startRange, 'YYYY-MM-dd HH:mm:ss'), moment(endRange, 'YYYY-MM-dd HH:mm:ss')]);
            start = startRange.unix();
            end = endRange.unix();
            setModalStart(start)
            setModalEnd(end)
        }
        getDetail(start, end)
    }

    // 选择的时间发生改变
    const timeChange = (startValue: any, endValue: any) => {
        let start = 0;
        let end = 0;
        if (modalTimeType === 'lastTime') {
            start = startValue;
            end = 0;
            setModalStart(startValue);
            setModalEnd(0);
        } else {
            start = (new Date(startValue).getTime()) / 1000;
            end = (new Date(endValue).getTime()) / 1000;
            setModalStart(start);
            setModalEnd(end);
        }
        getDetail(start, end)
    }

    const getDetail = (startTime: any, endTime: any) => {
        const now = new Date().getTime();
        let start = 0, end = 0;
        if (modalTimeType === 'lastTime') {
            //@ts-ignore
            start = Number((now - startTime) / 1000);
            end = Number(now / 1000);
        } else {
            //@ts-ignore
            start = startTime;
            end = Number(endTime);
        }
        getEndpointDetail({
            envCode,
            appId,
            deployName,
            endpointName: data?.url || '',
            podIps,
            start: moment(new Date(Number(start) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            //@ts-ignore
            end: moment(new Date(Number(end) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        }).then((res) => {
            if (res?.success) {
                setChartData(res?.data || {})
            }
        })
    }
    const chartMap = useMemo(() => {
        return [
            { title: '请求数', config: cpmConfig(chartData?.endpointCPM?.readMetricsValues || []) },
            { title: '平均RT', config: avgConfig(chartData?.endpointAvg?.readMetricsValues || []) },
            { title: '成功率', config: srConfig(chartData?.endpointSR?.readMetricsValues || []) },
            { title: '失败数', config: failConfig(chartData?.endpointFailed?.readMetricsValues || []) },
        ]
    }, [chartData])
    return (
        <>
            <Modal width={900}
                title={<div style={{ wordBreak: "break-all" }}>
                    <span>图表详情</span>
                </div>}
                className='app-traffic-chart-modal'
                visible={visible} onCancel={onClose}
                footer={false}
            >
                <div className='time-wrapper'>
                    选择时间：
            <Select options={selectOption} onChange={typeChange} value={modalTimeType} size='small' />
                    {modalTimeType === 'lastTime' ?
                        <Select
                            style={{ width: 150 }}
                            value={modalStart}
                            onChange={(value) => {
                                timeChange(value, '')
                            }}
                        >
                            <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                            {START_TIME_ENUMS.map((time) => (
                                <Select.Option key={time.value} value={time.value}>
                                    {time.label}
                                </Select.Option>
                            ))}
                        </Select> :
                        <RangePicker
                            allowClear
                            value={rangeTime}
                            style={{ width: 360 }}
                            onChange={(v: any, b: any) => { setRangeTime(v); timeChange(b[0], b[1]) }}
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    }
                </div>
                <div className='chart-container'>
                    {chartMap.map((item) => {
                        return <div className='chart-main'>
                            <p>{item.title}</p>
                            <Line {...item.config} />
                        </div>
                    })}
                </div>
            </Modal>
        </>
    );
}
