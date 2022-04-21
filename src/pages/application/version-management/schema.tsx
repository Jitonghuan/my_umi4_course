import React from 'react';
import { history } from 'umi';
import { Popconfirm, Tooltip } from 'antd';
import { Html5Outlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';

export type AppType = 'frontend' | 'backend';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_ICON = {
  frontend: <Html5Outlined />,
  backend: <CodeOutlined />,
};

// 表格 schema
export const createTableSchema = ({
  onEditClick,
  onDelClick,
  categoryData,
  businessDataList,
}: {
  onEditClick: (record: any, index: number) => void;
  onDelClick: (record: any, index: number) => void;
  categoryData: any[];
  businessDataList: any[];
}) =>
  [
    {
      title: '版本ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: '版本名称',
      dataIndex: 'appName',
      width: 230,
      render: (text, record) => (
        <a
          onClick={() =>
            history.push({
              pathname: 'detail',
              query: {
                id: record.id,
                appCode: record.appCode,
              },
            })
          }
        >
          {text}
        </a>
      ),
    },
    {
      title: '版本CODE',
      dataIndex: 'appCode',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    // {
    //   title: 'git仓库名',
    //   width: 320,
    //   ellipsis: true,
    //   dataIndex: 'gitAddress',
    //   render: (value: string) =>
    //     value && (
    //       <a href={value} target="_blank">
    //         {value}
    //       </a>
    //     ),
    // },
    {
      title: '版本描述',
      dataIndex: 'desc',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      //   render: (value) => (
      //     <Tooltip placement="topLeft" title={value}>
      //       {value}
      //     </Tooltip>
      //   ),
    },
    {
      width: 140,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operate',
      align: 'center',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          <a onClick={() => onEditClick(record, index)}>编辑</a>
          <a
          // onClick={() => {
          //   history.push({
          //     pathname: 'detail',
          //     query: {
          //       id: record.id,
          //       appCode: record.appCode,
          //     },
          //   });
          // }}
          >
            查看
          </a>
          <Popconfirm
            title="确定要删除该版本吗？"
            onConfirm={() => onDelClick(record, index)}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnProps[];
