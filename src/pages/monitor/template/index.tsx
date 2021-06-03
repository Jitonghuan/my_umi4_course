import React, { useState, useEffect, useMemo } from 'react';
import { Button, Space, Tag, Popconfirm, Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import useTable from '@/utils/useTable';
import useRequest from '@/utils/useRequest';
import TemplateDrawer from '../component/template-drawer';
import { Item } from '../typing';
import {
  queryRuleTemplatesList,
  createRuleTemplates,
  updateRuleTemplates,
  deleteRuleTemplates,
  ruleTemplatesSwitch,
} from '../service';
import './index.less';

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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新增报警规则模版');
  const [editRecord, setEditRecord] = useState<Item>({});
  const [type, setType] = useState<'add' | 'edit'>('add');

  const [form] = Form.useForm();

  const {
    tableProps,
    search: { submit: queryList, reset },
  } = useTable({
    url: queryRuleTemplatesList,
    method: 'GET',
    form,
  });

  //新增
  const { run: createRuleTemplatesFun } = useRequest({
    api: createRuleTemplates,
    method: 'POST',
    successText: '添加成功',
    isSuccessModal: true,
    onSuccess: () => {
      setDrawerVisible(false);
      queryList();
    },
  });

  //编辑
  const { run: updateRuleTemplatesFun } = useRequest({
    api: updateRuleTemplates,
    method: 'PUT',
    successText: '编辑成功',
    isSuccessModal: true,
    onSuccess: () => {
      setDrawerVisible(false);
      queryList();
    },
  });

  //启用/禁用
  const { run: ruleTemplatesSwitchFun } = useRequest({
    api: ruleTemplatesSwitch,
    method: 'POST',
    successText: '操作成功',
    isSuccessModal: true,
    onSuccess: () => {
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
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      // width: '10%',
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 100,
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
      title: '分类',
      dataIndex: 'group',
      key: 'group',
      // width: '3%',
    },
    {
      title: '告警表达式',
      dataIndex: 'expression',
      key: 'expression',
      // width: '5%',
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 100,
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
      title: '告警消息',
      dataIndex: 'message',
      key: 'message',
      // width: '5%',
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 100,
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
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      // width: '6%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // width: '4%',
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].tagText}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 120,
      // width: '6%',
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              setDrawerVisible(true);
              setDrawerTitle('编辑报警规则模版');
              setEditRecord(record);
              setType('edit');
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteRuleTemplatesFun(
                { id: record.id },
                `${deleteRuleTemplates}/${record.id}`,
              );
            }}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
          <Popconfirm
            title={`确认${STATUS_TYPE[record.status as number].buttonText}`}
            onConfirm={() => {
              ruleTemplatesSwitchFun({
                id: record.id,
                status: STATUS_TYPE[record.status as number].status,
              });
            }}
            okText="是"
            cancelText="否"
          >
            <a>{STATUS_TYPE[record.status as number].buttonText}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '名称',
      dataIndex: 'name',
      width: '144px',
      placeholder: '请输入',
    },
    {
      key: '2',
      type: 'select',
      label: '状态',
      dataIndex: 'status',
      width: '144px',
      placeholder: '请选择',
      option: [
        {
          key: '0',
          value: '已启用',
        },
        {
          key: '1',
          value: '未启用',
        },
      ],
    },
  ];

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSubmit = (value: Record<string, string>) => {
    if (type === 'add') {
      createRuleTemplatesFun({ ...value });
    } else {
      updateRuleTemplatesFun({ ...value });
    }
  };

  return (
    <MatrixPageContent>
      <TableSearch
        form={form}
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        showTableTitle
        tableTitle="报警规则模板列表"
        extraNode={
          <Button
            type="primary"
            onClick={() => {
              setDrawerVisible(true);
              setType('add');
              setDrawerTitle('新增报警规则模版');
            }}
            icon={<PlusOutlined />}
          >
            新增报警规则模版
          </Button>
        }
        className="table-form"
        onSearch={queryList}
        reset={reset}
        scroll={
          tableProps.dataSource.length > 0 ? { x: 'max-content' } : undefined
        }
      />
      <TemplateDrawer
        visible={drawerVisible}
        onClose={onClose}
        drawerTitle={drawerTitle}
        record={editRecord}
        drawerType="template"
        onSubmit={onSubmit}
        type={type}
      />
    </MatrixPageContent>
  );
};

export default TemplateCom;
