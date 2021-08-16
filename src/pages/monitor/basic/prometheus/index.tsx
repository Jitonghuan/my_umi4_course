import React, { useState } from 'react';
import { Button, Space, Popconfirm, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import useTable from '@/utils/useTable';
import useRequest from '@/utils/useRequest';
import { Item } from '../../typing';
import usePublicData from './usePublicData';
import DetailModal from '@/components/detail-modal';
import { queryPrometheusList, deletePrometheus } from '../../service';
import './index.less';

const PrometheusCom: React.FC = () => {
  const [appCode, setAppCode] = useState('');
  const [form] = Form.useForm();

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: queryPrometheusList,
    method: 'GET',
    form,
  });

  const { appManageEnvData, appManageListData } = usePublicData({
    appCode,
  });

  const { run } = useRequest({
    api: deletePrometheus,
    method: 'GET',
    successText: '删除成功',
    isSuccessModal: true,
    onSuccess: () => {
      submit();
    },
  });

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: '监控名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用code',
      dataIndex: 'appCode',
      key: 'appCode',
    },
    {
      title: '环境code',
      dataIndex: 'envCode',
      key: 'envCode',
    },
    {
      title: 'URL',
      dataIndex: 'metricsUrl',
      key: 'metricsUrl',
    },
    {
      title: 'Matchlabels',
      dataIndex: 'labels',
      key: 'labels',
      render: (v: any) => {
        const data = JSON.stringify(v, null, 2);
        return <DetailModal limit={60} data={data} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_: string, record: Item) => (
        <Space>
          <Link to={`./prometheus-edit?name=${record.name}`}>编辑</Link>
          <Popconfirm title="确认删除？" onConfirm={() => run({ id: record.id })} placement="topLeft">
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '监控名称',
      dataIndex: 'name',
      width: '160px',
      placeholder: '请输入',
    },
    {
      key: '2',
      type: 'select',
      label: '应用code',
      dataIndex: 'appCode',
      width: '160px',
      placeholder: '请选择',
      showSelectSearch: true,
      option: appManageListData as OptionProps[],
      onChange: (e: string) => {
        setAppCode(e);
        if (!form?.getFieldValue('envCode')) return;
        form.resetFields(['envCode']);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境code',
      dataIndex: 'envCode',
      width: '160px',
      showSelectSearch: true,
      option: appManageEnvData as OptionProps[],
    },
    {
      key: '4',
      type: 'input',
      label: 'URL',
      dataIndex: 'metricsUrl',
      width: '160px',
      placeholder: '请输入',
    },
  ];

  const onReset = () => {
    setAppCode('');
    reset();
  };

  return (
    <TableSearch
      splitLayout={false}
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
      }}
      showTableTitle
      tableTitle="Prometheus监控列表"
      extraNode={
        <Button
          type="primary"
          onClick={() => {
            history.push('./prometheus-add');
          }}
          icon={<PlusOutlined />}
        >
          接入Prometheus
        </Button>
      }
      onSearch={submit}
      reset={onReset}
      rowKey="id"
    />
  );
};

export default PrometheusCom;
