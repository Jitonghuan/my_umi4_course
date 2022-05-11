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
    // initData?: record;
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
        form.resetFields();
        if (mode === 'VIEW') {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
        if (initData) {
            form.setFieldsValue({
                ...initData,
                value: initData.templateContext,
            });
        }
    }, [mode]);

    const handleSubmit = async () => {
        if (mode === 'ADD') {

        } else if (mode === 'EDIT') {

        };
    }
    return (
        <Drawer
            visible={mode !== 'HIDE'}
            title={mode === 'EDIT' ? '编辑降噪配置' : '新增降噪配置'}
            maskClosable={false}
            onClose={onClose}
            width={'40%'}
            footer={
                isDisabled !== true && (
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
                    onReset={() => {
                        form.resetFields();
                    }}
                >
                    <Form.Item label="所属环境：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select
                            options={envOptions}
                            showSearch
                            style={{ width: 140 }}
                        />
                    </Form.Item>

                    <Form.Item label="降噪配置名称：" name="noiseReductionName" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入降噪名称" disabled={isDisabled}></Input>
                    </Form.Item>

                    <Form.Item label="降噪组件：" name="noiseReductionComponents" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入降噪组件" disabled={isDisabled}></Input>
                    </Form.Item>

                    <Form.Item label="降噪措施：" name="noiseReductionMeasure" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入降噪措施" disabled={isDisabled}></Input>
                    </Form.Item>

                    <Form.Item label="是否启用：" name="isEnable" >
                        <Radio.Group>
                            <Radio value={1}>启用</Radio>
                            <Radio value={0}>禁用</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Form>
            </div>
        </Drawer>
    );
}
