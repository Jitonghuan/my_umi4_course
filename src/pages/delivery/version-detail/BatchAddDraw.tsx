// 应用模版编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { useQueryProductlineList } from '../component-center/hook';
import { Drawer, Input, Button, Form, Tree, Row, Col, Select, Space, message, Divider } from 'antd';
export interface AppComponentProps {
  mode: EditorMode;
  initData?: any;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TmplEditor(props: AppComponentProps) {
  const [addForm] = Form.useForm();
  const { mode, initData, onClose, onSave } = props;
  const [isDisabled, setIsdisabled] = useState<boolean>(false);
  const [editDisabled, setEditDisabled] = useState<boolean>(false);
  const [selectLoading, productLineOptions, getProductlineList] = useQueryProductlineList();

  useEffect(() => {
    if (mode === 'HIDE') return;
    getProductlineList();
    return () => {
      setIsdisabled(false);
      setEditDisabled(false);
    };
  }, [mode]);
  const handleSubmit = () => {
    const param = addForm.getFieldsValue();
  };
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
    },
    {
      title: 'parent 2',
      key: '0-1',
    },
    {
      title: 'parent 3',
      key: '0-2',
    },
    {
      title: 'parent 4',
      key: '0-3',
    },
  ];

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title="批量添加应用"
      // maskClosable={false}
      onClose={onClose}
      width={'50%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" disabled={isDisabled} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      {/* <ContentCard className="tmpl-edits"> */}
      <Form layout="horizontal" form={addForm} labelCol={{ flex: '100px' }}>
        <Form.Item label="产品线" name="productionLine">
          <Select style={{ width: 300 }} options={productLineOptions} loading={selectLoading}></Select>
        </Form.Item>
        <Form.Item label="添加应用版本" name="addVersion">
          <Select style={{ width: 300 }}></Select>
        </Form.Item>
      </Form>
      <Divider />
      <p>应用列表</p>
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        //   onSelect={onSelect}
        //   onCheck={onCheck}
        treeData={treeData}
      />
      {/* </ContentCard> */}
    </Drawer>
  );
}
