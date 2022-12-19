import { Popconfirm, Tooltip, Space } from 'antd';
import { statusMap } from '../type';
import { dateCellRender } from '@/utils';
export const listSchema = (params: {
    toDetail: (record: any, toTab: string) => void;
    downloadVersion: (record: any,) => void;
    downloadCountList: (record: any) => void;
    mergeVersion: (record: any,) => void;
    onPublish: (record: any, index: number) => void;
    onLock: (record: any, index: number) => void;
    onDisabledAction: (record: any, index: number) => void;
    onEnableAction: (record: any, index: number) => void;
    userPermission: string
}) => {
    return [
        {
            title: '序号',
            dataIndex: 'id',
            width: 30,
            render: (value: any, record: any, index: number) => <span>{index + 1}</span>
        },
        {
            title: '版本号',
            dataIndex: 'releaseNumber',
            width: 40,
            render: (value: string, record: any) => <a onClick={() => { params?.toDetail(record, 'list') }}>{value}</a>
        },
        {
            title: '变更应用数',
            dataIndex: 'alterationAppCount',
            width: 55,
            render: (value: string, record: any) => <a onClick={() => { params?.toDetail(record, 'app') }}>{value}</a>
        },
        {
            title: '变更配置项',
            dataIndex: 'alterationConfigCount',
            width: 55,
            render: (value: string, record: any) => <a onClick={() => { params?.toDetail(record, 'config') }}>{value}</a>
        },
        {
            title: 'SQL脚本',
            dataIndex: 'alterationSqlCount',
            width: 50,
            render: (value: string, record: any) => <a onClick={() => { params?.toDetail(record, 'sql') }}>{value}</a>
        },
        {
            title: '关联内容',
            dataIndex: 'relationDemandCount',
            width: 50,
            render: (value: string, record: any) => <a onClick={() => { params?.toDetail(record, 'list') }}>{value}</a>
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (value: string) => <span style={{ color: statusMap[value]?.color || "gray" }}>{statusMap[value]?.label || "--"}</span>,
        },
        {
            title: '版本简述',
            dataIndex: 'sketch',
            width: 150,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '下载次数',
            dataIndex: 'downloadCount',
            width: 45,
            render: (value: string, record: any) => <a onClick={() => { params?.downloadCountList(record) }}>{value}</a>
        },
        {
            title: '版本负责人',
            dataIndex: 'owner',
            width: 120,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '计划发版时间',
            dataIndex: 'planTime',
            width: 120,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '发版时间',
            dataIndex: 'finishTime',
            width: 120,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 180,
            fixed: 'right',
            render: (value: any, record: any, index: number) => (
                <Space>
                    <a onClick={() => { params?.toDetail(record, 'list') }}>详情</a>
                    {record.status === 'developing' &&
                        <span>

                            <Popconfirm
                                title="确定锁定该需求吗？"
                                onConfirm={() => {
                                    params?.onLock(record, index);
                                }}>
                                <a> 锁定需求</a>
                            </Popconfirm>
                        </span>
                    }
                    {(record?.status === 'waitPack' || record?.status === 'packError') && <span>

                        <Popconfirm
                            title="确定要发布该版本吗？"
                            onConfirm={() => {
                                params?.onPublish(record, index);
                            }}>
                            <a> 发版</a>
                        </Popconfirm>

                    </span>
                    }
                    {record?.status === 'disable' &&
                        <span>
                            <Popconfirm
                                title="确定要启用该版本吗？"
                                onConfirm={() => {
                                    params?.onEnableAction(record, index);
                                }}>
                                <a > 启用版本</a>
                            </Popconfirm>

                        </span>

                    }
                    {record?.status === 'packFinish' &&
                        <a onClick={() => { params?.downloadVersion(record) }}>
                            下载版本包
                        </a>
                    }
                    {record?.status === 'packFinish' &&
                        <span>
                            <a onClick={() => { params?.mergeVersion(record) }}>
                                合并
                        </a>
                        </span>

                    }
                    {record?.status === 'packFinish' &&
                        <span>
                            <Popconfirm
                                title="确定要禁用该版本吗？"
                                onConfirm={() => {
                                    params?.onDisabledAction(record, index);
                                }}>
                                <a style={{ color: "red" }}>禁用</a>
                            </Popconfirm>

                        </span>

                    }
                </Space>
            ),
        },
    ]
}

export const downloadList = () => {
    return [
        {
            title: '序号',
            dataIndex: "indexNumber",
            width: 40,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '下载人',
            dataIndex: 'createUser',
            width: 80,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '下载时间',
            dataIndex: 'gmtCreate',
            width: 100,
            ellipsis: true,
            render: (value: any, record: any) => {
                return dateCellRender(value);
            },
        },
        {
            title: '下载目的',
            dataIndex: 'reason',
            width: 240,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
    ]
}