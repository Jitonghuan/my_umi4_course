import { Drawer, message, Form, Button, Checkbox, Input, Popconfirm, Radio } from 'antd';
import { useState, useEffect } from 'react';
import { SketchSquareFilled, UploadOutlined } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import { importCluster, updateCluster } from '../../service'


export default function AddDrawer(props: any) {
    const { mode, onClose, initData, onSave } = props;
    const [form] = Form.useForm<Record<string, string>>();
    const [checked, setChecked] = useState<boolean>(false);
    const [configChecked, setConfigChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (mode !== 'HIDE') {
            setChecked(false)
            setConfigChecked(false)
        }
        if (mode === 'ADD') {
            form.resetFields()
        }
        if (mode === 'EDIT') {
            form.setFieldsValue(initData)
            form.setFieldsValue({ prometheusPwd: '******', kubeConfig: '******' })
        }
    }, [mode])
    const handleSubmit = async () => {
        setLoading(true);
        const value = await form.validateFields();
        if (value.kubeConfig === '******') {
            value.kubeConfig = ''
        }
        if (value.prometheusPwd === '******') {
            value.prometheusPwd = ''
        }
        try {
            const res = await (mode === 'ADD' ? importCluster({ ...value }) : updateCluster({ ...value }));
            if (res?.success) {
                message.success(`${mode === 'ADD' ? '导入' : '编辑'}成功`);
                setLoading(false)
                onClose();
                onSave();
            }
        } catch (error) {
            setLoading(false)

        }
    }

    const handleChange = (e: any) => {
        setChecked(e.target.checked)
        form.setFieldsValue({ prometheusPwd: e.target.checked ? '' : '******' });
    }

    const configChange = (e: any) => {
        setConfigChecked(e.target.checked);
        form.setFieldsValue({ kubeConfig: e.target.checked ? '' : '******' });
    }

    return (
        <Drawer
            width='50%'
            title={mode === 'ADD' ? '导入集群' : '编辑集群'}
            placement="right"
            visible={mode !== 'HIDE'}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="default" onClick={onClose}>取消</Button>
                    {mode === 'ADD' && <Button type="primary" onClick={handleSubmit} loading={loading}>导入</Button>}
                    {mode === 'EDIT' && <Popconfirm title='确定保存所做的修改吗？？' onConfirm={handleSubmit}><Button type="primary" loading={loading}>保存</Button></Popconfirm>}
                </div>
            }
        >
            <Form form={form} labelCol={{ flex: '130px' }}>
                <Form.Item label="集群名称" name="clusterName" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} />
                </Form.Item>
                <Form.Item label="集群code" name="clusterCode" rules={[{ required: true, message: '请输入' }]}>
                    <Input style={{ width: 340 }} disabled={mode === 'EDIT'} />
                </Form.Item>
                <Form.Item label="prometheusUrl" name="prometheusUrl">
                    <Input style={{ width: 340 }} />
                </Form.Item>

                <Form.Item
                    label="prometheusUser"
                    name="prometheusUser"
                >
                    <Input style={{ width: 340 }} />
                </Form.Item>
                {mode === 'EDIT' && (
                    <Form.Item label="修改密码">
                        <Checkbox onChange={handleChange} checked={checked}></Checkbox>
                    </Form.Item>
                )}
                <Form.Item
                    label="prometheusPwd"
                    name="prometheusPwd"
                >
                    <Input.Password style={{ width: 340 }} disabled={mode === 'EDIT' && !checked} visibilityToggle={mode === 'EDIT' && !checked ? false : true} />
                </Form.Item>

                {mode === 'EDIT' && (
                    <Form.Item label="修改kubeConfig">
                        <Checkbox onChange={configChange} checked={configChecked}></Checkbox>
                    </Form.Item>
                )}

                <Form.Item
                    name="kubeConfig"
                    label="kubeConfig"
                    rules={[{ required: mode === 'ADD' ? true : false, message: '请输入' }]}
                >
                    <AceEditor mode="yaml" height={450} readOnly={mode === 'EDIT' && !configChecked} />
                </Form.Item>

            </Form>
        </Drawer>
    )
}