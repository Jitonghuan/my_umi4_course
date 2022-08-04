import React, { useState, useEffect, useMemo } from 'react';
import { Button, Space, Popconfirm, Form, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import TableSearch from '@/components/table-search';
import PageContainer from '@/components/page-container';
import useTable from '@/utils/useTable';
import useRequest from '@/utils/useRequest';
import { Item } from '../../../typing';
import {
  queryRuleTemplatesList,
  createRuleTemplates,
  updateRuleTemplates,
  deleteRuleTemplates,
  ruleTemplatesSwitch,
  queryGroupList,
} from '../../../service';
import './index.less';
import { createGraphTemplate, createGraphTemplateUrl, deleteGraphTemplateUrl, delGraphTemplate, queryGraphTemplateUrl, updateGraphTemplate, updateGraphTemplateUrl } from '../../service';
import { Drawer, Input, message, Select } from '@cffe/h2o-design';
import AceEditor from '@/components/ace-editor';

type statusTypeItem = {
  color: string;
  tagText: string;
  buttonText: string;
  status: number;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { tagText: '已启用', buttonText: '禁用', color: 'green', status: 1 },
  1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
};

const TemplateCom: React.FC = () => {
  const [drawerTitle, setDrawerTitle] = useState('新增大盘模版');
  const [editRecord, setEditRecord] = useState<Item>({});
  const [type, setType] = useState<'add' | 'edit'>('add');

  const [form] = Form.useForm();

  const [editForm] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)

  const {
    tableProps = {},
    search: { submit: queryList, reset },
  } = useTable({
    url: queryGraphTemplateUrl,
    method: 'GET',
    form,
  });

  //新增
  const { run: createRuleTemplatesFun } = useRequest({
    api: createGraphTemplateUrl,
    method: 'POST',
    successText: '添加成功',
    isSuccessModal: true,
    onSuccess: () => {
      setVisible(false);
      queryList();
    },
  });

  //编辑
  const { run: updateRuleTemplatesFun } = useRequest({
    api: updateGraphTemplateUrl,
    method: 'PUT',
    successText: '编辑成功',
    isSuccessModal: true,
    onSuccess: () => {
      setVisible(false);
      queryList();
    },
  });


  //删除
  const { run: deleteRuleTemplatesFun } = useRequest({
    method: 'DELETE',
    successText: '删除成功',
    isSuccessModal: true,
    onSuccess: () => {
      queryList();
    },
  });

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      // width: '10%',
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 200,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '数据源类型',
      dataIndex: 'dsType',
      key: 'dsType',
      // width: '3%',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      // width: '5%',
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 240,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 140,
      // width: '6%',
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              setVisible(true);
              setDrawerTitle('编辑大盘模版');
              const { name, describe, configuration, dsType, id } = record
              const value = {
                graphTemplateName: name,
                graphTemplateJson: JSON.stringify(JSON.parse(configuration || "{}"), null, 2),
                graphTemplateDescribe: describe,
                dsType: dsType,
                id: id
              }
              setEditRecord(value);
              editForm.setFieldsValue(value)
              setType('edit');
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteRuleTemplatesFun({ id: record.id }, `${deleteGraphTemplateUrl}/:id?id=${record.id}`);
            }}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onClose = () => {
    setVisible(false);
    editForm.resetFields()
    setEditRecord({})
  };

  const onSubmit = (value: Record<string, string>) => {
    const params = value;
    let graphTemplateJson;
    try {
      graphTemplateJson = params.graphTemplateJson && JSON.parse(params?.graphTemplateJson)
    } catch (e) {
      message.error('JSON格式不正确')
      return
    }

    try {
      delete params.graphTemplateJson
    } catch (e) { }

    if (type === 'add') {
      createGraphTemplate(params, graphTemplateJson).then((res) => {
        if (res?.success) {
          message.success('创建成功')
          onClose()
          queryList();
        }
      });
    } else {
      updateGraphTemplate({ id: editRecord.id, ...params }, graphTemplateJson).then((res) => {
        if (res?.success) {
          message.success('更新成功')
          onClose();
          queryList();
        }
      });
    }
  };
  const handleSubmit = () => {
    const value = editForm.getFieldsValue()
    onSubmit(value)
  }


  return (
    <PageContainer>
      <TableSearch
        form={form}
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '名称',
            dataIndex: 'keyword',
            width: '144px',
            placeholder: '请输入',
          },
          {
            key: '2',
            type: 'select',
            label: '数据源类型',
            dataIndex: 'dsType',
            width: '144px',
            placeholder: '请选择数据源类型',
            option: [
              {
                key: 'prometheus',
                label: 'prometheus',
                value: 'prometheus'
              },
              {
                key: 'elasticsearch',
                label: 'elasticsearch',
                value: 'elasticsearch'
              }
            ],
          },
        ]}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps?.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        showTableTitle
        tableTitle="大盘模版列表"
        extraNode={
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
              setType('add');
              setDrawerTitle('新增大盘模版');
            }}
            icon={<PlusOutlined />}
          >
            新增大盘模版
          </Button>
        }
        className="table-form"
        onSearch={queryList}
        reset={reset}
        scroll={{ x: '100%' }}
      />


      <Drawer
        visible={visible}
        title={drawerTitle}
        // destroyOnClose
        onClose={onClose}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={saveLoading} onClick={handleSubmit}>
              保存
            </Button>
            <Button type="default" onClick={onClose}>
              取消
            </Button>
          </div>
        }
      >
        <Form
          form={editForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="模版名称" name="graphTemplateName" required>
            <Input />
          </Form.Item>
          <Form.Item label="数据源类型" name="dsType">
            <Select
              options={[
                { label: 'elasticsearch', value: 'elasticsearch' },
                { label: 'prometheus', value: 'prometheus' },
              ]}
            />
          </Form.Item>
          <Form.Item label="描述" name="graphTemplateDescribe">
            <Input />
          </Form.Item>
          <Form.Item label="JSON" name="graphTemplateJson" initialValue="">
            <AceEditor mode="json" height={300} />
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  );
};

export default TemplateCom;
