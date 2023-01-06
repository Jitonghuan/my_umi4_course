import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { Modal, Form, Select, message } from 'antd';
import AceEditor from '@/components/ace-editor';
import { addConfig, getAppList } from '../../../service';
import './index.less';

export default function AddConfigSql(props: any) {
    const { visible, onClose, onSave, categoryData, releaseId, initCategory } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [category, setCategory] = useState<any>({});
    const [appList, setAppList] = useState<any>([]);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setCategory(initCategory?.label);
            form.setFieldsValue({ category: initCategory?.label });
            getAppData(initCategory?.value)
        }
    }, [visible, initCategory])

    const handleSubmit = async () => {
        const value = await form.validateFields();
        value.category = undefined;
        setLoading(true)
        addConfig({ ...value, releaseId: Number(releaseId) }).then((res) => {
            if (res?.success) {
                message.success('新增成功！');
                onClose();
                onSave();
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const getAppData = (code: string) => {
        getAppList({ appCategoryCode: code, pageIndex: -1, pageSize: -1 }).then((res) => {
            if (res?.success) {
                const data = res?.data?.dataSource.map((item: any) => ({ label: item.appName, value: item.appCode }))
                setAppList(data)
            } else {
                setAppList([])
            }
        })
    }

    return (
        <Modal
            title="新增配置/sql"
            visible={visible}
            width={800}
            className='add-config-sql-modal'
            confirmLoading={loading}
            onOk={() => { handleSubmit() }}
            onCancel={onClose}
        >

            <div>
                <Form form={form} labelCol={{ flex: "80px" }} preserve={false}>
                    <Form.Item label="应用分类：" name="category" rules={[{ required: true, message: '请选择' }]}>
                        <Select style={{ width: 240 }} options={categoryData || []} value={category} disabled />
                    </Form.Item>
                    <Form.Item label="应用：" name="appCode" rules={[{ required: true, message: '请选择' }]}>
                        <Select
                            style={{ width: 240 }}
                            options={appList}
                            showSearch
                            allowClear
                            // labelInValue
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item name="config" label="配置" >
                        <AceEditor mode="yaml" height={300} />
                    </Form.Item>
                    <Form.Item name="sql" label="Sql" >
                        <AceEditor mode="sql" height={300} />
                    </Form.Item>
                </Form>
            </div>

        </Modal>
    )
}
