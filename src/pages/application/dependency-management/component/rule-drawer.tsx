// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio, Row, Col, DatePicker } from 'antd';
import { addRule, updateRule } from '../service'
import { fetchEnvList } from '@/pages/application/_components/application-editor/service'
import Icon, { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

export interface IProps {
    mode?: EditorMode;
    initData: any;
    onClose?: () => any;
    onSave?: () => any;
}

const levelOption = [
    { label: '警告', value: 'warning' },
    { label: '阻断', value: 'block' },
]

export default function RuleDrawer(props: any) {
    const { mode, onClose, onSave, initData } = props;
    const [form] = Form.useForm();
    const [envData, setEnvData] = useState<any>([])
    // const levelOption = useState<any>([]);
    // const [isDisabled, setIsDisabled] = useState<boolean>(false);
    useEffect(() => {
        if (mode === 'HIDE') return;
        if (mode === 'ADD') {
            form.resetFields();
        }
        if (mode === 'EDIT') {
            // setIsDisabled(true);
        } else {
            // setIsDisabled(false);
        }
        if (initData) {
            form.setFieldsValue({
                ...initData,
            });
        }
    }, [mode]);

    useEffect(() => { getEnvData() }, [])

    // 获取环境列表
    async function getEnvData() {
        const res = await fetchEnvList({
            pageIndex: 1,
            pageSize: 1000,
        });
        setEnvData(res || []);
    }

    const handleSubmit = async () => {
        const values = await form.validateFields();
        Object.assign(values, { blockTime: moment(values.blockTime).format('YYYY-MM-DD') })
        const res = await (mode === 'ADD' ? addRule({ ...values }) : updateRule({ ...values, id: initData?.id }));
        if (res && res.success) {
            message.success(`${mode === 'ADD' ? '新增' : '编辑'}成功`)
            onSave?.();
        }
    }
    return (
        <Drawer
            visible={mode !== 'HIDE'}
            title={mode === 'EDIT' ? '编辑规则' : '新增规则'}
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

                    <Form.Item label="规则名称：" name="ruleName" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入规则名称" ></Input>
                    </Form.Item>

                    <Form.Item label="groupId：" name="groupId" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入groupId" disabled={mode === 'EDIT'}></Input>
                    </Form.Item>

                    <Form.Item label="artifactId：" name="artifactId" rules={[{ required: true, message: '这是必填项' }]}>
                        <Input style={{ width: 230 }} placeholder="请输入artifactId" disabled={mode === 'EDIT'}></Input>
                    </Form.Item>

                    <Form.Item label="校验环境：" name="envCode" >
                        <Select style={{ width: 230 }} options={envData}>

                        </Select>
                    </Form.Item>
                    <Form.Item label="版本范围：" name="envCode" >
                        <div>
                            <Button style={{ margin: '0px 5px' }} size='small'>大于等于</Button>
                            <Input style={{ width: 150 }} placeholder="请输入"></Input>
                            <PlusCircleOutlined style={{ marginLeft: '5px' }} />
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <Button style={{ margin: '0px 5px' }} size='small'>小于等于</Button>
                            <Input placeholder="请输入" style={{ width: 150 }}></Input>
                        </div>
                    </Form.Item>
                    <Form.Item label="升级截止日期：" name="blockTime" rules={[{ required: true, message: '这是必填项' }]}>
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label="校验级别：" name="checkLevel" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select style={{ width: 230 }} options={levelOption}>
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </Drawer>
    );
}
