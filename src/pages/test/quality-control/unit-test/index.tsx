import React, { useState, useEffect } from 'react';
import { Tooltip, Form, Input, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import moment, { Moment } from 'moment';
import TableSearch from '@/components/table-search';
import { FormProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
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

const UnitTest: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  const columns: ColumnsType<Item> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
    },
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
      width: '5%',
      // render: (text) => (
      //   <Link to={`./function/checkFunction?id=${text}`}>{text}</Link>
      // ),
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
      width: '10%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '检测时间',
      dataIndex: 'testTime',
      key: 'testTime',
      // ellipsis: true,
      width: '15%',
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
      title: '检测时长(秒)',
      dataIndex: 'times',
      key: 'times',
      // ellipsis: true,
      width: '15%',
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
      render: (_, record) => (
        <a onClick={() => history.push(record.reportUrl as string)}>查看报告</a>
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
      dataIndex: 'categoryName',
      width: '144px',
      option: [],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '应用名',
      dataIndex: 'appName',
      width: '144px',
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'input',
      label: '分支名',
      dataIndex: 'branchName',
      width: '144px',
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'range',
      label: '检测时间',
      dataIndex: 'testTime',
      width: '280px',
      rules: [],
      onChange: (e: Moment[]) => {
        console.log(moment(e[0]).format('YYYY-MM-DD 00:00:00'), 'date');
        console.log(moment(e[1]).format('YYYY-MM-DD 23:59:59'), 'date');
      },
    },
    {
      key: '6',
      type: 'input',
      label: '构建人',
      dataIndex: 'creator',
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
      option: [
        {
          key: 1,
          value: '1',
        },
        {
          key: 2,
          value: '2',
        },
        {
          key: 3,
          value: '3',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  const onSearch = (value: Record<string, any>) => {
    console.log(value, '8888');
  };

  useEffect(() => {
    const arr: Item[] = new Array(20).fill(1).map((_, i) => {
      return {
        id: `${i + 10000}`,
        classification: '顶顶顶顶',
        taskName: '啊卡仕达卡仕',
        name: '撒谎的',
        branchName: '3-123',
        testTime: '2012-01-01 00:00',
        durationTime: '500',
        taskId: 100,
        creator: '张三',
        instructionRate: '68.88%',
        branchRate: '78.77%',
        status: i % 3 === 0 ? 2 : i % 3 === 2 ? 1 : 0,
      };
    });

    setDataSource(arr);
  }, []);

  return (
    <MatrixPageContent>
      <TableSearch
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        dataSource={dataSource}
        pagination={{
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        showTableTitle
        searchText="查询"
        tableTitle="执行记录"
        className="table-form"
        onSearch={onSearch}
        scroll={{ x: '150%', y: 300, scrollToFirstRowOnChange: true }}
        // scroll={{ y: 300, scrollToFirstRowOnChange: true }}
      />
    </MatrixPageContent>
  );
};

export default UnitTest;
