import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { config1, config2, config3, config4 } from '../schema';
import { Line } from '@ant-design/charts';
import './index.less';
interface IProps {
    visible: boolean;
    onClose: () => void;

}
export default function ChartModal(props: IProps) {
    const { visible, onClose } = props;
    const chartMap = [
        { title: '我是图表1', config: config1 },
        { title: '我是图表2', config: config2 },
        { title: '我是图表3', config: config3 },
        { title: '我是图表4', config: config4 },
    ]

    return (
        <>
            <Modal width={900} title="图表详情" className='app-traffic-chart-modal' visible={visible} onCancel={onClose} footer={false}>
                <div className='chart-container'>
                    {chartMap.map((item) => {
                        return <div className='chart-main'>
                            <p>{item.title}</p>
                            <Line {...item.config()} />
                        </div>
                    })}
                </div>
            </Modal>
        </>
    );
}
