// 数据模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Table, Button, Input, Select, message, DatePicker, Checkbox, Popconfirm } from 'antd';
import moment from 'moment';
import FELayout from '@cffe/vc-layout';
import { ContentCard } from '@/components/vc-page-content';
import usePublicData from '@/utils/usePublicData';
import { useTableData } from './hooks';
import { EditorMode } from '../interfaces';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import TemplateEditor from '../_components/template-editor';

const { Item: FormItem } = Form;

export default function DataTemplate() {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
    useCodeValue: true,
  });
  const [searchField] = Form.useForm();
  const [searchParams, setSearchParams] = useState<any>();
  const [tableData, loading] = useTableData(searchParams);
  const [editorMode, setEditorMode] = useState<EditorMode>('HIDE');
  const [editRecord, setEditRecord] = useState<any>();

  const handleSearch = useCallback(() => {
    const { createTime, ...others } = searchField.getFieldsValue();
    setSearchParams({
      ...others,
      startTime: createTime && createTime[0] ? `${createTime[0].format('YYYY-MM-DD')} 00:00:00` : undefined,
      endTime: createTime && createTime[1] ? `${createTime[1].format('YYYY-MM-DD')} 23:59:59` : undefined,
    });
  }, [searchField]);

  const handleReset = useCallback(() => {
    searchField.resetFields();
    const nextValues = searchField.getFieldsValue();
    setSearchParams(nextValues);
  }, [searchField]);

  useEffect(() => {
    const values = searchField.getFieldsValue();
    setSearchParams(values);
  }, []);

  // 删除模板
  const handleDelItem = useCallback(async (record) => {
    await postRequest(APIS.delDataFactory, {
      data: { factoryId: record.id },
    });
    message.success('模板已删除！');
    handleSearch();
  }, []);

  const handleEditItem = (record: any) => {
    setEditRecord(record);
    setEditorMode('EDIT');
  };

  const handleEditorSave = () => {
    setEditorMode('HIDE');
    handleSearch();
  };

  return (
    <ContentCard>
      <Form form={searchField} layout="inline">
        <FormItem label="项目" name="project">
          <Select options={appTypeData} placeholder="请选择" style={{ width: 120 }} onChange={handleSearch} />
        </FormItem>
        <FormItem label="环境" name="env">
          <Select
            options={envListType}
            placeholder="请选择"
            style={{ width: 120 }}
            onChange={handleSearch}
            allowClear
          />
        </FormItem>
        <FormItem label="模板名称" name="name">
          <Input placeholder="请输入" style={{ width: 120 }} />
        </FormItem>
        <FormItem label="创建时间" name="createTime">
          <DatePicker.RangePicker style={{ width: 240 }} />
        </FormItem>
        <FormItem label="" name="createUser">
          <Checkbox.Group options={[{ label: '我的模板', value: userInfo.userName! }]} onChange={handleSearch} />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={handleSearch} style={{ marginRight: 12 }}>
            查询
          </Button>
          <Button type="default" onClick={handleReset}>
            重置
          </Button>
        </FormItem>
      </Form>
      <div className="table-caption">
        <h3></h3>
        <Button type="primary" onClick={() => setEditorMode('ADD')}>
          新增数据模板
        </Button>
      </div>
      <Table pagination={false} dataSource={tableData} loading={loading}>
        <Table.Column dataIndex="id" title="序号" width={80} />
        <Table.Column dataIndex="name" title="模板名称" />
        <Table.Column dataIndex="project" title="项目" />
        <Table.Column dataIndex="env" title="环境" />
        <Table.Column
          dataIndex="variable"
          title="可传变量"
          render={(_, record: any) => Object.keys(record.params || {}).join(', ')}
        />
        <Table.Column dataIndex="createUser" title="创建人" />
        <Table.Column
          dataIndex="gmtCreate"
          title="创建时间"
          width={170}
          render={(value: string) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '')}
        />
        <Table.Column
          title="操作"
          render={(_, record: any) => (
            <div className="action-cell">
              <a onClick={() => handleEditItem(record)}>编辑</a>
              <Popconfirm title="确定要删除此模板吗？" onConfirm={() => handleDelItem(record)}>
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </div>
          )}
          width={100}
        />
      </Table>
      <TemplateEditor
        mode={editorMode}
        initData={editRecord}
        onClose={() => setEditorMode('HIDE')}
        onSave={handleEditorSave}
      />
    </ContentCard>
  );
}
