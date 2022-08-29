// 数据执行结果
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 15:40

import React, { useMemo } from 'react';
import { Modal, Table, Tooltip } from 'antd';

export interface Iprops {
    visible?: boolean;
    onClose?: () => any;
    dataSource: any;
}

export default function DemandDetail(props: Iprops) {
    const { visible, onClose, dataSource = [] } = props;
    const columns = [
        {
            title: '需求名',
            dataIndex: 'name',
            width: '35%',
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>
        },
        {
            title: '状态',
            dataIndex: 'state',
            width: '25%',
        },
        {
            title: 'fone地址',
            dataIndex: 'adress',
            width: '40%',
            ellipsis: true,
            render: (value: string) => <a target="_blank" href=''>{value}</a>,
        }
    ]
    return (
        <Modal title="关联需求详情" visible={visible} maskClosable={false} footer={false} width={700} onCancel={onClose}>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={dataSource}
            />
        </Modal>
    );
}
