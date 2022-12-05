import { Popconfirm, Tooltip,Tag } from 'antd';
import { statusMap } from '../type';
export const listSchema = (params:{ 
    toDetail:(record: any, toTab: string) => void;
    downloadVersion:(record: any,) => void;
    downloadCountList:(record: any) => void;
    mergeVersion:(record: any,) => void;
    handleEdit:(record: any,index:number) => void; }) => {
    return [
        {
            title: '序号',
            dataIndex: 'id',
            width: 30,
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
            render: (value: string, record: any) => <a onClick={() => {params?.toDetail(record, 'config') }}>{value}</a>
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
            render: (value: string) => <span><Tag color={statusMap[value]?.color||"default"}>{statusMap[value]?.label||"--"}</Tag></span>,
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
            title: '发版时间',
            dataIndex: 'planTime',
            width: 120,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            fixed: 'right',
            render: (value: any, record: any, index: number) => (
                <div className="action-cell">
                    <a onClick={() => {params?.toDetail(record, 'list') }}>详情</a>
                    {record.status === 'developing' &&
                        <Popconfirm
                            title="确定锁定该需求吗？"
                            onConfirm={() => {
                                params?.handleEdit(record, index);
                            }}>
                            <a> 锁定需求</a>
                        </Popconfirm>
                    }
                    {record?.status === 'waitPack' &&
                        <Popconfirm
                            title="确定要发布该版本吗？"
                            onConfirm={() => {
                                params?.handleEdit(record, index);
                            }}>
                            <a> 发版</a>
                        </Popconfirm>
                    }
                    {record?.status === 'disable' &&
                        <Popconfirm
                            title="确定要启用该版本吗？"
                            onConfirm={() => {
                                params?.handleEdit(record, index);
                            }}>
                            <a > 启用版本</a>
                        </Popconfirm>
                    }
                    {record?.status === 'packFinish' &&
                        <a onClick={() => { params?.downloadVersion(record) }}>
                            下载版本包
                        </a>
                    }
                    {record?.status === 'packFinish' &&
                        <a onClick={() => { params?.mergeVersion(record) }}>
                            合并
                        </a>
                    }
                    {record?.status === 'packFinish' &&
                        <Popconfirm
                            title="确定要禁用该版本吗？"
                            onConfirm={() => {
                                params?.handleEdit(record, index);
                            }}>
                            <a>禁用</a>
                        </Popconfirm>
                    }
                </div>
            ),
        },
    ]
}

export const downloadList = () => {
    return [
        {
            title: '序号',
            dataIndex: '',
            width: 40,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '下载人',
            dataIndex: 'id',
            width: 80,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '下载时间',
            dataIndex: 'time',
            width: 100,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '下载目的',
            dataIndex: 'id',
            width: 240,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
    ]
}