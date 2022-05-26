import React from 'react';
import { Popconfirm } from '@cffe/h2o-design';
import { ColumnProps } from '@cffe/vc-hulk-table';

// 表格 schema
export const createTableSchema = ({
  currentVersion,
  onOperateClick,
}: {
  currentVersion?: any;
  onOperateClick: (type: 'detail' | 'delete' | 'edit', record: any, index: number) => void;
}) =>
  [
    {
      width: 80,
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
    {
      title: '版本号',
      dataIndex: 'version',
      render: () => currentVersion?.versionNumber || '',
    },
    {
      width: 170,
      title: '操作',
      dataIndex: 'operate',
      render: (text: string, record: any, index: number) => (
        <>
          <a onClick={() => onOperateClick('detail', record, index)}>详情</a>
          <a style={{ marginLeft: 20 }} onClick={() => onOperateClick('edit', record, index)}>
            编辑
          </a>
          <Popconfirm
            title="确定要删除该项吗？"
            onConfirm={() => onOperateClick('delete', record, index)}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <a style={{ marginLeft: 20 }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ] as ColumnProps[];
