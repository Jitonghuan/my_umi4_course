// 数据模板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Table, Button, Input, Select, message, DatePicker, Checkbox, Popconfirm, Modal } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import moment from 'moment';
import FELayout from '@cffe/vc-layout';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import usePublicData from '@/utils/usePublicData';
import { useTableData } from './hooks';
import { EditorMode } from '../interfaces';
import * as APIS from '../service';
import { getRequest, postRequest } from '@/utils/request';

const { Item: FormItem } = Form;

export default function DataTemplate(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
  });
  const [searchField] = Form.useForm();
  const [searchParams, setSearchParams] = useState<any>();
  const [tableData, loading] = useTableData(searchParams);
  const [editorMode, setEditorMode] = useState<EditorMode>('HIDE');
  const [editRecord, setEditRecord] = useState<any>();
  const [delRecord, setDelRecord] = useState<any>();
  const [delEnv, setDelEnv] = useState<string>();

  const handleSearch = useCallback(() => {
    const values = searchField.getFieldsValue();
    setSearchParams({
      ...values,
      createTime: values.createTime ? values.createTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
    });
  }, [searchField]);

  const handleReset = useCallback(() => {
    searchField.resetFields();
    setSearchParams({});
  }, [searchField]);

  // 删除模板
  const handleDelItem = useCallback(async () => {
    if (!delEnv) return;

    await postRequest(APIS.delDataFactory, {
      data: { factoryId: delRecord.id, env: delEnv },
    });
    message.success('模板已删除！');

    setDelRecord(undefined);
    setDelEnv(undefined);
  }, [delRecord, delEnv]);

  const handleEditItem = (record: any) => {
    setEditRecord(record);
    setEditorMode('EDIT');
  };

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="template" history={props.history} />
      <ContentCard>
        <Form form={searchField} layout="inline">
          <FormItem label="项目" name="project">
            <Select
              options={appTypeData}
              placeholder="请选择"
              style={{ width: 140 }}
              onChange={handleSearch}
              allowClear
            />
          </FormItem>
          <FormItem label="环境" name="env">
            <Select
              options={envListType}
              placeholder="请选择"
              style={{ width: 140 }}
              onChange={handleSearch}
              allowClear
            />
          </FormItem>
          <FormItem label="模板名称" name="name">
            <Input placeholder="请输入" style={{ width: 140 }} />
          </FormItem>
          <FormItem label="创建时间" name="createTime">
            <DatePicker placeholder="请选择" style={{ width: 140 }} />
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
          <Table.Column dataIndex="id" title="序号" />
          <Table.Column dataIndex="name" title="模板名称" />
          <Table.Column dataIndex="project" title="项目" />
          <Table.Column dataIndex="env" title="环境" />
          <Table.Column dataIndex="variable" title="可传变量" />
          <Table.Column dataIndex="createUser" title="创建人" />
          <Table.Column
            dataIndex="gmtCreate"
            title="创建时间"
            render={(value: string) => (value ? moment(value).format('YYYY-MM-DD HH:mm') : '')}
          />
          <Table.Column
            title="操作"
            render={(_, record: any) => (
              <div className="action-cell">
                <a onClick={() => handleEditItem(record)}>编辑</a>
                <a
                  style={{ color: 'red' }}
                  onClick={() => {
                    setDelRecord(record), setDelEnv(undefined);
                  }}
                >
                  删除
                </a>
              </div>
            )}
            width={100}
          />
        </Table>
      </ContentCard>
      <Modal
        title="删除模板"
        visible={!!delRecord}
        maskClosable={false}
        onOk={handleDelItem}
        onCancel={() => setDelRecord(undefined)}
      >
        <Form labelCol={{ flex: '140px' }}>
          <FormItem label="请选择要删除的环境：">
            <Select
              placeholder="请选择"
              options={delRecord?.env?.split(',').map((n: string) => ({ label: n, value: n })) || []}
            />
          </FormItem>
        </Form>
      </Modal>
    </MatrixPageContent>
  );
}
