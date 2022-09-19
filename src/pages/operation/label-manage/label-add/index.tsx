// 标签管理新增页/编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/12/03 17:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { useState, useEffect } from 'react';
import { LabelEdit } from '../label-list';
import { useAppCategoryOption } from '../hook';
import { Drawer, Input, Button, Form, Select, Space, message } from 'antd';
import { useCreateLabelTag, useEditLabel } from '../hook';

export interface LabelListProps {
  mode?: EditorMode;
  // type: boolean;
  initData?: LabelEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function LabelEditor(props: LabelListProps) {
  const [count, setCount] = useState<any>([0]);
  const [createLabelForm] = Form.useForm();
  const { mode, initData, onClose, onSave } = props;
  const [categoryData] = useAppCategoryOption(); //获取应用分类下拉选择
  const [createTag] = useCreateLabelTag(); //新增标签
  const [editLabel] = useEditLabel(); //编辑标签

  const id = initData?.id;
  const tagCode = initData?.tagCode;
  if (mode === 'EDIT') {
    let categoryCodesData = initData?.categoryCodes.split(',');

    createLabelForm.setFieldsValue({ ...initData, categoryCodes: categoryCodesData });
  }
  if (mode === 'ADD') {
    createLabelForm.resetFields();
    // createLabelForm.setFieldsValue({
    //   tagName:'',
    //   tagMark:'',
    //   categoryCodes:undefined

    // })
  }
  useEffect(() => {
    if (mode === 'HIDE') {
      return;
    }
  }, []);
  //提交数据

  const createLabelFrom = (params: any) => {
    let categoryCodesParams: string = '';
    let categoryCodesData = '';
    if (mode === 'ADD') {
      params?.categoryCodes?.map((item: any) => {
        categoryCodesParams += item + ',';
        categoryCodesData = categoryCodesParams.substring(0, categoryCodesParams.length - 1);
      });

      createTag(params?.tagName, params?.tagMark, categoryCodesData)
        .then(() => {
          onSave?.();
        })
        .catch((error) => {});
    }
    if (mode === 'EDIT') {
      params?.categoryCodes?.map((item: any) => {
        categoryCodesParams += item + ',';
        categoryCodesData = categoryCodesParams.substring(0, categoryCodesParams.length - 1);
      });
      editLabel(id, params?.tagName, params?.tagMark, categoryCodesData, tagCode)
        .then(() => {
          onSave?.();
        })
        .catch((error) => {
          message.error(error);
        });
    }
  };

  return (
    <Drawer width={'36%'} visible={mode !== 'HIDE'} title={mode === 'EDIT' ? '编辑标签' : '新增标签'} onClose={onClose}>
      <ContentCard className="label-edit">
        <Form form={createLabelForm} onFinish={createLabelFrom} labelCol={{ flex: '120px' }}>
          <Form.Item label="标签名称" name="tagName" rules={[{ required: true, message: '这是必选项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="标签备注" name="tagMark">
            <Input style={{ width: 220 }} placeholder="用于标记"></Input>
          </Form.Item>
          <Form.Item label="默认应用分类" name="categoryCodes">
            <Select showSearch style={{ width: 220 }} options={categoryData} mode="multiple" allowClear />
          </Form.Item>
          <span style={{ marginLeft: 120, color: 'gray' }}>(该分类下新建应用时会自动绑定该标签)</span>
          <Form.Item>
            <Space size="small" style={{ marginTop: '50px', marginLeft: '220px' }}>
              <Button type="ghost" htmlType="reset" danger onClick={onClose}>
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
