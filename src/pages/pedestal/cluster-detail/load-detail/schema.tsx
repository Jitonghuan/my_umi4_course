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
                <Tag color={LIST_STATUS_TYPE[value] && LIST_STATUS_TYPE[value].color ? LIST_STATUS_TYPE[value].color : 'green'}>{value}</Tag>
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

type statusTypeItem = {
    color: string;
    text: string;
};

export const LIST_STATUS_TYPE: Record<string, statusTypeItem> = {
    Running: { text: 'Running', color: 'green' },
    Succeeded: { text: 'Succeeded', color: 'cyan' },
    Pending: { text: 'Pending', color: 'gold' },
    Failed: { text: 'Failed', color: 'red' },
    Initializing: { text: 'Initializing', color: 'default' },
    NotReady: { text: 'NotReady', color: 'lime' },
    Unavailable: { text: 'Unavailable', color: 'red' },
    Scheduling: { text: 'Scheduling', color: 'geekblue' },
    Removing: { text: 'Removing', color: 'purple' },
    运行正常: { text: '运行正常', color: 'green' },
    已运行但健康检查异常: { text: '已运行但健康检查异常', color: 'yellow' },
    Terminated: { text: 'Terminated', color: 'default' },
    Waiting: { text: 'Waiting', color: 'yellow' },
    Unknown: { text: 'Unknown', color: 'red' },
    updating: { text: 'updating', color: 'yellow' },
    pausedUnready: { text: 'pausedUnready', color: 'yellow' },
    pausedReady: { text: 'pausedReady', color: 'yellow' },
    Success: { text: 'Success', color: 'green' },



};