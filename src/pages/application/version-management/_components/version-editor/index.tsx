// 应用编辑/新增
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:23

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
import { colunms } from './schema';
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
  const [editLoading, editVersion] = useCreateVersion();
  const [categoryCode, setCategoryCode] = useState<string>();
  const [loading, categoryData] = useQueryCategory();
  const [appGroupOptions, appGroupLoading] = useAppGroupOptions(categoryCode);
  const [tableLoading, allAppListDataSource, setSource, queryAppsList] = useAppList();
  const [alreadyLoading, alreadyAppDataSource, queryVersionAppList] = useVersionAppList();
  const [addLoading, addVersion] = useUpdateVersion();
  const { initData, type, onSubmit } = props;
  const isEdit = !!initData?.id;
  const [form] = Form.useForm<any>();

  console.log('type', type);
  // 提交数据
  // const handleSubmit = useCallback(async () => {
  //   const values = await form.validateFields();
  //   if (type === 'edit') {
  //     let editParams = { ...values, apps: currentData };
  //     editVersion(editParams).then(() => {
  //       onSubmit();
  //     });
  //   }
  //   if (type === 'add') {
  //     let editParams = { ...values, apps: currentData };
  //     addVersion(editParams).then(() => {
  //       onSubmit();
  //     });
  //   }
  // }, [isEdit, form]);
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!isEdit) {
        let editParams = { ...values, apps: currentData };
        editVersion(editParams).then(() => {
          onSubmit();
        });
      } else {
        let editParams = { ...values, apps: currentData };
        addVersion(editParams).then(() => {
          onSubmit();
        });
      }
    });
  };

  // const rowSelection = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
  //     setSelectedRowKeys(selectedRowKeys);
  //     setCurrentData(selectedRows);
  //   },
  // };
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
    console.log('选择应用组', type, appGroupCode);

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
        {/* <FormItem label="查询应用" name='selectApps' rules={[{ required: true, message: '请选择应用分类' }]} noStyle>
          <div style={{ paddingBottom: 12 }}>
            <span style={{ paddingRight: 12, color: '#777' }}>查询应用:</span>
            <Select style={{ width: 140 }} options={appTypeOptions} placeholder="应用分类呢" disabled={isEdit} value={appCategoryCode}></Select>
            <Select style={{ width: 282, marginLeft: 10 }} placeholder="应用组" disabled={isEdit}></Select>
          </div>
        </FormItem> */}
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
              rowSelection={rowSelection}
              loading={alreadyLoading}
              columns={colunms}
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
              columns={colunms}
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
