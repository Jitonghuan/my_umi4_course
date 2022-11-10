import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Tag, Form, Button, Row, Col, Input, Switch, Radio, Select, Space } from 'antd';
import UserSelector, { stringToList } from '@/components/user-selector';
import './index.less';

export default function AddDrawer(props: any) {
    const { visible, onClose } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);

    const handleSubmit = () => { };
    return (
        <Drawer
            width={650}
            title="创建版本"
            placement="right"
            visible={visible}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit}>
                        保存
            </Button>
                    <Button type="default" onClick={onClose}>
                        取消
            </Button>
                </div>
            }
        >
            <Form form={form} labelCol={{ flex: '120px' }}>
                <Form.Item label="应用分类" name="name" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 240 }} />
                </Form.Item>

                <Form.Item label="版本号" name="version" rules={[{ required: true, message: '请输入' }]}>
                    <Select style={{ width: 240 }} options={[]} />
                </Form.Item>
                <Form.Item label="计划发版时间" name="time" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 240 }} />
                </Form.Item>
                <Form.Item label="版本负责人" name="user" rules={[{ required: true, message: '请输入' }]}>
                    <UserSelector />
                </Form.Item>
                <Form.Item label="版本备注" name="caozuo" rules={[{ required: true, message: '请输入' }]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
