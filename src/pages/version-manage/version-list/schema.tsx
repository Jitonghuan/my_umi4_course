import { Popconfirm } from 'antd';
export const listSchema = () => {
    return [
        {
            title: '序号',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '版本号',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '变更应用数',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '变更配置项',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'SQL脚本',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '关联内容',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '版本简述',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '状态',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '下载次数',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '版本负责人',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '发版时间',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: '操作',
            dataIndex: 'id',
            fix: 'right',
            width: 120,
            fixed: 'left',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <a onClick={() => { }}>
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
                    <Popconfirm
                        title="确定要禁用吗？"
                        onConfirm={() => {

                        }}
                    >
                        <a onClick={() => { }}>
                            禁用
                  </a>
                    </Popconfirm>
                    <a onClick={() => { }}>
                        启用版本
                  </a>
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