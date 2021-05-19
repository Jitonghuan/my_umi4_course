import React, { useState, useEffect } from 'react';
import { Button, Space, Popconfirm, Table, Tooltip, Modal, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import useTable from '@/utils/useTable';
import { Item, AlertNameProps } from '../typing';
import { queryPrometheusList } from '../service';
import './index.less';

const PrometheusCom: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [labelVisible, setLabelVisible] = useState(false);
  const [rulesVisible, setRulesVisible] = useState(false);
  const [labelRecord, setLabelRecord] = useState<Record<string, string>>({});
  const [rulesRecord, setRulesRecord] = useState<AlertNameProps[]>([]);
  const [modalType, setModalType] = useState<'label' | 'rules'>('label');

  const [form] = Form.useForm();

  const { tableProps, search } = useTable({
    url: queryPrometheusList,
    method: 'GET',
    form,
  });

  const confirm = () => {
    //....
  };

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
      title: '应用名称',
      dataIndex: 'appCode',
      key: 'appCode',
    },
    {
      title: '环境名称',
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
        if (Object.keys(text).length === 0) return '-';
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
      dataIndex: 'alertName',
      key: 'alertName',
      render: (text: AlertNameProps[]) => {
        if (!text) return '-';
        if (Array.isArray(text) && text.length === 0) return '-';
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
              setRulesRecord(text);
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
          <Link to={`./prometheus/prometheus-edit?id=${record.id}`}>编辑</Link>
          <Popconfirm
            title="确认删除？"
            onConfirm={confirm}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (
    expandData: AlertNameProps[] | { key: string; value: string }[],
    type?: string,
  ) => {
    const rulesColumns = [
      {
        title: '规则名称',
        dataIndex: 'alertRuleName',
        key: 'alertRuleName',
      },
      {
        title: '告警表达式',
        dataIndex: 'expression',
        key: 'expression',
        // width: '5%',
        // ellipsis: true,
        render: (text: string) => (
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
      },
    ];

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
        columns={type === 'label' ? labelColumns : rulesColumns}
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
      width: '144px',
      placeholder: '请输入',
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用名称',
      dataIndex: 'appCode',
      width: '144px',
      placeholder: '请选择',
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境名称',
      dataIndex: 'envCode',
      width: '144px',
      placeholder: '请选择',
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'input',
      label: 'URL',
      dataIndex: 'metricsUrl',
      width: '144px',
      placeholder: '请输入',
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  const isLabel = modalType === 'label';

  const onSearch = (value: Record<string, any>) => {
    console.log(value, '8888');
  };

  const onCancel = () => {
    setLabelRecord({});
    setLabelVisible(false);
    setRulesRecord([]);
    setRulesVisible(false);
  };

  useEffect(() => {
    setDataSource([]);
  }, []);

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
        onSearch={search.submit}
        reset={search.reset}
        scroll={{ x: 'max-content' }}
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
      >
        {isLabel
          ? expandedRowRender(editLabelRecord(labelRecord), 'label')
          : expandedRowRender(rulesRecord)}
      </Modal>
    </MatrixPageContent>
  );
};

export default PrometheusCom;
