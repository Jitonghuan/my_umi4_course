import { Drawer, message, Form, Button, Modal, Input, Upload, Radio } from 'antd';
import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';


export default function AddDrawer(props: any) {
    const { visible, onClose } = props;
    const [form] = Form.useForm<Record<string, string>>();
    useEffect(() => {
        if (visible) {
            form.resetFields()
        }
        if (!visible) {
            return
        }
    }, [visible])
    const handleSubmit = async () => {
        const value = await form.validateFields();
        console.log(value, 'value')
    }

    const uploadProps: any = {
        name: 'uploadFile',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
            showInfo: '上传中请不要关闭弹窗',
        },
        // beforeUpload: (file: any, fileList: any) => {
        //     return new Promise((resolve, reject) => {
        //         Modal.confirm({
        //             title: '操作提示',
        //             content: `确定要上传文件：${file.name}吗？`,
        //             onOk: () => {
        //                 return resolve(file);
        //             },
        //             onCancel: () => {
        //                 return reject(false);
        //             },
        //         });
        //     });
        // },
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done' && info.file?.response.success) {
                message.success(`${info.file.name} 上传成功.`);
            } else if (status === 'error' || info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
            } else if (info.file?.response?.success === false) {
                message.error('上传失败！请检查');
            } else if (info.file.status === 'removed') {
                message.warning('上传取消！');
            }
        },
        onDrop(e: any) { },
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
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
            <Form form={form} labelCol={{ flex: '120px' }}>
                <Form.Item label="集群名称" name="clusterName" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>
                <Form.Item label="集群code" name="clusterCode" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>
                <Form.Item label="promethuesUrl" name="url" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>
                <Form.Item
                    name="upload"
                    valuePropName='fileList'
                    label="kube配置文件"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: '请上传' }]}
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>上传kubeconf</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Account"
                    name="account"
                    rules={[{ required: true, message: '请输入账号' }]}
                >
                    <Input.Password style={{ width: 340 }} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password style={{ width: 340 }} />
                </Form.Item>

            </Form>
        </Drawer>
    )
}