import React, { useMemo, useState } from 'react';
import { Form, Modal, Table, Space, Tooltip } from 'antd';
import { relateDemandColumn } from '../../schema';

export default function RelateDemand(props: any) {
    const { initData, visible, onClose } = props;
    const [data, setData] = useState<any>([{ content: '10', code: 'hbos-dtc' }]);

    const columns = useMemo(() => {
        return relateDemandColumn()
    }, [data])
    return (
        <Modal
            visible={visible}
            title={initData?.code || ''}
            onCancel={onClose}
            width={900}
            footer={null}
        >
            <div className=''>
                <Table
                    dataSource={data}
                    // loading={loading || updateLoading}
                    bordered
                    rowKey="id"
                    pagination={false}
                    columns={columns}
                ></Table>

            </div>
        </Modal>
    )
}