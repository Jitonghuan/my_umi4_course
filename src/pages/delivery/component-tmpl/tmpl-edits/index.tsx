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

export interface TmplListProps {
  mode?: EditorMode;
  initData?: TmplEdit;
  onClose?: () => any;
  onSave: () => any;
}

export default function TmplEditor(props: TmplListProps) {
  const [createTmplForm] = Form.useForm();
  const [createLoading, createComponentTmpl] = useCreateComponentTmpl();
  const [updateLoading, updateComponentTmpl] = useUpdateComponentTmpl();
  const { mode, initData, onClose, onSave } = props;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const [isDeployment, setIsDeployment] = useState<string>();

  // const templateCode = initData?.templateCode;
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const clickChange = () => {};

  useEffect(() => {
    if (mode === 'HIDE') return;
    // createTmplForm.resetFields();
  }, []);
  const handleSubmit = () => {
    const param = createTmplForm.getFieldsValue();
    if (mode === 'ADD') {
      createComponentTmpl({ ...param }).then(() => {
        onSave();
      });
    } else {
      updateComponentTmpl({ ...param }).then(() => {
        onSave();
      });
    }
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑组件模版' : mode === 'ADD' ? '新增组件模版' : ''}
      // maskClosable={false}
      // onClose={onClose}

      width={'70%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={createLoading || updateLoading} onClick={handleSubmit}>
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
          <Form.Item label="产品线" name="productLine">
            <Select />
          </Form.Item>
          <Form.Item label="模板类型" name="tempType">
            <Select />
          </Form.Item>
          <Form.Item label="模板名称" name="tempName">
            <Input />
          </Form.Item>
          <p>
            <Form.Item label="模板配置" name="tempConfiguration">
              <AceEditor height={450} />
            </Form.Item>
          </p>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
