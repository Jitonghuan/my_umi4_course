import React, { useEffect, useState, useContext } from 'react';
import { Modal, Select, message, Form } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import FELayout from '@cffe/vc-layout';
import * as APIS from '../../service';
import { useCaseListByScene } from '../../hooks';
import { TreeNode } from '../../interfaces';

export interface ApiCloneProps {
  target?: TreeNode;
  onClose?: () => any;
  onSave?: () => any;
}

export default function SceneClone(props: ApiCloneProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [moduleOptions, setModuleOptions] = useState<IOption[]>([]);
  const [caseList] = useCaseListByScene(props.target?.bizId!);
  const [editField] = Form.useForm();

  useEffect(() => {
    if (!props.target) return;

    console.log('props.target :>> ', props.target);

    getRequest(APIS.getModules, {
      data: { id: props.target.projectId },
    }).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.name,
        value: n.moduleId,
      }));

      setModuleOptions(source);
    });
  }, [props.target]);

  const handleOk = async () => {
    const { moduleId } = await editField.validateFields();

    const { data: apiInfo } = await getRequest(APIS.getApiInfo, { data: { id: props.target?.bizId } });

    const payload = {
      ...apiInfo,
      moduleId,
      copy_name: apiInfo.name,
      createUser: userInfo.userName,
      modifyUser: userInfo.userName,
    };

    await postRequest(APIS.copyApi, { data: payload });
    message.success('复制成功！');
    props.onSave?.();
  };

  return (
    <Modal title="复制API" visible={!!props.target} onCancel={props.onClose} onOk={handleOk} maskClosable={false}>
      <Form form={editField} labelCol={{ flex: '100px' }} wrapperCol={{ span: 17 }}>
        <Form.Item label="目标模块" name="moduleId" rules={[{ required: true, message: '请选择模块' }]}>
          <Select options={moduleOptions} placeholder="选择模块" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
