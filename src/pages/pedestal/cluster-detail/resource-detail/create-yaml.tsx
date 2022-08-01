// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React, { useContext } from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio } from 'antd';
import AceEditor from '@/components/ace-editor';
import clusterContext from '../context';
import { resourceCreate } from '../service'
import './index.less';

export default function CreateYaml(props: any) {
    const { visible, onClose, onSave, initData } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)
    const { clusterCode, cluseterName } = useContext(clusterContext);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);

    const handleSubmit = async () => {
        setLoading(true)
        const value = form.getFieldsValue();
        const res = await resourceCreate({ ...value, clusterCode });
        setLoading(false)
        if (res?.success) {
            message.success('创建成功！')
            onSave?.();
        }
    };
    return (
        <Drawer
            visible={visible}
            title='输入YAML'
            maskClosable={false}
            onClose={onClose}
            width={'40%'}
            footer={
                // isDisabled !== true && (
                <div className="drawer-footer">
                    <Button type="default" onClick={onClose}>取消 </Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>保存</Button>
                </div>
                // )
            }
        >
            <div className="add-yaml">
                <Form
                    form={form}
                    labelCol={{ flex: '120px' }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label="" name="yaml" className="form-ace" style={{ flexDirection: 'column' }}>
                        <AceEditor mode="yaml" height={800} />
                    </Form.Item>
                </Form>
            </div>
        </Drawer>
    );
}
