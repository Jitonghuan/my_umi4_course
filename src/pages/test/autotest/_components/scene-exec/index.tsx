// 执行场景
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/05 14:51

import React, { useState, useEffect } from 'react';
import { Select, Modal, message, Form, Input } from 'antd';
import * as APIS from '../../service';
import { postRequest } from '@/utils/request';
import { TreeNode } from '../../interfaces';
import { useEnvOptions } from '../../hooks';

export interface SceneExecProps {
  target?: TreeNode;
  onClose?: () => any;
}

export default function SceneExec(props: SceneExecProps) {
  const [editField] = Form.useForm();
  const [envOptions] = useEnvOptions();
  const [pending, setPending] = useState(false);
  const [resultURL, setResultURL] = useState<string>();
  const [errorStack, setErrorStack] = useState('');

  useEffect(() => {
    if (!props.target) return;

    editField.resetFields();
  }, [props.target]);

  const handleOk = async () => {
    const { envId } = await editField.validateFields();

    setPending(true);
    try {
      const result = await postRequest(
        APIS.executeScene,
        {
          data: { envId, id: props.target?.bizId },
        },
        true,
      );

      if (!result.data?.report) {
        message.warn('用例执行失败！');
        throw result;
      }
      setResultURL(result.data.report);
      props.onClose?.();
    } catch (ex) {
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
        visible={!!props.target}
        title="执行场景"
        onCancel={props.onClose}
        onOk={handleOk}
        maskClosable={false}
        confirmLoading={pending}
      >
        <Form form={editField} labelCol={{ flex: '100px' }} wrapperCol={{ span: 17 }}>
          <Form.Item label="场景名称">
            <Input disabled value={props.target?.title} />
          </Form.Item>
          <Form.Item label="执行环境" name="envId" rules={[{ required: true, message: '请选择环境' }]}>
            <Select placeholder="选择执行环境" options={envOptions} />
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
        title="执行结果"
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
