import { Space, Tooltip, Popconfirm } from 'antd';

// 生产/消费列表
export const tableColumns = (params: {
    toDetail: (record: any, index: number) => void;
    toSubscriber: (record: any, index: number) => void;
    handleDel: (record: any, index: number) => void;
}) => {
    return [
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: '30%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '分组名称',
            dataIndex: 'groupName',
            key: 'groupName',
            width: '20%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '实例数',
            dataIndex: 'groupName',
            key: 'groupName',
            width: '8%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '健康实例数',
            dataIndex: 'groupName',
            key: 'groupName',
            width: '8%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            width: '12%',
            render: (_: string, record: any) => (
                //根据不同类型跳转
                <Space>
                    <a onClick={() => { toDetail(record) }}>详情</a>
                    <a onClick={() => { toSubscriber(record) }}>订阅实例</a>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => { handleDel(record) }}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ] as ColumnsType<any>;
};