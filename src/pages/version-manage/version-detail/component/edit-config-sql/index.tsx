import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { Modal, Form, Select, message } from 'antd';
import AceEditor from '@/components/ace-editor';
import { editData } from '../../../service';
import { init } from 'echarts';

export default function EditModal(props: any) {
    const { onClose, onSave, type, initData, releaseId } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (type) {
            form.resetFields();
            if (type === 'config') {
                form.setFieldsValue({ config: initData.value })
            }
            if (type === 'sql') {
                form.setFieldsValue({ sql: initData.value })
            }
        }
    }, [type])

    const handleSubmit = async () => {
        const value = await form.validateFields();
        setLoading(true)
        editData({ ...value, appCode: initData?.appCode, releaseId: Number(releaseId) }).then((res) => {
            if (res?.success) {
                message.success('编辑成功！');
                onClose();
                onSave();
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <Modal
            title={`编辑${type === 'config' ? '配置' : 'sql'}`}
            visible={type === 'config' || type === 'sql'}
            width={800}
            className='add-config-sql-modal'
            confirmLoading={loading}
            onOk={() => { handleSubmit() }}
            onCancel={onClose}
        >

            <div>
                <Form form={form} labelCol={{ flex: "40px" }} preserve={false}>
                    {type === 'config' && <Form.Item name="config" label="配置" >
                        <AceEditor mode="yaml" height={300} />
                    </Form.Item>}
                    {type === 'sql' && <Form.Item name="sql" label="Sql" >
                        <AceEditor mode="sql" height={300} />
                    </Form.Item>}
                </Form>
            </div>

        </Modal>
    )
}
