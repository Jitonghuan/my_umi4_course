import { Tooltip, Popconfirm, Button, Tag } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { LIST_STATUS_TYPE } from '../load-detail/schema';

export const keyOptions = [
  { label: '资源类型', value: 'resourceType' },
  { label: '命名空间', value: 'namespace' },
  { label: '节点名称', value: 'nodeName' },
];

// 资源详情列表
export const resourceDetailTableSchema = ({
  handleDetail,
  rePublic,
  stop,
  handleYaml,
  handleDelete,
}: {
  handleDetail: (record: any, index: number) => void;
  rePublic: (record: any, index: number, updateColumn: string) => void;
  stop: (record: any, index: number, updateColumn: string) => void;
  handleYaml: (record: any, index: number) => void;
  handleDelete: (record: any, index: number) => void;
}) =>
  [
    {
      title: '资源名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      width: 100,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      width: 170,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },

    {
      title: 'IP',
      dataIndex: ['info', 'ip'],
      width: 170,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },

    {
      title: '节点',
      dataIndex: ['info', 'nodeName'],
      width: 140,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value ? value : '-'}
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '概述',
      dataIndex: 'overview',
      width: 200,
      ellipsis: true,
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: ['info', 'status'],
      width: 120,
      render: (value) => {
        return value ? (
          <Tag
            color={LIST_STATUS_TYPE[value] && LIST_STATUS_TYPE[value].color ? LIST_STATUS_TYPE[value].color : '#929793'}
          >
            {value}
          </Tag>
        ) : (
          <Tag color="processing">Active</Tag>
        );
      },
    },
    {
      title: '操作',
      fixed: 'right',
      width: 320,
      dataIndex: 'operate',
      render: (_: any, record: any, index: number) => (
        <div className="action-cell">
          {['deployments', 'pods', 'replicasets', 'statefulsets', 'configmaps', 'secrets'].includes(record?.type) && <a onClick={() => handleDetail(record, index)}>详情</a>}
          {['deployments', 'replicasets', 'statefulsets'].includes(record?.type) && (
            <Popconfirm
              title={`确定要重新部署吗？`}
              onConfirm={() => {
                rePublic(record, index, 'redeploy')
              }}
            >
              <a>重新部署</a>
            </Popconfirm>
          )}
          {['deployments'].includes(record?.type) && (
            <Popconfirm
              title={`确定要${record?.info?.paused ? '恢复编排' : '停止编排'}吗？`}
              onConfirm={() => {
                stop(record, index, 'paused')
              }}
            >
              <a >{record?.info?.paused ? '恢复编排' : '停止编排'}</a>
            </Popconfirm>
          )}
          {record.type !== 'namespaces' && <a onClick={() => handleYaml(record, index)}>YAML</a>}
          <Popconfirm
            title="确定要删除该资源吗？"
            onConfirm={() => {
              handleDelete(record, index);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnProps[];
