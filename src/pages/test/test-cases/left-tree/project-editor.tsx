// 新增/编辑 项目
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/01 08:42

import React, { useEffect, useCallback, useContext } from 'react';
import { Form, Input, Modal, message } from 'antd';
import FELayout from '@cffe/vc-layout';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import { TreeNode, TreeNodeSaveData, EditorMode } from '../interfaces';

export interface ProjectEditorProps {
  mode: EditorMode;
  /** 触发节点，如果是编辑，则也是编辑的目标节点 */
  targetNode?: TreeNode;
  onClose: () => any;
  onSave: (data: TreeNodeSaveData, targetNode: TreeNode) => any;
}

export default function ProjectEditor(props: ProjectEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode = 'HIDE', onClose, onSave, targetNode } = props;
  const [editField] = Form.useForm<{ name: string; desc: string }>();

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'ADD') {
      editField.resetFields();
      return;
    }

    editField.setFieldsValue({
      name: targetNode?.title || '',
      desc: targetNode?.desc || '',
    });
  }, [mode]);

  const handleOk = useCallback(async () => {
    const { desc, name } = await editField.validateFields();

    if (mode === 'ADD') {
      const payload = {
        name: name,
        desc: desc,
        createUser: userInfo.userName,
      };
      await postRequest(APIS.addProject, {
        data: payload,
      });

      message.success('新增成功！');
      onSave(payload, targetNode!);
    } else {
      const payload = {
        id: targetNode?.bizId!,
        name: name,
        desc: desc,
        modifyUser: userInfo.userName,
      };
      await postRequest(APIS.updateProject, {
        data: payload,
      });

      message.success('保存成功！');
      onSave(payload, targetNode!);
    }
  }, [mode, targetNode]);

  return (
    <Modal
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑项目' : '新增项目'}
      onOk={handleOk}
      onCancel={() => onClose()}
    >
      <Form form={editField} labelCol={{ flex: '80px' }}>
        <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请输入项目名称' }]}>
          <Input placeholder="请输入项目名称" autoFocus />
        </Form.Item>
        <Form.Item label="项目描述" name="desc">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
