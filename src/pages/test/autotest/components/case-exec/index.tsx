// 用例执行
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:20

import React, { useState, useEffect } from 'react';
import { Modal, message, Select, Form, Input } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { CaseItemVO, SelectOptions } from '../../interfaces';

export interface CaseExecProps {
  visible?: boolean;
  caseList?: CaseItemVO[];
  onClose?: () => any;
}

export default function CaseExec(props: CaseExecProps) {
  const [editField] = Form.useForm<{ envId: string }>();
  const [envOptions, setEnvOptions] = useState<SelectOptions[]>([]);
  const [pending, setPending] = useState(false);
  const [resultURL, setResultURL] = useState<string>();
  const [errorStack, setErrorStack] = useState('');

  useEffect(() => {
    if (!props.visible || !props.caseList?.length) return;

    editField.resetFields();
    getRequest(APIS.envList).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.name,
        value: n.id,
      }));

      setEnvOptions(source);
    });
  }, [props.visible]);

  const handleOk = async () => {
    const { envId } = await editField.validateFields();

    setPending(true);
    try {
      const result = await postRequest(
        APIS.runCaseByIds,
        {
          data: {
            envId,
            ids: props.caseList?.map((n) => n.id),
          },
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
        key="exec"
        visible={props.visible}
        title="用例执行"
        onOk={handleOk}
        onCancel={props.onClose}
        maskClosable={false}
        confirmLoading={pending}
      >
        <Form form={editField} labelCol={{ flex: '80px' }}>
          <Form.Item label="执行环境" name="envId" rules={[{ required: true, message: '请选择环境' }]}>
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
