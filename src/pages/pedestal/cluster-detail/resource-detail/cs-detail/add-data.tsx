import React, { useEffect } from 'react';
import { history } from 'umi';
import { MinusOutlined, PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Input, Space, Select } from 'antd';
import './index.less';

export default function AddData(props: any) {
    const { visible, onCancel, onSave, loading } = props;
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            form.resetFields();
            form.setFieldsValue({ 'base-data': [undefined] });
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
            title='新增'
            width={800}
            visible={visible}
            onCancel={onCancel}
            className='add-data-modal'
            footer={[
                <Button onClick={onCancel}>取消</Button>,
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                    确认
        </Button>,
            ]}
        >
            <div className="load-tag-wrapper">
                <Form form={form} name="base" autoComplete="off" colon={false}>
                    <Form.List name="base-data">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item>
                                            <MinusCircleOutlined className="tag-icon" onClick={() => remove(field.name)} />
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate>
                                            {() => (
                                                <Form.Item
                                                    className="v-item"
                                                    {...field}
                                                    // label="KEY"
                                                    label={index === 0 ? 'KEY' : ''}
                                                    name={[field.name, 'key']}
                                                    rules={[{ required: true, message: '此项为必填项' }]}
                                                >
                                                    <Input.TextArea style={{ width: '300px' }} />
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            // label="VALUE"
                                            className="v-item"
                                            label={index === 0 ? 'VALUE' : ''}
                                            name={[field.name, 'value']}
                                        >
                                            <Input.TextArea style={{ width: '300px' }} />
                                        </Form.Item>
                                        <Form.Item>
                                            <PlusCircleOutlined className="tag-icon" onClick={() => add()} />
                                        </Form.Item>
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </div>
        </Modal>
    );
}
