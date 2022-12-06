import React, { useMemo, useState } from 'react';
import { relateDemandColumn } from '../../schema';
import { Form, Modal, Table, Button, Tooltip } from 'antd';
import './index.less'

export default function SubmitPublish(props: any) {
    const { initData, visible, onClose } = props;
    const [data, setData] = useState<any>([{ content: '10', code: 'hbos-dtc' }]);
    const columns = useMemo(() => {
        return relateDemandColumn()
    }, [data])
    return (
        <Modal
            visible={visible}
            title='提交发布'
            onCancel={onClose}
            width={900}
            className='submit-publish-modal'
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
            <div className='flex-space-between'>
                <div>变更配置</div>
                <Button type='primary' size='small'>查看配置</Button>
            </div>
            <div className='content-container'>

            </div>
            <div className='flex-space-between'>
                <div>变更SQL</div>
                <Button type='primary' size='small'>查看表结构</Button>
            </div>
            <div className='content-container'>

            </div>
        </Modal>
    )
}