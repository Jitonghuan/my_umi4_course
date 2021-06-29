import React, { useState, useEffect } from 'react';
import { Button, Space, Popconfirm, Table, Tooltip, Modal, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import useTable from '@/utils/useTable';
import useRequest from '@/utils/useRequest';
import { Item, AlertNameProps } from '../typing';
import RulesTable from '../component/rules-table';
import usePublicData from './usePublicData';
import { queryPrometheusList, deletePrometheus } from '../service';
import './index.less';

const PrometheusCom: React.FC = () => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [rulesVisible, setRulesVisible] = useState(false);
  const [labelRecord, setLabelRecord] = useState<Record<string, string>>({});
  const [rulesId, setRulesId] = useState('');
  const [modalType, setModalType] = useState<'label' | 'rules'>('label');
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

  // const confirm = (id: React.Key) => {
  //   run({ id });
  // };

  const editLabelRecord = (record: Record<string, string>) => {
    return Object.keys(record).map((v) => {
      return {
        key: v,
        value: record[v],
      };
    });
  };

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
      render: (text: Record<string, string>) => {
        if (Object.keys(text).length === 0) return '';
        return (
          <a
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            onClick={() => {
              setLabelVisible(true);
              setLabelRecord(text);
              setModalType('label');
            }}
          >
            {JSON.stringify(text)}
          </a>
        );
      },
    },
    {
      title: '报警规则',
      dataIndex: 'alertRules',
      key: 'alertRules',
      render: (text: AlertNameProps[], record) => {
        if (!text) return '';
        if (Array.isArray(text) && text.length === 0) return '';
        return (
          <a
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            onClick={() => {
              setRulesVisible(true);
              setRulesId(record.id as string);
              setModalType('rules');
            }}
          >
            {JSON.stringify(text[0])}
          </a>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_: string, record: Item) => (
        <Space>
          <Link to={`./prometheus/prometheus-edit?name=${record.name}`}>编辑</Link>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => run({ id: record.id })}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
            placement="topLeft"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (expandData: AlertNameProps[] | { key: string; value: string }[]) => {
    const labelColumns = [
      {
        title: 'key',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: 'value',
        dataIndex: 'value',
        key: 'value',
      },
    ];

    return (
      <Table
        dataSource={[...expandData]}
        columns={labelColumns}
        pagination={false}
        // rowKey={record => record.key}
      />
    );
  };

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

  const isLabel = modalType === 'label';

  const onCancel = () => {
    setLabelRecord({});
    setLabelVisible(false);
    setRulesId('');
    setRulesVisible(false);
  };

  const onReset = () => {
    setAppCode('');
    reset();
  };
  // useEffect(() => {
  //   setDataSource([]);
  // }, []);

  return (
    <MatrixPageContent>
      <TableSearch
        form={form}
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        // {...pagination}
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
              history.push('./prometheus/prometheus-add');
            }}
            icon={<PlusOutlined />}
          >
            接入Prometheus
          </Button>
        }
        // className="table-form"
        onSearch={submit}
        reset={onReset}
        // scroll={{ x: 'max-content' }}
        rowKey="id"
        className="expand-table"
      />
      <Modal
        visible={isLabel ? labelVisible : rulesVisible}
        title={isLabel ? '查看Matchlabels' : '查看报警规则'}
        onCancel={onCancel}
        width={800}
        bodyStyle={{ minHeight: 500 }}
        footer={null}
        destroyOnClose
      >
        {isLabel ? (
          expandedRowRender(editLabelRecord(labelRecord))
        ) : (
          <RulesTable serviceId={rulesId} isShowAddButton={false} />
        )}
      </Modal>
    </MatrixPageContent>
  );
};

export default PrometheusCom;
