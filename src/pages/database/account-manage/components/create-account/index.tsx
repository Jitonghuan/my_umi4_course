/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 16:05:29
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 17:22:44
 * @FilePath: /fe-matrix/src/pages/database/database-manage/create-database/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Switch, Tag } from 'antd';
import './index.less';

export interface MemberEditorProps {
  mode: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, initData, onClose, onSave } = props;
  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isPriorityChangeOption, setIsPriorityChangeOption] = useState<number>(0);
  const [description, setDescription] = useState<any>(); // 富文本数据
  const [resetDescription, setResetDescription] = useState<any>(); // 重置富文本使用
  const [curType, setCurType] = useState<string>('');

  useEffect(() => {
    if (mode === 'HIDE' || !initData) return;
    setCurType(initData?.type);
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
    // if (mode === 'ADD') return;

    return () => {
      seViewDisabled(false);
      setIsChecked(false);
      setIsPriorityChangeOption(0);
      editForm.resetFields();
      setResetDescription('');
      setCurType('');
    };
  }, [mode]);
  const handleSubmit = () => {
    const params = editForm.getFieldsValue();

    if (mode === 'EDIT') {
    }
    if (mode === 'ADD') {
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
  const changeType = (values: any) => {
    setCurType(values);
  };

  return (
    <Drawer
      width={900}
      title="新增账号"
      placement="right"
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={false} onClick={handleSubmit} disabled={viewDisabled}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editForm} labelCol={{ flex: '120px' }}>
        <Form.Item label="数据库账号" name="title" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={viewDisabled} style={{ width: 520 }} />
        </Form.Item>
        <Form.Item label="授权地址" name="type" rules={[{ required: true, message: '请选择' }]}>
          <Input disabled={viewDisabled} style={{ width: 520 }} />
        </Form.Item>
        <Form.Item label="密码" name="type" rules={[{ required: true, message: '请选择' }]}>
          <Input.Password
            style={{ width: 380 }}
            placeholder="密码需要8-32个字符，至少包含英文、数字和特殊符号"
          ></Input.Password>
        </Form.Item>
        <Form.Item label="密码确认" name="type" rules={[{ required: true, message: '请选择' }]}>
          <Input.Password
            style={{ width: 380 }}
            placeholder="密码需要8-32个字符，至少包含英文、数字和特殊符号"
          ></Input.Password>
        </Form.Item>
        <Form.Item label="备注说明">
          <Input.TextArea style={{ width: 520 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
