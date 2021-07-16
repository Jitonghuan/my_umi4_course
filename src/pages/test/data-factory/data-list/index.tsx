import React, { useContext } from 'react';
import { Button, Tag, Tooltip, Form, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';
import FELayout from '@cffe/vc-layout';
import FEContext from '@/layouts/basic-layout/fe-context';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import useTable from '@/utils/useTable';
import TableSearchForm from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import usePublicData from '@/utils/usePublicData';
import { Item } from '../typing';
import DetailModal from '@/components/detail-modal';
import { queryData } from '../service';
import './index.less';

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '创建中', color: 'blue' },
  2: { text: '失败', color: 'volcano' },
  1: { text: '成功', color: 'green' },
};

export default function DataFactoryList(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { categoryData = [] } = useContext(FEContext);
  const [form] = Form.useForm();

  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
  });

  const {
    tableProps,
    search: { submit: queryList, reset },
  } = useTable({
    url: queryData,
    method: 'GET',
    form,
    formatter: (record) => {
      return {
        ...record,
        gmtCreate: record.gmtCreate ? moment(record?.gmtCreate)?.format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
    },
  });

  const columns: ColumnsType<Item> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: '数据明细',
      dataIndex: 'response',
      key: 'response',
      // width: '6%',
      render: (text) => {
        if (!text || (typeof text === 'object' && Object.keys(text).length === 0)) return '';
        return (
          <Tooltip title={JSON.stringify(text)}>
            <span
              style={{
                display: 'inline-block',
                width: 100,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {JSON.stringify(text)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '数据工厂名称',
      dataIndex: 'factoryName',
      key: 'factoryName',
    },
    {
      title: '环境',
      dataIndex: 'env',
      key: 'env',
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      render: (value) => {
        const result = categoryData?.filter((el) => el.value === value);
        return result?.length ? result[0].label : value || '';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: '12%',
      render: (value) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
    },
    {
      title: '创建参数',
      dataIndex: 'params',
      key: 'params',
      render: (text) => {
        if (!text || (typeof text === 'object' && Object.keys(text).length === 0)) return '';
        return (
          <Tooltip title={JSON.stringify(text)}>
            <span
              style={{
                display: 'inline-block',
                width: 100,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {JSON.stringify(text)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].text}</Tag>,
    },
    {
      title: '日志',
      dataIndex: 'errorLog',
      key: 'errorLog',
      render: (value: string) => <DetailModal data={value} />,
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '项目',
      dataIndex: 'project',
      width: '144px',
      placeholder: '请输入',
      option: appTypeData,
      rules: [],
    },
    {
      key: '2',
      type: 'input',
      label: '数据工厂名称',
      dataIndex: 'factoryName',
      width: '144px',
      rules: [],
    },
    {
      key: '3',
      type: 'select',
      label: '创建环境',
      dataIndex: 'env',
      width: '144px',
      placeholder: '请选择',
      option: envListType,
      rules: [],
    },
    {
      key: '4',
      type: 'date',
      label: '创建时间',
      dataIndex: 'gmtCreate',
      width: '144px',
      placeholder: '请选择',
      rules: [],
    },
    {
      key: '5',
      type: 'checkbox',
      dataIndex: 'createUser',
      width: '144px',
      placeholder: '请选择',
      rules: [],
      checkboxOption: [
        {
          label: '我的数据',
          value: userInfo?.userName!,
        },
      ],
      onChange: () => queryList(),
    },
  ];

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="records" history={props.history} />
      <ContentCard>
        <TableSearchForm
          form={form}
          formOptions={formOptions}
          formLayout="inline"
          onSearch={queryList}
          reset={reset}
          searchText="查询"
          style={{ marginBottom: 24 }}
        />
        <div className="table-caption">
          <h3></h3>
          <Button type="primary" onClick={() => history.push('./add')} icon={<PlusOutlined />}>
            新增数据
          </Button>
        </div>
        <Table
          className="table-form"
          columns={columns}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
        />
      </ContentCard>
    </MatrixPageContent>
  );
}
