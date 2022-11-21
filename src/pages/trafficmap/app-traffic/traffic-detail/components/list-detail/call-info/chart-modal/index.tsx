import React, { useEffect, useMemo } from 'react';
import { Modal, Input } from 'antd';
import { cpmConfig, avgConfig, srConfig, failConfig } from '../schema';
import { Line } from '@ant-design/charts';
import './index.less';
interface IProps {
    visible: boolean;
    onClose: () => void;
    data: any;
}
export default function ChartModal(props: IProps) {
    const { visible, onClose, data } = props;
    useEffect(() => {

    }, [])
    const chartMap = useMemo(() => {
        return [
            { title: '请求数', config: cpmConfig(data?.endpointCPM?.readMetricsValues || []) },
            { title: '平均RT', config: avgConfig(data?.endpointAvg?.readMetricsValues || []) },
            { title: '成功率', config: srConfig(data?.endpointSR?.readMetricsValues || []) },
            { title: '失败数', config: failConfig(data?.endpointFailed?.readMetricsValues || []) },
        ]
    }, [data])
    return (
        <>
            <Modal width={900}
                title={<div style={{ wordBreak: "break-all" }}>
                    <span>图表详情 -- {data.url}</span>
                </div>}
                className='app-traffic-chart-modal'
                visible={visible} onCancel={onClose}
                footer={false}
            >
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
