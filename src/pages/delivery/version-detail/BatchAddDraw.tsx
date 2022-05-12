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
import { Drawer, Input, Button, Form, Tree, Spin, Col, Select, Space, message, Divider } from 'antd';
import { useGetProductlineVersion, useGetAppList, useBulkadd } from './hooks';
import './index.less';
export interface AppComponentProps {
  mode: EditorMode;
  versionId: number;
  initData?: any;
  onClose?: () => any;
  onSave: () => any;
}

export default function TmplEditor(props: AppComponentProps) {
  const [addForm] = Form.useForm();
  const { mode, initData, onClose, onSave, versionId } = props;
  const [isDisabled, setIsdisabled] = useState<boolean>(false);
  const [selectLoading, productLineOptions, getProductlineList] = useQueryProductlineList();
  const [versionLoading, versionOptions, getProductlineVersion] = useGetProductlineVersion();
  const [appListLoading, appOptions, queryAppList] = useGetAppList();
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [saveLoading, saveBulkadd] = useBulkadd();
  const [curComponentName, setCurComponentName] = useState<any>([]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    getProductlineList();
    return () => {
      setIsdisabled(false);
      addForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = () => {
    const params = addForm.getFieldsValue();
    saveBulkadd({ ...params, componentName: curComponentName, versionId }).then(() => {
      onSave();
    });
  };
  const changeProductLine = (value: string) => {
    getProductlineVersion(value);
  };
  const changeVersion = () => {
    let params = addForm.getFieldsValue();
    queryAppList({ ...params });
  };

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    let nameArry: any = [];

    info.checkedNodes?.map((item: any) => {
      nameArry.push(item.title);
    });
    setSelectedKeys(checkedKeys);
    setCurComponentName(nameArry);
  };
  const allCheck = () => {
    let arry: any = [];
    let nameArry: any = [];
    appOptions.map((item: any) => {
      arry.push(item.key);
      nameArry.push(item.title);
    });
    setCurComponentName(nameArry);
    setSelectedKeys(arry);
  };
  const unAllCheck = () => {
    setSelectedKeys([]);
    setCurComponentName([]);
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title="批量添加应用"
      // maskClosable={false}
      onClose={onClose}
      width={'50%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" disabled={isDisabled} loading={saveLoading} onClick={handleSubmit}>
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
        <Form.Item label="产品线" name="productLine">
          <Select
            style={{ width: 300 }}
            options={productLineOptions || []}
            loading={selectLoading}
            onChange={changeProductLine}
            allowClear
            showSearch
          ></Select>
        </Form.Item>
        <Form.Item label="添加应用版本" name="componentVersion">
          <Select
            style={{ width: 300 }}
            options={versionOptions || []}
            loading={versionLoading}
            allowClear
            showSearch
            onChange={changeVersion}
          ></Select>
        </Form.Item>
      </Form>
      <Divider />
      <p>
        应用列表
        {appOptions.length > 0 && (
          <Space style={{ marginLeft: 12 }}>
            <Button size="small" type="primary" onClick={allCheck}>
              全选
            </Button>
            <Button size="small" onClick={unAllCheck}>
              全不选
            </Button>
          </Space>
        )}
      </p>

      <Spin spinning={appListLoading}>
        <Tree
          checkable
          rootClassName="app-list-tree"
          checkedKeys={selectedKeys}
          onCheck={onCheck}
          height={500}
          treeData={appOptions}
        />
      </Spin>
    </Drawer>
  );
}
