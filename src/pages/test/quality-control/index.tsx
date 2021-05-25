import React, { useContext, useState, useEffect } from 'react';
import { Button, Tag, Tooltip, Space, message, Form, Popconfirm } from 'antd';
import FELayout from '@cffe/vc-layout';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import useTable from '@/utils/useTable';
import { queryQCTaskList, executeQCTask } from '../service';
import { Item } from '../typing';
import usePublicData from '@/utils/usePublicData';
import TestDrawer from './testDrawer-add';

import './index.less';
import { postRequest } from '@/utils/request';

type statusTypeItem = {
  color: string;
  text: string;
  disable: boolean;
};

export const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '正常', color: 'green', disable: false },
  1: { text: '作废', color: 'default', disable: true },
};

const QualityControl: React.FC = () => {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [appCode, setAppCode] = useState<string | undefined>();
  const [appCategoryCode, setAppCategoryCode] = useState<string | undefined>();
  const [appBranch, setAppBranch] = useState<string | undefined>();
  const [form] = Form.useForm();

  const {
    tableProps,
    search: { submit: queryQCTable, reset },
  } = useTable({
    url: queryQCTaskList,
    method: 'GET',
    form,
    formatter: (vals) => {
      const { gmtCreate = [undefined, undefined], ...rest } = vals;

      return {
        ...rest,
        startTime: gmtCreate[0]
          ? gmtCreate[0].format('YYYY-MM-DD 00:00:00')
          : undefined,
        endTime: gmtCreate[1]
          ? gmtCreate[1].format('YYYY-MM-DD 23:59:59')
          : undefined,
      };
    },
  });

  const { appManageListData, appTypeData, appBranchData } = usePublicData({
    appCode,
    appCategoryCode,
  });

  // 二次确认执行
  const onConfirm = async (taskId?: string) => {
    if (!taskId) return;

    await postRequest(executeQCTask, {
      data: {
        taskId,
        createUser: userInfo?.userName,
      },
    });

    message.success('执行成功');
  };

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '任务名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
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
      dataIndex: 'categoryCode',
      key: 'categoryName',
      width: 100,
    },
    {
      title: '应用名',
      dataIndex: 'appCode',
      key: 'appName',
      width: 100,
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '分支名',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 100,
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      // ellipsis: true,
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          {text}
          {/* <span
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span> */}
        </Tooltip>
      ),
    },
    {
      title: '上一次检测时间',
      dataIndex: 'lastCheckTime',
      key: 'lastCheckTime',
      // ellipsis: true,
      width: 200,
    },
    {
      title: '检测次数',
      dataIndex: 'checkNum',
      key: 'checkNum',
      width: 100,
    },
    {
      title: '成功次数',
      dataIndex: 'checkSuccessNum',
      key: 'checkSuccessNum',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确认执行当前任务？"
            okText="确定"
            disabled={STATUS_TYPE[record.status as number]?.disable}
            onConfirm={() => onConfirm(record?.id as string)}
          >
            <Button
              type="link"
              disabled={STATUS_TYPE[record.status as number]?.disable}
              style={{ padding: 0 }}
            >
              执行
            </Button>
          </Popconfirm>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              history.push(`./qualityControl/unitTest?id=${record.id}`);
            }}
          >
            单测记录
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              history.push(`./qualityControl/codeQuality?id=${record.id}`);
            }}
          >
            质检记录
          </Button>
        </Space>
      ),
    },
  ];

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '应用分类',
      dataIndex: 'categoryCode',
      width: '144px',
      option: appTypeData,
      onChange: setAppCategoryCode,
    },
    {
      key: '2',
      type: 'select',
      label: '应用名',
      dataIndex: 'appCode',
      width: '144px',
      option: appManageListData,
      onChange: setAppCode,
    },
    {
      key: '3',
      type: 'select',
      label: '分支名',
      dataIndex: 'branchName',
      width: '144px',
      option: appBranchData,
      onChange: setAppBranch,
    },
    {
      key: '4',
      type: 'select',
      label: '状态',
      dataIndex: 'status',
      width: '144px',
      placeholder: '请选择',
      option: Object.keys(STATUS_TYPE).map((el) => ({
        key: el,
        value: STATUS_TYPE[el as any]?.text,
      })),
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'range',
      label: '创建时间',
      dataIndex: 'gmtCreate',
      width: '250px',
      rules: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  const onClose = () => {
    setDrawerVisible(false);
    queryQCTable();
  };

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
          defaultPageSize: 20,
        }}
        extraNode={
          <Button
            type="primary"
            onClick={() => {
              setDrawerVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            新增检测任务
          </Button>
        }
        showTableTitle
        searchText="查询"
        tableTitle="数据生成记录"
        className="table-form"
        onSearch={queryQCTable}
        reset={reset}
        scroll={
          tableProps.dataSource.length > 0
            ? { x: '120%', y: 300, scrollToFirstRowOnChange: true }
            : undefined
        }
        // scroll={{ y: 300, scrollToFirstRowOnChange: true }}
      />
      <TestDrawer visible={drawerVisible} onClose={onClose} />
    </MatrixPageContent>
  );
};

export default QualityControl;
