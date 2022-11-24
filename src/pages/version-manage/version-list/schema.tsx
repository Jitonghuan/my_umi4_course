import { Popconfirm, Tooltip } from 'antd';
export const listSchema = ({ toDetail, downloadVersion, downloadCountList, mergeVersion }) => {
    return [
        {
            title: '序号',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: '版本号',
            dataIndex: 'releaseNumber',
            width: 80,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'list') }}>{value}</a>
        },
        {
            title: '变更应用数',
            dataIndex: 'version',
            width: 80,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'app') }}>{value}</a>
        },
        {
            title: '变更配置项',
            dataIndex: 'version',
            width: 80,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'config') }}>{value}</a>
        },
        {
            title: 'SQL脚本',
            dataIndex: 'version',
            width: 80,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'sql') }}>{value}</a>
        },
        {
            title: '关联内容',
            dataIndex: 'content',
            width: 80,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'list') }}>{value}</a>
        },
        {
            title: '版本简述',
            dataIndex: 'sketch',
            width: 150,
            ellipsis: true,
            render: (value: string) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 120,
        },
        {
            title: '下载次数',
            dataIndex: 'downloadCount',
            width: 60,
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
            width: 240,
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