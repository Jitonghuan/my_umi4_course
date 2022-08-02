import { Tag, Table, Empty, Tooltip, Divider, Button } from 'antd';
// 资源详情-负载-pods详情
export const PodsDetailColumn = ({ viewLog, shell }: {
    viewLog: (record: any, index: number) => void;
    shell: (record: any, index: number) => void;
}) =>
    [
        {
            title: '名称',
            dataIndex: 'name',
            width: 120,
            ellipsis: true,
            render: (value: any) => (
                <Tooltip placement="top" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '镜像',
            dataIndex: 'image',
            width: 230,
            ellipsis: true,
            render: (value: any) => (
                <Tooltip placement="top" title={value}>
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
        {
            title: '操作',
            fixed: 'right',
            width: 300,
            dataIndex: 'operate',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <Button size="small" type="primary" onClick={() => viewLog(record, index)}>查看日志</Button>
                    {record?.status === 'Running' && <Button size="small" type="primary" onClick={() => shell(record, index)}>登陆shell</Button>}
                </div>
            ),
        },
    ] as any;

export const envVarTable = () =>
    [
        {
            title: 'KEY',
            dataIndex: 'name',
            width: '40%',
            ellipsis: {
                showTitle: false,
            },
            render: (value: any) => (
                <Tooltip placement="top" title={value} overlayStyle={{ maxWidth: '1000px' }}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: 'VALUE',
            dataIndex: 'value',
            width: '50%',
            ellipsis: {
                showTitle: false,
            },
            render: (value: any) => (
                <Tooltip placement="top" title={value} overlayStyle={{ maxWidth: '1000px' }}>
                    {value}
                </Tooltip>
            ),
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