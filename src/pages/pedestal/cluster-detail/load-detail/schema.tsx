import { Tag, Table, Empty, Tooltip, Divider, Button } from 'antd';
// 资源详情-负载-pods详情
export const PodsDetailColumn = () =>
    [
        {
            title: '名称',
            dataIndex: 'name',
            width: 100,
        },
        {
            title: '镜像',
            dataIndex: 'image',
            width: 230,
            ellipsis: true,
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '重启数',
            dataIndex: 'restarts',
            width: 150,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 80,
            render: (value: string) => (
                <Tag color="green">{value}</Tag>
            ),
        },
    ] as any;

export const envVarTable = () =>
    [
        {
            title: 'KEY',
            dataIndex: 'name',
            width: 400,
        },
        {
            title: 'VALUE',
            dataIndex: 'value',
            width: 400,
        },
    ] as any;