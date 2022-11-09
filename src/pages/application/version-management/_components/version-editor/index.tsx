// 版本编辑
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/21 15:30

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Select, Input, Divider, Form, Modal, Table } from 'antd';
import {
  useCreateVersion,
  useUpdateVersion,
  useAppGroupOptions,
  useQueryCategory,
  useAppList,
  useVersionAppList,
} from '../../hooks';
import { columns } from './schema';
const { Item: FormItem } = Form;

export interface IProps {
  initData?: any;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: string;
}

export default function VersionEditor(props: IProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [editLoading, editVersion] = useUpdateVersion();
  const [categoryCode, setCategoryCode] = useState<string>();
  const [loading, categoryData] = useQueryCategory();
  const [appGroupOptions, appGroupLoading] = useAppGroupOptions(categoryCode);
  const [tableLoading, allAppListDataSource, setSource, queryAppsList] = useAppList();
  const [alreadyLoading, alreadyAppDataSource, setAlreadySource, queryVersionAppList] = useVersionAppList();
  const [addLoading, addVersion] = useCreateVersion();
  const { initData, type, onSubmit } = props;
  const isEdit = !!initData?.id;
  const [form] = Form.useForm<any>();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!isEdit) {
        let addParams = { ...values, apps: currentData };
        addVersion(addParams).then(() => {
          onSubmit();
        });
      } else {
        let editParams = { id: initData.id, disable: initData.disable, versionName: values.versionName, desc: values.desc };
        editVersion(editParams).then(() => {
          onSubmit();
        });
      }
    });
  };

  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        setCurrentData(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
      },
    };
  }, [selectedRowKeys]);

  const hasSelected = selectedRowKeys.length > 0;
  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        ...initData,
      });
    }

    return () => {
      form.resetFields();
      setSelectedRowKeys([]);
      setCurrentData([]);
      setSource([]);
      setAlreadySource([]);
    };
  }, [props.visible]);

  useEffect(() => {
    if (isEdit && props.visible) {
      queryVersionAppList({
        versionCode: initData?.versionCode,
        appCategoryCode: initData.appCategoryCode,
        isBoundVersion: true,
      });
    }
  }, [props.visible]);

  // 应用分类 - 应用组 联动
  const selectAppCategoryCode = useCallback((next: string) => {
    setCategoryCode(next);
    form.resetFields(['appGroupCode']);
    queryAppsList(next);
  }, []);
  const selectAppGroupCode = (appGroupCode: string) => {
    queryAppsList(categoryCode || '', appGroupCode);
  };

  return (
    <Modal
      width={860}
      title={type === 'view' ? '查看版本' : type === 'add' ? '新增版本' : '编辑版本'}
      visible={props.visible}
      onCancel={props.onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" onClick={handleSubmit} disabled={type === 'view'} loading={addLoading || editLoading}>
            确定
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '200px' }}>
        <FormItem label="版本名称" name="versionName" rules={[{ required: true, message: '请输入版本名称' }]}>
          <Input placeholder="请输入" style={{ width: 380 }} />
        </FormItem>
        <FormItem label="版本CODE" name="versionCode" rules={[{ required: true, message: '请输入版本CODE' }]}>
          <Input placeholder="请输入" style={{ width: 380 }} disabled={isEdit} />
        </FormItem>
        <FormItem label="版本描述" name="desc">
          <Input.TextArea placeholder="请输入版本描述" style={{ width: 380 }} />
        </FormItem>
        <Divider />
        <FormItem label="应用分类" name="appCategoryCode" rules={[{ required: true, message: '请选择应用分类' }]}>
          <Select
            style={{ width: 380 }}
            options={categoryData}
            placeholder="应用分类"
            disabled={isEdit}
            showSearch
            allowClear
            onChange={selectAppCategoryCode}
            loading={loading}
          ></Select>
        </FormItem>
        {!isEdit && (
          <FormItem label="应用组" name="appGroupCode">
            <Select
              style={{ width: 380 }}
              placeholder="通过应用组筛选应用"
              disabled={isEdit}
              options={appGroupOptions}
              showSearch
              allowClear
              onChange={selectAppGroupCode}
              loading={appGroupLoading}
            ></Select>
          </FormItem>
        )}

        <FormItem>
          <div style={{ marginLeft: 8 }}>{hasSelected ? `共选择 ${selectedRowKeys.length} 个应用` : ''}</div>
          {isEdit ? (
            <Table
              size="middle"
              bordered
              rowKey="id"
              // rowSelection={rowSelection}
              loading={alreadyLoading}
              columns={columns}
              dataSource={alreadyAppDataSource}
              style={{ height: 200 }}
              pagination={false}
              scroll={{ y: window.innerHeight - 600, x: '100%' }}
            />
          ) : (
            <Table
              size="middle"
              rowKey="id"
              bordered
              loading={tableLoading}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={allAppListDataSource}
              style={{ height: 200 }}
              pagination={false}
              scroll={{ y: window.innerHeight - 600, x: '100%' }}
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}
