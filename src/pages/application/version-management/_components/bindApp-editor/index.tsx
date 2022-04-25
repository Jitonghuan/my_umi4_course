// 应用编辑/新增
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:23

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Select, Descriptions, Divider, Form, Modal, Table, Popconfirm } from 'antd';
import { colunms } from '../version-editor/schema';
import { useVersionAppList, useBoundApp, useQueryCategory } from '../../hooks';
import './index.less';
const { Item: FormItem } = Form;

export interface IProps {
  initData?: any;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  type: string;
}

export default function BindAppEditor(props: IProps) {
  const [form] = Form.useForm<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [unAddLoading, unAddAppDataSource, queryVersionAppList] = useVersionAppList();
  const [categoryCode, setCategoryCode] = useState<string>();
  const [bundLoading, handleBoundApp] = useBoundApp();
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [categoryLoading, categoryData] = useQueryCategory();
  const { initData, visible, onClose } = props;
  const isEdit = !!initData?.id;
  useEffect(() => {
    if (initData?.versionCode) {
    } else {
      return;
    }
  }, [visible]);
  const selectAppCategoryCode = useCallback((next: string) => {
    setCategoryCode(next);
    queryVersionAppList({ versionCode: initData?.versionCode, appCategoryCode: next, isBoundVersion: false });
  }, []);

  const handleSubmit = () => {
    handleBoundApp({ versionCode: initData?.versionCode, apps: currentData }).then(() => {
      onClose();
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
    },
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Modal
      width={860}
      title="绑定应用"
      visible={props.visible}
      onCancel={props.onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Popconfirm title="确定绑定这些应用吗？" onConfirm={handleSubmit} okText="确定" cancelText="取消">
            <Button type="primary" loading={bundLoading}>
              绑定
            </Button>
          </Popconfirm>

          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Descriptions title="当前版本信息" column={2} bordered className="version-info-description">
        <Descriptions.Item label="版本名称:">{initData?.versionName}</Descriptions.Item>
        <Descriptions.Item label="版本Code:">{initData?.versionCode}</Descriptions.Item>
        <Descriptions.Item label="应用分类:">{initData?.appCategoryCode}</Descriptions.Item>
        <Descriptions.Item label="备注:">{initData?.desc}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <div className="bindApp-title">
        <h3 style={{ borderLeft: '4px solid #1973cc', paddingLeft: '8px', height: 20 }}>绑定应用</h3>
      </div>
      <Form form={form} labelCol={{ flex: '90px' }}>
        <FormItem label="应用分类" name="appCategoryCode">
          <Select
            style={{ width: 380 }}
            options={categoryData}
            placeholder="应用分类"
            showSearch
            allowClear
            onChange={selectAppCategoryCode}
            loading={categoryLoading}
          ></Select>
        </FormItem>
        {/* <FormItem label="应用组">
           <Select style={{ width: 380}} placeholder="通过应用组筛选应用" options={appGroupOptions} loading={appGroupLoading} ></Select>
        </FormItem> */}
        <FormItem>
          <div style={{ marginLeft: 8 }}>{hasSelected ? `共选择 ${selectedRowKeys.length} 个应用` : ''}</div>
          <Table
            size="middle"
            bordered
            rowSelection={rowSelection}
            columns={colunms}
            dataSource={unAddAppDataSource}
            loading={unAddLoading}
            style={{ height: 200 }}
            // scroll={{ x: '100%' }}
            pagination={false}
            scroll={{ y: window.innerHeight - 720, x: '100%' }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
