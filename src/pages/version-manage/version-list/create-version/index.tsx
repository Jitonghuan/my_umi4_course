import React, { useState, useEffect, } from 'react';
import { Drawer, Form, Button, DatePicker,  Input, Row, Select,  message } from 'antd';
import { disabledDate, disabledTime } from '@/utils';
import { createRelease } from '../../service';
import { useSearchUser } from '@/pages/DBMS/common-hook';
import './index.less';

export default function AddDrawer(props: any) {
    const { visible, onClose, categoryData,appCategory, maxVersion, onSave } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [userLoading, userNameOptions, searchUser] = useSearchUser();
    useEffect(() => {
        searchUser()
    }, [])

    useEffect(() => {
        if (visible) {
            form.resetFields();
            let user:any={}
            try {
                user=  localStorage.getItem('USER_INFO');
                if (user) {
                    user = JSON.parse(user);
                    form.setFieldsValue({
                        owner: user.name,
                    });
                }
                
            } catch (error) {
                
            }
         
            let initVersion = '';
            if (maxVersion) {
                const res = (maxVersion).split('.');
                initVersion = `${res[0]}.${res[1]}.${Number(res[2]) + 1}`
            }
            form.setFieldsValue({ releaseNumber: initVersion,
                categoryCode:appCategory?.value
             });
        }
    }, [visible, maxVersion]);



    const handleSubmit = async () => {
        const value = await form.validateFields();
        value.planTime = value.planTime.format('YYYY-MM-DD HH:mm:ss');
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
                    <Select
                        placeholder="请输入"
                        showSearch
                        allowClear
                        style={{ width: 240 }}
                        options={userNameOptions}
                        loading={userLoading}
                    />
                </Form.Item>
                <Form.Item label="版本简述" name="sketch" rules={[{ required: true, message: '请输入' }]}>
                    <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item label="版本备注" name="desc" rules={[{ required: true, message: '请输入' }]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
