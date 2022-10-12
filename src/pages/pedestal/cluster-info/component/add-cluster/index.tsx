import { Drawer, message, Form, Button, Modal, Input, Upload, Radio } from 'antd';
import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import { importCluster } from '../../service'


export default function AddDrawer(props: any) {
    const { visible, onClose } = props;
    const [form] = Form.useForm<Record<string, string>>();
    useEffect(() => {
        if (visible) {
            form.resetFields()
        }
    }, [visible])
    const handleSubmit = async () => {
        const value = await form.validateFields();
        // const res = await importCluster({ ...value });
        // if (res?.success) {
        //     message.success('导入成功');
        // }
        console.log(value, 'value')
    }

    return (
        <Drawer
            width={700}
            title='导入集群'
            placement="right"
            visible={visible}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" onClick={handleSubmit}>保存</Button>
                    <Button type="default" onClick={onClose}>取消</Button>
                </div>
            }
        >
            <Form form={form} labelCol={{ flex: '130px' }}>
                <Form.Item label="集群名称" name="clusterName" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>
                <Form.Item label="集群code" name="clusterCode" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>
                <Form.Item label="prometheusUrl" name="prometheusUrl" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>

                <Form.Item
                    label="prometheusUser"
                    name="prometheusUser"
                    rules={[{ required: true, message: '请输入账号' }]}
                >
                    <Input.Password style={{ width: 340 }} />
                </Form.Item>
                <Form.Item
                    label="prometheusPwd"
                    name="prometheusPwd"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password style={{ width: 340 }} />
                </Form.Item>

                <Form.Item
                    name="kubeConfig"
                    label="kubeConfig"
                >
                    <AceEditor mode="yaml" height={450} />
                </Form.Item>

            </Form>
        </Drawer>
    )
}