// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, message, Input, Switch } from 'antd';
import AceEditor from '@/components/ace-editor';
import { updateServiceInstance } from '../../service';

export interface IProp {
    visible?: boolean;
    initData?: any;
    onClose: () => any;
    onSave: () => any;
    serviceName: string;
    groupName: string;
    envCode: string;
    namespaceId: string
}

export default function ServiceEdit(props: IProp) {
    const { visible, initData, onClose, onSave, serviceName, groupName, envCode, namespaceId } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [switchValue, setSwitchValue] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            const data = JSON.parse(JSON.stringify(initData || {}));
            data.metadata = JSON.stringify(data?.metadata || {}, null, '\t')
            form.setFieldsValue({ ...data })
            setSwitchValue(data?.enabled)
        }
    }, [visible])

    const handleSubmit = async () => {
        const value = await form.validateFields();
        const newValue = JSON.parse(JSON.stringify(value || {}));
        let metadataObj = {}
        try {
            metadataObj = JSON.parse(newValue?.metadata || '{}')
        } catch (error) {
            message.error('输入的原数据格式有误，请重新输入');
            return;
        }
        newValue.metadata = JSON.stringify(metadataObj);
        newValue.weight = Number(newValue.weight)
        setLoading(true);
        updateServiceInstance({ ...newValue, clusterName: initData?.clusterName, ephemeral: initData?.ephemeral, serviceName, groupName, envCode, namespaceId }).then((res) => {
            if (res?.success) {
                message.success('编辑成功！');
                onClose();
                onSave();
            }
        }).finally(() => { setLoading(false) })
    };

    return (
        <Drawer
            width={700}
            title='编辑实例'
            placement="right"
            visible={visible}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" loading={loading} onClick={handleSubmit}>
                        保存
          </Button>
                    <Button type="default" onClick={onClose}>
                        取消
          </Button>
                </div>
            }
        >
            <Form form={form} labelCol={{ flex: '80px' }}>
                <Form.Item label="IP" name='ip'>
                    <span>{initData?.ip || ''}</span>
                </Form.Item>
                <Form.Item label="端口" name='port'>
                    <span>{initData?.port}</span>
                </Form.Item>
                <Form.Item label="权重" name="weight" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 120 }} />
                </Form.Item>

                <Form.Item label="是否上线" name="enabled">
                    <Switch checked={switchValue} onChange={(value) => { setSwitchValue(value) }} />
                </Form.Item>
                <Form.Item
                    label="元数据"
                    name="metadata"
                    rules={[{ required: true, message: '请输入元数据' }]}
                >
                    <AceEditor mode="yaml" height={450} />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
