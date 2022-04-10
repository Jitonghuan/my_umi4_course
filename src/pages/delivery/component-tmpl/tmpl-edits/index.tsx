// 应用模版编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { TmplEdit } from '../index';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space, message, Divider } from 'antd';
import { useCreateComponentTmpl, useUpdateComponentTmpl } from './hooks';
import { useGetTypeListOption } from '../hooks';
import { productLineOptions } from '../config';
export interface TmplListProps {
  mode?: EditorMode;
  initData: TmplEdit;
  onClose?: () => any;
  onSave: () => any;
}

export default function TmplEditor(props: TmplListProps) {
  const [createTmplForm] = Form.useForm();
  const [createLoading, createComponentTmpl] = useCreateComponentTmpl();
  const [updateLoading, updateComponentTmpl] = useUpdateComponentTmpl();
  const [optionLoading, typeOption] = useGetTypeListOption();
  const { mode, initData, onClose, onSave } = props;
  const [isDisabled, setIsdisabled] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'EDIT' || mode === 'VIEW') {
      createTmplForm.setFieldsValue({ ...initData });
    }
    if (mode === 'VIEW') {
      setIsdisabled(true);
    }
    if (mode === 'ADD') {
      createTmplForm.resetFields();
    }
    return () => {
      setIsdisabled(false);
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
      // maskClosable={false}
      onClose={onClose}
      width={'70%'}
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
          <p style={{ width: '100%', display: 'flex', marginLeft: 16 }}>
            <Form.Item label="产品线" name="productLine" rules={[{ required: true, message: '请选择产品线' }]}>
              <Select style={{ width: 180 }} options={productLineOptions} />
            </Form.Item>
            <Form.Item label="模板类型" name="tempType" rules={[{ required: true, message: '请选择模版类型' }]}>
              <Select style={{ width: 180 }} options={typeOption} />
            </Form.Item>
            <Form.Item label="模板名称" name="tempName" rules={[{ required: true, message: '请输入模板名称' }]}>
              <Input style={{ width: 180 }} />
            </Form.Item>
          </p>

          <p style={{ width: '100%' }}>
            <Form.Item
              label="模板配置"
              name="tempConfiguration"
              rules={[{ required: true, message: '请输入模版配置' }]}
            >
              <AceEditor height={450} mode="yaml" />
            </Form.Item>
          </p>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
