// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/04/20 10:30

import { ContentCard } from '@/components/vc-page-content';
import { useState, useEffect } from 'react';
import { TmplEdit } from '../index';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Select } from 'antd';
import { useCreateComponentTmpl, useUpdateComponentTmpl } from './hooks';
import { useGetTypeListOption } from '../hooks';
export interface TmplListProps {
  mode?: EditorMode;
  initData: TmplEdit;
  productLineOptions: any;
  onClose?: () => any;
  onSave: () => any;
}

export default function TmplEditor(props: TmplListProps) {
  const [createTmplForm] = Form.useForm();
  const [createLoading, createComponentTmpl] = useCreateComponentTmpl();
  const [updateLoading, updateComponentTmpl] = useUpdateComponentTmpl();
  const [optionLoading, typeOption] = useGetTypeListOption();
  const { mode, initData, productLineOptions, onClose, onSave } = props;
  const [isDisabled, setIsdisabled] = useState<boolean>(false);
  const [editDisabled, setEditDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'EDIT' || mode === 'VIEW') {
      createTmplForm.setFieldsValue({ ...initData });
    }
    if (mode === 'VIEW') {
      setIsdisabled(true);
    }
    if (mode === 'EDIT') {
      setEditDisabled(true);
    }
    if (mode === 'ADD') {
      createTmplForm.resetFields();
    }
    return () => {
      setIsdisabled(false);
      setEditDisabled(false);
    };
  }, [mode]);
  const handleSubmit = () => {
    const param = createTmplForm.getFieldsValue();
    if (mode === 'ADD') {
      createComponentTmpl({ ...param }).then(() => {
        onSave();
      });
    } else {
      updateComponentTmpl({ ...param, id: initData.id }).then(() => {
        onSave();
      });
    }
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑组件模版' : mode === 'ADD' ? '新增组件模版' : mode === 'VIEW' ? '查看组件模版' : ''}
      onClose={onClose}
      width={'60%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" disabled={isDisabled} loading={createLoading || updateLoading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <ContentCard className="tmpl-edits">
        <Form layout="inline" form={createTmplForm}>
          <p style={{ display: 'flex', marginLeft: 16 }}>
            <Form.Item label="产品线" name="productLine" rules={[{ required: true, message: '请选择产品线' }]}>
              <Select style={{ width: 180 }} options={productLineOptions} disabled={editDisabled} />
            </Form.Item>
            <Form.Item label="模板类型" name="tempType" rules={[{ required: true, message: '请选择模版类型' }]}>
              <Select style={{ width: 180 }} options={typeOption} disabled={editDisabled} loading={optionLoading} />
            </Form.Item>
            <Form.Item label="模板名称" name="tempName" rules={[{ required: true, message: '请输入模板名称' }]}>
              <Input style={{ width: 156 }} />
            </Form.Item>
          </p>

          <Form.Item
            label="模板配置"
            name="tempConfiguration"
            rules={[{ required: true, message: '请输入模版配置' }]}
            style={{ width: 800 }}
          >
            <AceEditor mode="yaml" height={650} readOnly={isDisabled} />
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
