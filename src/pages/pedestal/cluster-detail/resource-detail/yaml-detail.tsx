import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, message } from 'antd';
import AceEditor from '@/components/ace-editor';
import { putRequest } from '@/utils/request';
export default function YamlDetail(props: any) {
    const { visible, onClose, initData } = props;
    const [form] = Form.useForm();
    const [readOnly, setReadOnly] = useState<boolean>(true);
    const handleOk = () => {
        const values = form.getFieldValue('value');
        // putRequest(updateNg, {
        //   data: {
        //     id: id,
        //     templateContext: values,
        //     ngInstCode: code,
        //   },
        // }).then((result) => {
        //   if (result.success) {
        //     message.success('编辑配置模版成功！');
        //     onSave?.();
        //   } else {
        //     message.error(result.errorMsg);
        //   }
        // });
    };
    const handleEdit = () => {
        setReadOnly((value) => !value);
    };
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ value: initData?.yaml, });
        }
    }, [initData, visible]);

    return (
        <Modal
            title="YAML详情"
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            width={'60%'}
            footer={[
                <Button key="submit" type="primary" onClick={onClose}>取消</Button>,
                // <Button type="primary" onClick={handleOk}>提交 </Button>,
            ]}
        >
            <div className="code-title">
                {/* 资源名称：<span>hbos - dtc</span> */}
            </div>
            <div>
                <Form form={form}>
                    <Form.Item name="value">
                        <AceEditor mode="yaml" height={'65vh'} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
