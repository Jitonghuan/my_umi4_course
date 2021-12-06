// 标签管理新增页/编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/12/03 17:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { LabelEdit } from '../label-list';
import { Drawer, Input, Button, Form, Row, Col, Select, Space, message } from 'antd';
import { useCreateLabelTag, useEditLabel } from '../hook';

export interface LabelListProps {
  mode?: EditorMode;
  initData?: LabelEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function LabelEditor(props: LabelListProps) {
  const [count, setCount] = useState<any>([0]);
  const [createLabelForm] = Form.useForm();
  const { mode, initData, onClose, onSave } = props;
  const [createTag] = useCreateLabelTag(); //新增标签
  const [editLabel] = useEditLabel(); //编辑标签
  const id = initData?.id;
  useEffect(() => {
    //进入页面赋值给表单
    if (mode === 'HIDE') {
      return;
    }
    if (mode === 'EDIT') {
      createLabelForm.setFieldsValue({ ...initData });
    }
    if (mode === 'ADD') {
      createLabelForm.resetFields();
    }
  }, []);
  //提交数据
  const createLabelFrom = (params: any) => {
    if (mode === 'ADD') {
      createTag(params?.tagName, params?.tagMark, params?.categoryCodes)
        .then(() => {
          onSave?.();
        })
        .catch((error) => {
          message.error(error);
        });
    }
    if (mode === 'EDIT') {
      editLabel(id, params?.tagName, params?.tagMark, params?.categoryCodes)
        .then(() => {
          onSave?.();
        })
        .catch((error) => {
          message.error(error);
        });
    }
  };

  return (
    <Drawer width={'30%'} visible={mode !== 'HIDE'} title={mode === 'EDIT' ? '编辑标签' : '新增标签'} onClose={onClose}>
      <ContentCard className="label-edit">
        <Form form={createLabelForm} onFinish={createLabelFrom} labelCol={{ flex: '120px' }}>
          <Form.Item label="标签名称" name="tagName" rules={[{ required: true, message: '这是必选项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="标签备注" name="tagMark" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="用于标记"></Input>
          </Form.Item>
          <Form.Item label="默认环境" name="categoryCodes" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="单行输入"></Input>
          </Form.Item>
          <span style={{ marginLeft: 120, color: 'gray' }}>(该分类下新建应用时会自动绑定该标签)</span>
          <Form.Item>
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Button type="ghost" htmlType="reset" onClick={onClose}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
