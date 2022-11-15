import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, message, Switch, InputNumber, Space } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { hpaCreate, hpaUpdate } from '../../service';
import './index.less'

export default function CreateEditRule(props: any) {
    const { mode, onClose, initData, onSave, clusterCode } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (mode === 'ADD') {
            form.resetFields();
            form.setFieldsValue({ labelRel: [undefined], hpaSwitch: false })
        }
        if (mode === 'EDIT') {
            const labels = Object.keys((initData?.labelRel || [])).map((item) => ({ key: item, value: initData?.labelRel[item] }));
            form.setFieldsValue({
                ...initData,
                labelRel: labels.length ? labels : [undefined],
                checked: initData.hpaSwitch,
            })
        }
    }, [mode])
    const handleSubmit = async () => {
        const value = await form.validateFields();
        const { id } = initData || {}
        let labels: any = {};
        const tags = value['labelRel'];
        tags.forEach((item: any) => {
            labels[item.key] = item.value;
        });
        value.labelRel = labels;
        setLoading(true)
        try {
            const res = await (mode === 'ADD' ? hpaCreate({ ...value, clusterCode }) : hpaUpdate({ ...value, clusterCode, id }));
            if (res?.success) {
                message.success(`${mode === 'ADD' ? '新增' : '修改'}成功`);
                onClose();
                onSave();
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <Drawer
            visible={mode !== 'HIDE'}
            title={mode === 'EDIT' ? '编辑规则' : mode === 'VIEW' ? '规则详情' : '创建规则'}
            maskClosable={false}
            onClose={onClose}
            width={'50%'}
            className='create-edit-pha-rule'
            footer={
                <div className="drawer-footer">
                    <Button type="default" onClick={onClose}>
                        取消
      </Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        {mode === 'ADD' ? '创建' : '保存'}
                    </Button>
                </div>
            }
        >
            <div className="creat-rule">
                <Form form={form} labelCol={{ flex: '120px' }}>
                    <Form.Item label="规则名称：" name="ruleName" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 300 }} placeholder="请输入环境名称"></Input>
                    </Form.Item>
                    <Form.Item label="弹性伸缩：" name="hpaSwitch" valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                    <Form.Item label='扩容阈值(高于)：' name='expansionThreshold' rules={[{ required: true, message: '这是必填项' }]}>
                        <InputNumber style={{ width: 200 }} addonAfter="%" placeholder='请输入' min={0} max={100} />
                    </Form.Item>
                    <Form.Item label='扩容阈值(低于)：' name='shrinkageThreshold' rules={[{ required: true, message: '这是必填项' }]}>
                        <InputNumber style={{ width: 200 }} addonAfter="%" placeholder='请输入' min={0} max={100} />
                    </Form.Item>
                    <Form.Item label='静默时间：' name='silenceTime' rules={[{ required: true, message: '这是必填项' }]}>
                        <InputNumber style={{ width: 200 }} addonAfter="min" placeholder='请输入' min={0} />
                    </Form.Item>
                    <Form.Item label="关联标签">
                        <Form.List name="labelRel" >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} align='start'>

                                            <Form.Item
                                                className="v-item"
                                                {...field}
                                                name={[field.name, 'key']}
                                                label={index === 0 ? 'KEY' : ''}
                                                rules={[{ required: true, message: '此项为必填项' }]}
                                            >
                                                <Input style={{ width: '150px' }} />
                                            </Form.Item>
                                            <span style={{ verticalAlign: 'text-bottom', lineHeight: '65px' }}>=</span>
                                            <Form.Item
                                                {...field}
                                                // style={{ marginLeft: '40px' }}
                                                label={index === 0 ? 'VALUE' : ''}
                                                className="v-item"
                                                name={[field.name, 'value']}
                                            >
                                                <Input style={{ width: '150px' }} />
                                            </Form.Item>
                                            <Form.Item>
                                                {index !== 0 ? <MinusCircleOutlined className="tag-icon" onClick={() => remove(field.name)} /> : null}
                                            </Form.Item>
                                            <Form.Item>
                                                <PlusCircleOutlined className="tag-icon" onClick={() => add()} />
                                            </Form.Item>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </div>
        </Drawer>

    )
}