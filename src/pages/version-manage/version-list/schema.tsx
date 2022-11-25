import { Popconfirm, Tooltip } from 'antd';
import { statusMap } from '../type';
export const listSchema = ({ toDetail, downloadVersion, downloadCountList, mergeVersion }) => {
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
            render: (value: string, record: any) => <a onClick={() => { toDetail(record, 'list') }}>{value}</a>
        },
        {
            title: '变更应用数',
            dataIndex: 'alterationAppCount',
            width: 55,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record, 'app') }}>{value}</a>
        },
        {
            title: '变更配置项',
            dataIndex: 'alterationConfigCount',
            width: 55,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record, 'config') }}>{value}</a>
        },
        {
            title: 'SQL脚本',
            dataIndex: 'alterationSqlCount',
            width: 50,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record, 'sql') }}>{value}</a>
        },
        {
            title: '关联内容',
            dataIndex: 'relationDemandCount',
            width: 50,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record, 'list') }}>{value}</a>
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (value: string) => <span>{statusMap[value].label}</span>,
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
            render: (value: string, record: any) => <a onClick={() => { downloadCountList(record) }}>{value}</a>
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
                    <a onClick={() => { toDetail(record.version) }}>
                        详情
                  </a>
                    <a onClick={() => { }}>
                        锁定需求
                  </a>
                    <a onClick={() => { }}>
                        发版
                  </a>
                    <a onClick={() => { downloadVersion(record) }}>
                        下载版本包
                  </a>
                    <a onClick={() => { mergeVersion(record) }}>
                        合并
                  </a>
                    {/* <a onClick={() => { }}>
                        启用版本
                  </a> */}
                    {/* <Button size="small" type="primary" onClick={() => download(record, index)}>下载文件</Button> */}
                    {/* <Popconfirm
                        title="确定要删除该信息吗？"
                        onConfirm={() => {
                            handleDelete(record, index);
                        }}
                    >
                        <a>
                            删除
                    </a>
                    </Popconfirm> */}
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