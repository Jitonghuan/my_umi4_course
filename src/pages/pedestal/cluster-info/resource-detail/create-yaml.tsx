// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio } from 'antd';
import AceEditor from '@/components/ace-editor';
import './index.less';

export default function CreateYaml(props: any) {
    const { visible, onClose, onSave, initData } = props;
    const [createNgForm] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    useEffect(() => {

    }, [visible]);

    const handleSubmit = async () => {

    };
    return (
        <Drawer
            visible={visible}
            title='输入YAML'
            maskClosable={false}
            onClose={onClose}
            width={'40%'}
            footer={
                isDisabled !== true && (
                    <div className="drawer-footer">
                        <Button type="default" onClick={onClose}>取消 </Button>
                        <Button type="primary" onClick={handleSubmit}>保存</Button>
                    </div>
                )
            }
        >
            <div className="add-yaml">
                <Form
                    form={createNgForm}
                    labelCol={{ flex: '120px' }}
                    onFinish={handleSubmit}
                    onReset={() => {
                        createNgForm.resetFields();
                    }}
                >
                    <Form.Item label="" name="value" className="form-ace" style={{ flexDirection: 'column' }}>
                        <AceEditor mode="yaml" height={800} />
                    </Form.Item>
                </Form>
            </div>
        </Drawer>
    );
}
