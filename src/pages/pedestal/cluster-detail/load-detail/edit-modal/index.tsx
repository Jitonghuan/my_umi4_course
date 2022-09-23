import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import { MinusOutlined, PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Input, Space, Select } from 'antd';

export default function EditModal(props: any) {
    const { visible, onCancel, onSave, loading, initData } = props;
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            form.setFieldsValue(initData)
        }
    }, [visible]);
    const handleSubmit = async () => {
        const formValue = await form.validateFields();
        if (formValue) {
            onSave(formValue);
        }
    };
    return (
        <Modal
            title='编辑'
            width={500}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button onClick={onCancel}>取消</Button>,
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                    确认
        </Button>,
            ]}
        >
            <div className="load-tag-wrapper">
                <Form form={form} name="base" autoComplete="off" colon={false} labelCol={{ flex: '100px' }}>
                    <Form.Item label='key:' name='name'>
                        <Input style={{ width: '300px' }} disabled></Input>
                    </Form.Item>
                    <Form.Item label='value:' name='value'>
                        <Input style={{ width: '300px' }}></Input>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
