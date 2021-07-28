// 复制场景
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/05 15:47

import React, { useEffect, useState, useContext } from 'react';
import { Modal, Select, message, Form } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import FELayout from '@cffe/vc-layout';
import * as APIS from '../../service';
import { useCaseListByScene } from '../../hooks';
import { TreeNode, SelectOptions } from '../../interfaces';

export interface SceneCloneProps {
  target?: TreeNode;
  onClose?: () => any;
  onSave?: () => any;
}

export default function SceneClone(props: SceneCloneProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [moduleOptions, setModuleOptions] = useState<SelectOptions[]>([]);
  const [caseList] = useCaseListByScene(props.target?.bizId!);
  const [editField] = Form.useForm();

  useEffect(() => {
    if (!props.target) return;

    getRequest(APIS.getModulesByPro, {
      data: { projectId: props.target.projectId },
    }).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.name,
        value: n.id,
      }));

      setModuleOptions(source);
    });
  }, [props.target]);

  const handleOk = async () => {
    const { moduleId } = await editField.validateFields();
    const payload = {
      moduleId,
      sceneName: `copy_${props.target?.title}`,
      desc: props.target?.desc,
      cases: caseList.map((n) => n.id),
      createUser: userInfo.userName,
    };

    await postRequest(APIS.copyScene, { data: payload });
    message.success('复制成功！');
    props.onSave?.();
  };

  return (
    <Modal title="复制场景" visible={!!props.target} onCancel={props.onClose} onOk={handleOk} maskClosable={false}>
      <Form form={editField} labelCol={{ flex: '100px' }} wrapperCol={{ span: 17 }}>
        <Form.Item label="目标模块" name="moduleId" rules={[{ required: true, message: '请选择模块' }]}>
          <Select options={moduleOptions} placeholder="选择模块" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
