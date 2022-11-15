import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Tag, Form, Button, DatePicker, Col, Input, Row, Radio, Select, Space } from 'antd';
import UserSelector, { stringToList } from '@/components/user-selector';
import moment from 'moment';
import { disabledDate, disabledTime } from '@/utils'
import './index.less';

export default function AddDrawer(props: any) {
    const { visible, onClose, categoryData, maxVersion } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
            let initVersion = '';
            if (maxVersion) {
                const res = (maxVersion).split('.');
                initVersion = `${res[0]}.${res[1]}.${Number(res[2]) + 1}`
            }
            form.setFieldsValue({ version: initVersion });
        }
    }, [visible, maxVersion]);



    const handleSubmit = async () => {
        const value = await form.validateFields();
        value.time = value.time.format('YYYY-MM-DD HH:mm:ss');
    };

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
                <Form.Item label="应用分类" name="name" rules={[{ required: true, message: '请选择' }]}>
                    <Select style={{ width: 240 }} options={categoryData || []} />
                </Form.Item>

                <Row>
                    <Form.Item label="版本号" name="version" rules={[{ pattern: /^\d+\.\d+\.\d+$/, required: true, message: '请输入 x.y.z 格式' }]}>
                        <Input style={{ width: 180 }} />
                    </Form.Item>
                    {maxVersion &&
                        <span className='version-tip'>
                            前置版本号：{maxVersion}
                        </span>}
                </Row>
                <Form.Item label="计划发版时间" name="time" rules={[{ required: true, message: '请输入' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                    />
                </Form.Item>
                <Form.Item label="版本负责人" name="user" rules={[{ required: true, message: '请输入' }]}>
                    <UserSelector style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="版本备注" name="caozuo" rules={[{ required: true, message: '请输入' }]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
