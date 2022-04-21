// 应用编辑/新增
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:23

import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Drawer, Button, Select, Radio, Input, Divider, message, Form, Modal, Table } from 'antd';
import FELayout from '@cffe/vc-layout';
import { FeContext } from '@/common/hooks';
import { colunms } from './schema';
import DebounceSelect from '@/components/debounce-select';
import UserSelector, { stringToList } from '@/components/user-selector';
import EditorTable from '@cffe/pc-editor-table';
// import { useAppGroupOptions } from '../../hooks';
import {
  appTypeOptions,
  appDevelopLanguageOptions,
  isClientOptions,
  appFeProjectTypeOptions,
  appMicroFeTypeOptions,
  deployJobUrlOptions,
} from './common';
// import { AppItemVO } from '../../interfaces';
// import { useFeMicroMainProjectOptions } from './hooks';

const { Item: FormItem } = Form;

// 生成一个方法: shouldUpdate={(prev, curr) => prev.xxx !== curr.xxx}
const shouldUpdate = (keys: string[]) => {
  return (prev: any, curr: any) => {
    return keys.some((key) => prev[key] !== curr[key]);
  };
};

export interface IProps {
  initData?: any;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ApplicationEditor(props: IProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { categoryData } = useContext(FeContext);
  const { visible } = props;
  const initData = props.initData ? JSON.parse(JSON.stringify(props.initData)) : {};
  const isEdit = !!initData?.id;
  const [loading, setLoading] = useState(false);

  const [categoryCode, setCategoryCode] = useState<string>();
  // const [feMicroMainProjectOptions] = useFeMicroMainProjectOptions(visible);
  const [envDataSource, setEnvDataSource] = useState<any[]>([]); //环境信息

  const [form] = Form.useForm<any>();
  const dataSource = [
    {
      appName: '测试应用',
      appCode: 'appCode',
      appCategoryCode: 'hbos',
      appType: 'backend',
    },
  ];

  const handleSubmit = () => {};
  const handleCategoryCodeChange = () => {};
  const appTypeOptions = useMemo(
    () => [
      { value: 'backend', label: '后端' },
      { value: 'frontend', label: '前端' },
    ],
    [],
  );
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
    },
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Modal
      width={660}
      title={isEdit ? '编辑版本' : '新增版本'}
      visible={props.visible}
      onCancel={props.onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            确定
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <FormItem label="版本名称" name="appName" rules={[{ required: true, message: '请输入应用名称' }]}>
          <Input placeholder="请输入" style={{ width: 380 }} />
        </FormItem>
        <FormItem label="版本CODE" name="deploymentName" rules={[{ required: true, message: '请输入应用部署名' }]}>
          <Input placeholder="请输入" style={{ width: 380 }} />
        </FormItem>
        <FormItem label="版本描述" name="desc">
          <Input.TextArea placeholder="请输入版本描述" style={{ width: 380 }} />
        </FormItem>
        <Divider />
        <Form.Item label="查询应用" noStyle>
          <div style={{ paddingBottom: 12 }}>
            <span style={{ paddingRight: 12, color: '#777' }}>查询应用:</span>
            <Select style={{ width: 140 }} options={appTypeOptions} placeholder="应用类型"></Select>
            <Select style={{ width: 282, marginLeft: 10 }} placeholder="应用分类"></Select>
          </div>
        </Form.Item>
        <FormItem>
          <div style={{ marginLeft: 8 }}>{hasSelected ? `共选择 ${selectedRowKeys.length} 个应用` : ''}</div>
          <Table
            size="small"
            bordered
            rowSelection={rowSelection}
            columns={colunms}
            dataSource={dataSource}
            style={{ height: 200 }}
            // scroll={{ x: '100%' }}
            pagination={false}
            scroll={{ y: window.innerHeight - 520, x: '100%' }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
