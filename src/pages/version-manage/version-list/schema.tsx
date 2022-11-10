import { Popconfirm } from 'antd';
export const listSchema = ({ toDetail }) => {
    return [
        {
            title: '序号',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '版本号',
            dataIndex: 'version',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'list') }}>{value}</a>
        },
        {
            title: '变更应用数',
            dataIndex: 'version',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'app') }}>{value}</a>
        },
        {
            title: '变更配置项',
            dataIndex: 'version',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'config') }}>{value}</a>
        },
        {
            title: 'SQL脚本',
            dataIndex: 'version',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'sql') }}>{value}</a>
        },
        {
            title: '关联内容',
            dataIndex: 'content',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { toDetail(record.version, 'list') }}>{value}</a>
        },
        {
            title: '版本简述',
            dataIndex: 'id',
            width: 150,
        },
        {
            title: '状态',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '下载次数',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '版本负责人',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '发版时间',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 240,
            fixed: 'right',
            render: (_: any, record: any, index: number) => (
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
                    <a onClick={() => { }}>
                        下载版本包
                  </a>
                    <a onClick={() => { }}>
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