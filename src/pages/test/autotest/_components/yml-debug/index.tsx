import React, { useState, useEffect } from 'react';
import { Modal, message, Select, Form, Input } from 'antd';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { CaseItemVO } from '../../interfaces';
import { useEnvOptions } from '../../hooks';

export interface CaseDebugProps {
  visible?: boolean;
  onClose?: () => any;
  ymlData: any;
}

export default function CaseDebug(props: CaseDebugProps) {
  const [editField] = Form.useForm<{ envId: string }>();
  const [envOptions] = useEnvOptions();
  const [pending, setPending] = useState(false);
  const [resultURL, setResultURL] = useState<string>();
  const [errorStack, setErrorStack] = useState('');

  useEffect(() => {
    if (!props.visible) return;

    editField.resetFields();
  }, [props.visible]);

  const handleOk = async () => {
    const { envId } = await editField.validateFields();

    setPending(true);
    try {
      const result = await postRequest(
        APIS.debugYml,
        {
          data: {
            envId,
            ...props.ymlData,
          },
        },
        true,
      );

      if (!result.data?.report) {
        message.warn('用例调试失败！');
        throw result;
      }
      setResultURL(result.data.report);
      props.onClose?.();
    } catch (ex: any) {
      if (ex.data?.error) {
        setErrorStack(ex.data?.error);
        props.onClose?.();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Modal
        key="debug"
        visible={props.visible}
        title="用例调试"
        onOk={handleOk}
        onCancel={props.onClose}
        maskClosable={false}
        confirmLoading={pending}
      >
        <Form form={editField} labelCol={{ flex: '80px' }}>
          <Form.Item label="调试环境" name="envId" rules={[{ required: true, message: '请选择环境' }]}>
            <Select placeholder="请选择" options={envOptions} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        key="stack"
        visible={!!errorStack}
        title="错误信息"
        footer={false}
        width={800}
        maskClosable={false}
        onCancel={() => setErrorStack('')}
      >
        <Input.TextArea value={errorStack} rows={20} style={{ color: 'red' }} />
      </Modal>
      <Modal
        key="result"
        visible={!!resultURL}
        title="调试结果"
        footer={false}
        width={1000}
        onCancel={() => setResultURL(undefined)}
        bodyStyle={{ padding: 0 }}
        maskClosable={false}
      >
        <iframe src={resultURL} frameBorder="0" style={{ width: 1000, height: '72vh' }} />
      </Modal>
    </>
  );
}
