import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, message } from 'antd';
import AceEditor from '@/components/ace-editor';
import { updateYaml } from '../service';
import clusterContext from '../context';

export default function YamlDetail(props: any) {
  const { visible, onClose, initData, onSave } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { clusterCode, cluseterName } = useContext(clusterContext);
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ value: initData?.yaml });
    }
  }, [initData, visible]);

  const handleOk = () => {
    setLoading(true)
    const value = form.getFieldValue('value');
    updateYaml({ clusterCode, yaml: value, resourceName: initData?.name || '' }).then((result) => {
      if (result?.success) {
        message.success('操作成功！');
        onSave?.();
      }
    }).finally(() => { setLoading(false) });
  }

  return (
    <Modal
      title="YAML详情"
      visible={visible}
      onCancel={onClose}
      width={'70%'}
      footer={[
        // <Button type="primary" danger={!readOnly} style={{ position: 'absolute', left: '20px' }} onClick={handleEdit}>
        //   {readOnly ? '编辑' : '保存编辑'}
        // </Button>,
        <Button key="submit" type="primary" onClick={onClose}>
          取消
      </Button>,
        <Button type="primary" onClick={handleOk} loading={loading}>
          保存
      </Button>,
      ]}
    >
      <div className="code-title"></div>
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
