// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio } from 'antd';
import { updataNoise, addNoise } from '../../../service'
import { useEnvOptions } from '../../../hooks';

export interface IProps {
    mode?: EditorMode;
    initData: any;
    onClose?: () => any;
    onSave?: () => any;
}

export default function addEnvData(props: IProps) {
    const { mode, onClose, onSave, initData } = props;
    const [form] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [envOptions]: any[][] = useEnvOptions();
    useEffect(() => {
        if (mode === 'HIDE') return;
        if (mode === 'ADD') {
            form.resetFields();
        }
        if (mode === 'EDIT') {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
        if (initData) {
            form.setFieldsValue({
                ...initData,
            });
        }
    }, [mode]);

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const res = await (mode === 'ADD' ? addNoise({ ...values }) : updataNoise({ ...values, id: initData?.id }));
        if (res && res.success) {
            message.success(`${mode === 'ADD' ? '新增' : '编辑'}成功`)
            onSave?.();
        }
    }
    return (
        <Drawer
            visible={mode !== 'HIDE'}
            title={mode === 'EDIT' ? '编辑降噪配置' : '新增降噪配置'}
            maskClosable={false}
            onClose={onClose}
            width={'40%'}
            footer={
                (
                    <div className="drawer-footer">
                        <Button type="default" onClick={onClose}>取消</Button>
                        <Button type="primary" onClick={handleSubmit}>保存</Button>
                    </div>
                )
            }
        >
            <div className="envAdd">
                <Form
                    form={form}
                    labelCol={{ flex: '120px' }}
                    onFinish={handleSubmit}
                >
                    {/* <Form.Item label="所属环境：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select
                            options={envOptions}
                            showSearch
                            style={{ width: 180 }}
                            disabled={isDisabled}
                        />
                    </Form.Item> */}

                    <Form.Item label="降噪配置名称：" name="noiseReductionName" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入降噪名称" ></Input>
                    </Form.Item>

                    <Form.Item label="降噪组件：" name="noiseReductionComponent" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入降噪组件" ></Input>
                    </Form.Item>

                    <Form.Item label="降噪措施：" name="noiseReductionMeasure" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select style={{ width: 230 }}>
                            <Select.Option value='merge'>merge</Select.Option>
                            <Select.Option value='ignore'>ignore</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="是否启用：" name="isEnable" rules={[{ required: true, message: '这是必选项' }]}>
                        <Radio.Group>
                            <Radio value={true}>启用</Radio>
                            <Radio value={false}>禁用</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Form>
            </div>
        </Drawer>
    );
}
