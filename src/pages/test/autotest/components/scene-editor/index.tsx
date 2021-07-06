// 新增 / 编辑场景
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 16:58

import React, { useEffect, useCallback, useContext } from 'react';
import { Form, Input, Modal, message } from 'antd';
import FELayout from '@cffe/vc-layout';
import * as APIS from '../../service';
import { postRequest } from '@/utils/request';
import { TreeNode, EditorMode } from '../../interfaces';

export interface SceneEditorProps {
  mode: EditorMode;
  /** 触发节点，如果是编辑，则也是编辑的目标节点，如果是新增，则表示要挂载的项目 */
  targetNode?: TreeNode;
  onClose: () => any;
  onSave: () => any;
}

export default function ModuleEditor(props: SceneEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode = 'HIDE', onClose, onSave, targetNode } = props;
  const [editField] = Form.useForm<{ sceneName: string; desc: string }>();

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'ADD') {
      editField.resetFields();
      return;
    }

    editField.setFieldsValue({
      sceneName: targetNode?.title || '',
      desc: targetNode?.desc || '',
    });
  }, [mode]);

  const handleOk = useCallback(async () => {
    const { desc, sceneName } = await editField.validateFields();

    if (mode === 'ADD') {
      const payload = {
        moduleId: targetNode?.bizId!,
        sceneName,
        desc,
        createUser: userInfo.userName,
      };
      await postRequest(APIS.addSceneNode, {
        data: payload,
      });

      message.success('新增成功！');
      onSave();
    } else {
      const payload = {
        id: targetNode?.bizId!,
        moduleId: targetNode?.moduleId,
        sceneName,
        desc,
        modifyUser: userInfo.userName,
      };
      await postRequest(APIS.updateSceneNode, {
        data: payload,
      });

      message.success('保存成功！');
      onSave();
    }
  }, [mode, targetNode]);

  return (
    <Modal
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑场景' : '新增场景'}
      onOk={handleOk}
      onCancel={() => onClose()}
    >
      <Form form={editField} labelCol={{ flex: '80px' }}>
        <Form.Item label="场景名称" name="sceneName" rules={[{ required: true, message: '请输入场景名称' }]}>
          <Input placeholder="请输入场景名称" autoFocus />
        </Form.Item>
        <Form.Item label="场景描述" name="desc">
          <Input.TextArea placeholder="请输入场景描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
