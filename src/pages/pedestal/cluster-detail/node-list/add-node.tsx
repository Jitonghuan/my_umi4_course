import { Drawer, message, Form, Button, Select, Input, Upload, Radio } from 'antd';
import { useState, useEffect } from 'react';
import { addNode } from '../service'
import { UploadOutlined } from '@ant-design/icons';


export default function AddNode(props: any) {
    const { visible, onClose, onSubmit } = props;
    const [form] = Form.useForm<Record<string, string>>();
    const [radioValue, setRadioValue] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [nodeOrigin, setNodeOrigin] = useState<string>('');
    useEffect(() => {
        if (visible) {
            setNodeOrigin('')
            form.resetFields()
        }
    }, [visible])
    const handleSubmit = async () => {
        const formValue = await form.validateFields();
        if (formValue) {
            const res = await addNode({ ...formValue });
            if (res?.success) {
                message.success('新增成功！')
                onSubmit();
            }
        }
    }
    const onChange = (e: any) => {
        setRadioValue(e.target.value)
    }

    const messageOptions = [
        { label: '集群默认', value: 'default' },
        { label: '阿里云', value: 'ali' },
        { label: '腾讯云', value: 'tetent' },
        { label: '华为云', value: 'huawei' },
    ]
    //测试连通性
    const test = () => {

    }

    return (
        <Drawer
            width={700}
            title='新增节点'
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
                <Form.Item label='新增类型' name='type' rules={[{ required: true, message: '请选择' }]}>
                    <Radio.Group  >
                        <Radio value="master">Master </Radio>
                        <Radio value="node"> Node </Radio>
                    </Radio.Group>
                </Form.Item>
                {/* <Form.Item label='机器来源' name='origin' rules={[{ required: true, message: '请选择' }]} >
                    <Radio.Group value='nodeOrigin' onChange={(e) => { setNodeOrigin(e.target.value) }}>
                        <Radio value="aleady">已有 </Radio>
                        <Radio value="create"> 新建 </Radio>
                    </Radio.Group>
                </Form.Item> */}
                {
                    // nodeOrigin === 'aleady' && (
                    <div>
                        <p style={{ marginLeft: '24px' }}>节点信息</p>
                        <Form.Item label="IP地址" name="size" rules={[{ required: true, message: '请输入' }]}>
                            <Input style={{ width: 300 }} />
                            <span style={{ color: '#5183e7', marginLeft: '10px' }} onClick={() => { test }} >测试连通性</span>
                        </Form.Item>
                        <Form.Item label="ROOT账号" name="count" rules={[{ required: true, message: '请输入' }]}>
                            <Input style={{ width: 300 }} />
                        </Form.Item>
                        <Form.Item label="ROOT密码" name="password" rules={[{ required: true, message: '请输入' }]}>
                            <Input.Password style={{ width: 300 }} />
                        </Form.Item>
                    </div>
                    // )
                }
                {/* {
                    nodeOrigin === 'create' && (
                        <div>
                            <Form.Item label="供应商" name="person" rules={[{ required: true, message: '请选择' }]}>
                                <Radio.Group options={messageOptions}></Radio.Group>
                            </Form.Item>
                            <Form.Item label="规格" style={{ width: 300 }} name="size" rules={[{ required: true, message: '请选择' }]}>
                                <Select options={[]}></Select>
                            </Form.Item>
                        </div>
                    )
                } */}
            </Form>
        </Drawer>
    )
}