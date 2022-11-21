import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Tag, Form, Button, DatePicker, Col, Input, Row, Radio, Select, Space, message } from 'antd';
import UserSelector, { stringToList } from '@/components/user-selector';
import moment from 'moment';
import { disabledDate, disabledTime } from '@/utils';
import { createRelease } from '../../service';
import './index.less';

export default function AddDrawer(props: any) {
    const { visible, onClose, categoryData, maxVersion, onSave } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

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
        try {
            setLoading(true);
            const res = await createRelease({ ...value });
            if (res?.success) {
                message.success('新增版本成功');
                onClose();
                onSave();
            }
        } finally {
            setLoading(false)
        }
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
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        保存
            </Button>
                    <Button type="default" onClick={onClose}>
                        取消
            </Button>
                </div>
            }
        >
            <Form form={form} labelCol={{ flex: '120px' }}>
                <Form.Item label="应用分类" name="categoryCode" rules={[{ required: true, message: '请选择' }]}>
                    <Select style={{ width: 240 }} options={categoryData || []} />
                </Form.Item>

                <Row>
                    <Form.Item label="版本号" name="releaseNumber" rules={[{ pattern: /^\d+\.\d+\.\d+$/, required: true, message: '请输入 x.y.z 格式' }]}>
                        <Input style={{ width: 180 }} />
                    </Form.Item>
                    {maxVersion &&
                        <span className='version-tip'>
                            前置版本号：{maxVersion}
                        </span>}
                </Row>
                <Form.Item label="计划发版时间" name="planTime" rules={[{ required: true, message: '请输入' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                    />
                </Form.Item>
                <Form.Item label="版本负责人" name="owner" rules={[{ required: true, message: '请输入' }]}>
                    <UserSelector style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="版本备注" name="desc" rules={[{ required: true, message: '请输入' }]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
