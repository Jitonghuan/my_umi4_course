// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect} from 'react';
import { Form, Button, Input,  Modal,Spin } from 'antd';
import { useUpdateNamespace, useCreateNamespace,getSingleNacosNamespace } from '../hook'

export interface CreateArticleProps {
    mode?: EditorMode;
    initData?: any;
    envCode: string;
    onClose: () => any;
    onSave: () => any;
}

export default function CreateNamespace(props: CreateArticleProps) {
    const { mode, initData, onClose, onSave, envCode } = props;
    const [editForm] = Form.useForm();
    const [createLoading, createNamespace] = useCreateNamespace();
    const [updateLoading, updateNamespace] = useUpdateNamespace()
    const [viewDisabled, seViewDisabled] = useState<boolean>(false);
    const [loading,setLoading]= useState<boolean>(false);

    useEffect(() => {
        if (mode === 'HIDE' || !initData) return;
        if (mode !== 'ADD') {

            setLoading(true)
            editForm.setFieldsValue({
                ...initData
            });
            getSingleNacosNamespace(
                envCode,
                initData?.namespaceId
            ).then((res)=>{
                editForm.setFieldsValue({
                    namespaceDesc:res?.namespaceDesc
                });

            }).finally(()=>{
                setLoading(false)
            })

        }

        if (mode === 'VIEW') {
            seViewDisabled(true);
         
        }

        return () => {
            seViewDisabled(false);
            editForm.resetFields();
        };
    }, [mode]);
    const handleSubmit = () => {
        const params = editForm.getFieldsValue();
        if (mode === 'EDIT') {
            updateNamespace({ ...params, envCode }).then(() => {
                onSave()
            })

        }
        if (mode === 'ADD') {
            createNamespace({ ...params, envCode }).then(() => {
                onSave()
            })

        }
    };



    return (
        <Modal
            destroyOnClose
            width={700}
            title={mode === 'EDIT' ? '编辑命名空间' : mode === 'VIEW' ? '查看命名空间' : '新增命名空间'}
            visible={mode !== 'HIDE'}
            onCancel={onClose}
            maskClosable={false}
            footer={
                <div className="drawer-footer">
                    <Button type="primary" loading={createLoading || updateLoading} onClick={handleSubmit} disabled={viewDisabled}>
                        保存
                     </Button>
                    <Button type="default" onClick={onClose}>
                        取消
                    </Button>
                </div>
            }
        ><Spin spinning={loading}>
              <Form form={editForm} labelCol={{ flex: '150px' }} labelWrap colon={false}>
                {mode === "ADD" && <Form.Item label="命名空间ID（不填则自动生成）" name="namespaceId" >
                    <Input  style={{ width: 400 }} />
                </Form.Item>}
                {mode === "VIEW" && <Form.Item label="命名空间ID" name="namespaceId" >
                    <Input disabled={true} style={{ width: 400 }} />
                </Form.Item>}
                <Form.Item label="命名空间名" name="namespaceShowName" rules={[{ required: true, message: '请填写' }]}>
                    <Input disabled={viewDisabled} style={{ width: 400 }} />
                </Form.Item>
                {mode === "VIEW" && (
                    <Form.Item label="配置数" name="configCount" >
                        <Input disabled={true} style={{ width: 400 }} />
                    </Form.Item>
                )}

                <Form.Item label="描述" name="namespaceDesc" rules={[{ required: true, message: '请填写' }]}>
                    <Input disabled={viewDisabled} style={{ width: 400 }} />
                </Form.Item>

            </Form>

        </Spin>
          
        </Modal>
    );
}
