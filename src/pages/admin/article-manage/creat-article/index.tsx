// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Switch } from 'antd';
import ReactWEditor from 'wangeditor-for-react/lib/core';
import { typeOptions } from '../schema';
import { useAddArticle, useUpdateArticle } from '../hook';

export interface MemberEditorProps {
  mode?: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const [addLoading, createArticle] = useAddArticle();
  const [updateLoading, updateArticle] = useUpdateArticle();
  const { mode, initData, onClose, onSave } = props;
  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isPriorityChangeOption, setIsPriorityChangeOption] = useState<number>(0);
  const [description, setDescription] = useState<any>(); // 富文本数据
  const [resetDescription, setResetDescription] = useState<any>(); // 重置富文本使用

  useEffect(() => {
    if (mode === 'HIDE' || !initData) return;
    if (mode !== 'ADD') {
      if (initData.priority === 1) {
        setIsChecked(true);
        setIsPriorityChangeOption(1);
      } else {
        setIsChecked(false);
        setIsPriorityChangeOption(0);
      }
      editForm.setFieldsValue({
        title: initData?.title,
        type: initData?.type,
        content: initData?.content,
      });
      setResetDescription(initData?.content);
    }

    if (mode === 'VIEW') {
      seViewDisabled(true);
    }
    if (mode === 'ADD') return;

    return () => {
      seViewDisabled(false);
      setIsChecked(false);
      setIsPriorityChangeOption(0);
      editForm.resetFields();
      setResetDescription('');
    };
  }, [mode]);
  const handleSubmit = () => {
    const params = editForm.getFieldsValue();
    console.log('params', params);
    if (mode === 'EDIT') {
      updateArticle({
        id: initData?.id,
        title: params?.title,
        content: description,
        type: params?.type,
        priority: isPriorityChangeOption,
      }).then(() => {
        onSave();
      });
    }
    if (mode === 'ADD') {
      createArticle({
        title: params?.title,
        content: description,
        type: params?.type,
        priority: isPriorityChangeOption,
      }).then(() => {
        onSave();
      });
    }
  };

  //是否置顶
  const isPriorityChange = (checked: boolean) => {
    if (checked === true) {
      setIsChecked(true);
      setIsPriorityChangeOption(1);
    } else {
      setIsChecked(false);
      setIsPriorityChangeOption(0);
    }
  };

  return (
    <Drawer
      width={700}
      title={mode === 'EDIT' ? '编辑' : mode === 'VIEW' ? '查看' : '新增'}
      placement="right"
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={addLoading || updateLoading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editForm} labelCol={{ flex: '80px' }}>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={viewDisabled} style={{ width: 520 }} />
        </Form.Item>
        <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择' }]}>
          <Select options={typeOptions} disabled={viewDisabled} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入' }]}>
          {/* <Input.TextArea disabled={viewDisabled} style={{ width: 520 }} /> */}
          <div>
            <ReactWEditor
              config={{
                uploadImgShowBase64: true,
                uploadImgMaxSize: 1024 * 1024,
              }}
              value={resetDescription}
              onChange={(html) => {
                setDescription(html);
              }}
            />
          </div>
        </Form.Item>
        {/* 是否置顶 0表示默认，1表示置顶 */}
        <Form.Item label="是否置顶" name="priority">
          <Switch disabled={viewDisabled} onChange={isPriorityChange} checked={isChecked} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
