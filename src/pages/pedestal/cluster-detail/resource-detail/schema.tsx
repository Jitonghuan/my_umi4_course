import { Tooltip, Popconfirm, Button, Tag } from 'antd';
import type { ColumnProps } from '@cffe/vc-hulk-table';

export const keyOptions = [
    { label: '资源类型', value: 'resourceType' },
    { label: '命名空间', value: 'namespace' },
    { label: '节点名称', value: 'nodeName' }
]

// 资源详情列表
export const resourceDetailTableSchema = ({
    handleDetail,
    rePublic,
    stop,
    handleYaml,
    handleDelete
}: {
    handleDetail: (record: any, index: number) => void;
    rePublic: (record: any, index: number) => void;
    stop: (record: any, index: number) => void;
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
            dataIndex: 'kind',
            width: 100,
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
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

        {
            title: '节点',
            dataIndex: 'nodeName',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: '概述',
            dataIndex: 'overview',
            width: 200,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 200,
        },
        {
            title: '操作',
            fixed: 'right',
            width: 320,
            dataIndex: 'operate',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <a onClick={() => handleDetail(record, index)}>详情</a>
                    <a onClick={() => rePublic(record, index)}>重新部署</a>
                    <a onClick={() => stop(record, index)}>停止编排</a>
                    <a onClick={() => handleYaml(record, index)}>查看YAML</a>
                    <Popconfirm
                        title="确定要删除该资源吗？"
                        onConfirm={() => {
                            handleDelete(record, index)
                        }}
                    >
                        <a style={{ color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ] as ColumnProps[];