// 用例执行
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:20

import React, { useState, useEffect } from 'react';
import { Modal, message, Select, Form } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { CaseItemVO, SelectOptions } from '../interfaces';

export interface CaseExecProps {
  visible?: boolean;
  caseList?: CaseItemVO[];
  onClose?: () => any;
}

export default function CaseExec(props: CaseExecProps) {
  const [editField] = Form.useForm<{ envId: string }>();
  const [envOptions, setEnvOptions] = useState<SelectOptions[]>([]);

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
    await postRequest(APIS.runCaseByIds, {
      data: {
        envId,
        ids: props.caseList?.map((n) => n.id),
      },
    });

    message.success('用例执行成功！');
    props.onClose?.();
  };

  return (
    <Modal
      visible={props.visible}
      title="用例执行"
      onOk={handleOk}
      onCancel={props.onClose}
    >
      <Form form={editField} labelCol={{ flex: '80px' }}>
        <Form.Item
          label="执行环境"
          name="envId"
          rules={[{ required: true, message: '请选择环境' }]}
        >
          <Select placeholder="请选择" options={envOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
