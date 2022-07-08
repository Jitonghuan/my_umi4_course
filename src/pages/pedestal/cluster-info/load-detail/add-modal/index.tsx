
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import { MinusOutlined, PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Input, Divider, Space } from 'antd';
import './index.less'

export default function AddModal(props: any) {
    const { visible, onCancel, title } = props;
    const [form] = Form.useForm()
    useEffect(() => {
        if (visible) {
            form.resetFields();
            form.setFieldsValue({ 'tags': [undefined] })
        }
    }, [visible])
    const handleSubmit = async () => {
        const formValue = await form.validateFields();
        if (formValue) {
            const labels: any = {};
            const value = formValue['tags'];
            value.forEach((item: any) => {
                labels[item.key] = item.value
            })
            console.log(labels, 'label')
        }
    }
    return (
        <Modal title={title} width={500} visible={visible} onOk={handleSubmit} onCancel={onCancel}>
            <div className='form-wrapper'>
                <Form form={form} name="base" autoComplete="off" colon={false} >
                    <Form.List name="tags">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item>
                                            <MinusCircleOutlined className="tag-icon"
                                                onClick={() => remove(field.name)}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate
                                        >
                                            {() => (
                                                <Form.Item
                                                    {...field}
                                                    label="KEY"
                                                    name={[field.name, 'key']}
                                                    rules={[{ required: true, message: '此项为必填项' }]}
                                                >
                                                    <Input size='small' />
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                        <span style={{ verticalAlign: 'text-bottom', lineHeight: '45px' }}>=</span>
                                        <Form.Item
                                            {...field}
                                            label="VALUE"
                                            name={[field.name, 'value']}
                                        >
                                            <Input size='small' />
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
    )
}