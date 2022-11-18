import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Table, Modal, Tooltip } from 'antd';
import { getHpaRecordList } from '../../service';

export default function RecordDetail(props: any) {
    const { visible, onClose, initData, clusterCode } = props;
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const columns = [
        {
            title: '触发时间',
            dataIndex: 'triggerTime',
            key: 'triggerTime',
            width: 120,
            ellipsis: {
                showTitle: false
            },
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>
        },
        {
            title: '触发事件',
            dataIndex: 'triggerEvent',
            key: 'triggerEvent',
            width: 100,
            ellipsis: {
                showTitle: false
            },
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>
        },
        {
            title: '事件详情',
            dataIndex: 'eventDetail',
            key: 'eventDetail',
            width: 240,
            ellipsis: {
                showTitle: false
            },
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>
        },
    ]

    useEffect(() => {
        if (visible && initData) {
            setData([]);
            setLoading(true)
            const { ruleCode } = initData || {};
            getHpaRecordList({ ruleCode, clusterCode }).then((res) => {
                if (res?.success) {
                    setData(res?.data || [])
                }
            }).finally(() => { setLoading(false) })
        }
    }, [visible, initData]);

    return (
        <Modal
            title='触发记录'
            visible={visible}
            onCancel={onClose}
            width={900}
            footer={false}
        >
            <Table
                dataSource={data}
                bordered
                loading={loading}
                rowKey="id"
                pagination={false}
                columns={columns}
            />
        </Modal>
    );
}
