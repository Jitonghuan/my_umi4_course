import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Form, Input, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { history } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import useTable from '@/utils/useTable';
import MatrixPageContent from '@/components/matrix-page-content';
import { queryUnittestCoverCheckLogList } from '../../service';
import usePublicData from '@/utils/usePublicData';
import VCModal from '@/components/vc-modal';
import { Item } from '../../typing';

type statusTypeItem = {
  color: string;
  text: string;
};
// 0:运行中 1:成功 2:失败
const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '运行中', color: 'blue' },
  1: { text: '成功', color: 'green' },
  2: { text: '失败', color: 'volcano' },
};

const UnitTest: React.FC<any> = () => {
  const [form] = Form.useForm();

  const [appCode, setAppCode] = useState<string | undefined>();
  const [appCategoryCode, setAppCategoryCode] = useState<string | undefined>();

  const [frameVisible, setFrameVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>({});

  const {
    location: { query },
  } = history;

  const { appManageListData, appTypeData, appBranchData } = usePublicData({
    appCode,
    appCategoryCode,
  });

  const {
    tableProps,
    search: { submit: queryUnittest, reset },
  } = useTable({
    url: queryUnittestCoverCheckLogList,
    method: 'GET',
    form,
    formatter: (vals) => {
      const { testTime = [undefined, undefined], ...rest } = vals;

      return {
        ...rest,
        startTime: testTime[0]
          ? testTime[0].format('YYYY-MM-DD 00:00:00')
          : undefined,
        endTime: testTime[1]
          ? testTime[1].format('YYYY-MM-DD 23:59:59')
          : undefined,
        ...query,
      };
    },
  });

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
      width: '5%',
    },
    {
      title: '任务名',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '10%',
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
      title: '应用分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '10%',
    },
    {
      title: '应用名',
      dataIndex: 'appName',
      key: 'appName',
      width: '10%',
    },
    {
      title: '分支名',
      dataIndex: 'branchName',
      key: 'branchName',
      width: '10%',
    },
    {
      title: '检测时间',
      dataIndex: 'testTime',
      key: 'testTime',
      width: '15%',
      render: (_, record) => (
        <span>
          {record.startTime || '-'}
          <br />
          {record.endTime || '-'}
        </span>
      ),
    },
    {
      title: '检测时长(秒)',
      dataIndex: 'times',
      key: 'times',
      width: '15%',
    },
    {
      title: '构建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: '10%',
    },
    {
      title: '指令覆盖率',
      dataIndex: 'instructionsCov',
      key: 'instructionsCov',
      width: '10%',
    },
    {
      title: '分支覆盖率',
      dataIndex: 'branchesCov',
      key: 'branchesCov',
      width: '10%',
    },
    {
      title: '行覆盖率',
      dataIndex: 'linesCov',
      key: 'linesCov',
      width: '10%',
    },
    {
      title: '方法覆盖率',
      dataIndex: 'methodsCov',
      key: 'methodsCov',
      width: '10%',
    },
    {
      title: '类覆盖率',
      dataIndex: 'classesCov',
      key: 'classesCov',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].text}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 80,
      fixed: 'right',
      render: (_, record) =>
        record.reportUrl && (
          <a
            onClick={() => {
              setFrameVisible(true);
              setCurrentRecord(record);
            }}
          >
            查看报告
          </a>
        ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'other',
      // label: '应用分类',
      // dataIndex: 'value',
      // width: '144px',
      // placeholder: '请输入',
      extraForm: (
        <Form.Item noStyle name="taskInfo">
          <Input
            prefix={<SearchOutlined />}
            placeholder="请输入任务ID/任务名"
            style={{ width: 280 }}
            allowClear
          />
        </Form.Item>
      ),
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用分类',
      dataIndex: 'categoryCode',
      width: '144px',
      option: appTypeData,
      onChange: (e) => {
        setAppCategoryCode(e);
        if (
          !form?.getFieldValue('appCode') ||
          !form?.getFieldValue('branchName')
        ) {
          setAppCode('');
        }
        form?.resetFields(['appCode', 'branchName']);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '应用名',
      dataIndex: 'appCode',
      width: '144px',
      option: form?.getFieldValue('categoryCode') ? appManageListData : [],
      showSelectSearch: true,
      onChange: (e) => {
        setAppCode(e);
        if (!form?.getFieldValue('branchName')) return;
        form?.resetFields(['branchName']);
      },
    },
    {
      key: '4',
      type: 'select',
      label: '分支名',
      dataIndex: 'branchName',
      width: '144px',
      option: form?.getFieldValue('appCode') ? appBranchData : [],
    },
    {
      key: '5',
      type: 'range',
      label: '检测时间',
      dataIndex: 'testTime',
      width: '280px',
      rules: [],
    },
    {
      key: '6',
      type: 'input',
      label: '构建人',
      dataIndex: 'createUser',
      width: '144px',
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '7',
      type: 'select',
      label: '状态',
      dataIndex: 'status',
      width: '144px',
      option: Object.keys(STATUS_TYPE).map((el) => ({
        key: el,
        value: STATUS_TYPE[el as any]?.text,
      })),
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  return (
    <MatrixPageContent>
      <TableSearch
        form={form}
        formOptions={formOptions}
        formLayout="inline"
        columns={columns.map((el) => ({
          render: (text) => text || '-',
          ...el,
        }))}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `总共 ${total} 条数据`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        showTableTitle
        searchText="查询"
        tableTitle="执行记录"
        className="table-form"
        onSearch={queryUnittest}
        reset={reset}
        scroll={{ x: '150%', scrollToFirstRowOnChange: true }}
      />

      <VCModal
        visible={frameVisible}
        onCancel={() => setFrameVisible(false)}
        isFull
        footer={
          <Button type="primary" onClick={() => setFrameVisible(false)}>
            关闭
          </Button>
        }
      >
        <iframe src={currentRecord.reportUrl} width="100%" height="100%" />
      </VCModal>
    </MatrixPageContent>
  );
};

export default UnitTest;
