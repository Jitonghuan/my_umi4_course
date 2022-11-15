import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Tag, Form, Button, Table, Modal, Input, Switch, Radio, Select, Space } from 'antd';
import UserSelector, { stringToList } from '@/components/user-selector';
import { downloadList } from '../schema';
import './index.less';

export default function OperateModal(props: any) {
    const { visible, onClose, action, initData, appGroup } = props;
    const [data, setData] = useState<any>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);

    const columns = useMemo(() => downloadList(), [data])

    const handleSubmit = () => { };
    return (
        <Modal
            title={
                <div style={{ position: 'relative' }}>
                    当前版本：{initData?.version || '--'}
                    <span style={{ right: '40px', position: "absolute" }}>
                        <span className='group-code'>{appGroup?.value || '---'}</span>
                        <span className='group-label'>{appGroup?.label || '---'}</span>
                    </span>
                </div>
            }
            // closable={false}
            visible={visible}
            onCancel={onClose}
            width={700}
            footer={
                action !== 'downloadList' ? <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit}>
                        确认
                   </Button>
                    <Button type="default" onClick={onClose}>
                        取消
                    </Button>
                </div> : null
            }
        >
            {action === 'merge' &&
                <Form form={form} labelCol={{ flex: '120px' }}>
                    <Form.Item label="选择合并版本：" name="name" rules={[{ required: true, message: '请输入' }]}>
                        <Select style={{ width: 240 }} options={[]} />
                    </Form.Item>
                </Form>
            }

            {action === 'downloadList' &&
                <>
                    <div>下载列表</div>
                    <Table
                        dataSource={data}
                        // loading={loading || updateLoading}
                        bordered
                        rowKey="id"
                        pagination={false}
                        columns={columns}
                    />
                </>
            }
            {
                action === 'downloadPackage' &&
                <>

                </>
            }
        </Modal>
    );
}
