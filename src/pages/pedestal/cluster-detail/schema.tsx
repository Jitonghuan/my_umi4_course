import { history } from 'umi';
import { Tooltip, Popconfirm, Button, Tag } from 'antd';
import { Html5Outlined, CodeOutlined, MinusCircleFilled } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';

// 节点列表
export const nodeListTableSchema = ({
    clickTag,
    updateNode,
    drain,
    handleDelete,
    shell
}: {
    clickTag: (record: any, index: number) => void;
    updateNode: (record: any, index: number) => void;
    drain: (record: any, index: number) => void;
    handleDelete: (record: any, index: number) => void;
    shell: (record: any, index: number) => void;
}) =>
    [
        {
            title: '节点名',
            dataIndex: 'nodeName',
            width: 120,
            // fixed: 'left',
        },
        {
            title: 'IP',
            dataIndex: 'nodeIp',
            width: 120,
            // fixed: 'left',
        },
        {
            title: 'CPU',
            dataIndex: 'cpu',
            width: 120,
            // fixed: 'left',
            render: (value: string, record: any) => (
                <div>
                    {record?.metricInfo?.cpuInfo?.usage}/{record?.metricInfo?.cpuInfo?.total}
                    <span style={{ marginLeft: '10px' }}>{record?.metricInfo?.cpuInfo?.unit}</span>
                </div>
            )
        },

        {
            title: '内存',
            dataIndex: ['metricInfo', 'memoryInfo', 'total'],
            width: 120,
            // fixed: 'left',
            render: (value: string, record: any) => (
                <div>
                    {record?.metricInfo?.memoryInfo?.usage}/{record?.metricInfo?.memoryInfo?.total}
                    <span style={{ marginLeft: '10px' }}>{record?.metricInfo?.memoryInfo?.unit}</span>
                </div>
            )
        },
        {
            title: '磁盘',
            dataIndex: ['metricInfo', 'diskInfo', 'total'],
            width: 120,
            // fixed: 'left',
            render: (value: string, record: any) => (
                <div>
                    {record?.metricInfo?.diskInfo?.usage}/{record?.metricInfo?.diskInfo?.total}
                    <span style={{ marginLeft: '10px' }}>{record?.metricInfo?.diskInfo?.unit}</span>
                </div>
            )
        },
        {
            title: '负载(M)',
            dataIndex: 'load',
            width: 80,
            // fixed: 'left',
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 80,
            // fixed: 'left',
            render: (value: any, record: any) => (
                <div>
                    {value && value.includes('unschedulable') && <span style={{ color: 'red' }}>不可调度</span>}
                    {value && value.includes('drain') && <span style={{ color: 'red' }}>排空</span>}
                </div>
            )
        },
        {
            title: '标签',
            dataIndex: 'tags',
            width: 300,
            className: 'my-ant-table-cell',
            render: (value: any, record: any) => (
                <div style={{ whiteSpace: 'nowrap' }}>{Object.keys(record.labels || {}).map((k) =>
                    <Tag color="green">{`${k}=${record.labels[k]}`}</Tag>
                )}
                    {(record?.taints || []).map((e: any) => <Tag color="green">{`${e.key}=${e.value}`}</Tag>)}
                </div>
            )
        },
        {
            title: '操作',
            fixed: 'right',
            width: 300,
            dataIndex: 'operate',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <a onClick={() => shell(record, index)}>登陆shell</a>
                    <a onClick={() => clickTag(record, index)}>设置标签</a>
                    <a onClick={() => updateNode(record, index)}>{record.unschedulable ? '可调度' : '不可调度'}</a>
                    <a onClick={() => drain(record, index)}>排空</a>
                    <Popconfirm
                        title="确定要删除该节点吗？"
                        onConfirm={() => {
                            handleDelete(record, index)
                        }}
                    >
                        <a style={{ color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ] as ColumnProps[];


// 资源详情-负载-Pods列表
export const podsTableSchema = ({
    viewLog,
    shell,
    download,
    handleDelete
}: {
    viewLog: (record: any, index: number) => void;
    shell: (record: any, index: number) => void;
    download: (record: any, index: number) => void;
    handleDelete: (record: any, index: number) => void;
}) =>
    [
        {
            title: '名称',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            width: 230,
            ellipsis: true,
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '状态',
            dataIndex: 'cpu',
            width: 180,
            ellipsis: {
                showTitle: false,
            },
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },

        {
            title: '重启次数',
            dataIndex: 'neicun',
            width: 160,
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: '镜像',
            dataIndex: 'disk',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '节点IP',
            dataIndex: 'createUser',
            width: 200,
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'creatTime',
            width: 200,
        },
        {
            title: '操作',
            fixed: 'right',
            width: 330,
            dataIndex: 'operate',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <Button size="small" type="primary" onClick={() => viewLog(record, index)}>查看日志</Button>
                    <Button size="small" type="primary" onClick={() => shell(record, index)}>登陆shell</Button>
                    <Button size="small" type="primary" onClick={() => download(record, index)}>下载文件</Button>
                    <Popconfirm
                        title="确定要删除该信息吗？"
                        onConfirm={() => {
                            handleDelete(record, index)
                        }}
                    >
                        <Button size="small" type="default" danger style={{ color: 'red' }}>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ] as ColumnProps[];

// 资源详情-负载-事件列表
export const eventTableSchema = () =>
    [
        {
            title: '类型',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: '事件原因',
            dataIndex: 'ip',
            width: 230,
        },
        {
            title: '事件类型',
            dataIndex: 'cpu',
            width: 180,
            ellipsis: {
                showTitle: false,
            },
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '时间',
            dataIndex: 'neicun',
            width: 80,
            ellipsis: {
                showTitle: false,
            },
        },
    ] as any;

// 资源详情-负载-环境变量列表
export const envVarTableSchema = ({ handleDelete }: {
    handleDelete: (record: any, index: number) => void;
}) =>
    [
        {
            title: 'KEY',
            dataIndex: 'key',
            width: 400,
        },
        {
            title: 'VALUE',
            dataIndex: 'value',
            width: 400,
        },
        {
            title: '',
            dataIndex: 'operate',
            align: 'right',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => {
                            handleDelete(record, index)
                        }}
                    >
                        <MinusCircleFilled style={{ color: 'red' }} />
                        {/* <Button size="small" type="default" danger style={{ color: 'red' }}>
                            删除
                    </Button> */}
                    </Popconfirm>
                </div>
            ),
        },
    ] as any;

// 事件告警-集群告警列表
export const warningTableSchema = () =>
    [
        {
            title: '序号',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: '告警类型',
            dataIndex: 'type',
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            width: 180,
            ellipsis: {
                showTitle: false,
            },
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            width: 80,
        },
        {
            title: '持续时间',
            dataIndex: 'type',
            width: 150,
        },
        {
            title: '告警等级',
            dataIndex: 'type',
            width: 80,
        },
        {
            title: '对象',
            dataIndex: 'type',
            width: 150,
        },
        {
            title: '告警信息',
            dataIndex: 'message',
            width: 300,
        },
    ] as any;

export const eventSchema = () =>
    [
        {
            title: '命名空间',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 100,
        },
        {
            title: '事件原因',
            dataIndex: 'startTime',
            width: 180,
            ellipsis: {
                showTitle: false,
            },
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '事件信息',
            dataIndex: 'endTime',
            width: 400,
        },
        {
            title: '最后更新',
            dataIndex: 'type',
            width: 150,
        },
    ] as any;

// 资源详情列表
export const taskTableSchema = ({
    handleDetail,
    edit,
    stop,
    handleDelete
}: {
    handleDetail: (record: any, index: number) => void;
    edit: (record: any, index: number) => void;
    stop: (record: any, index: number) => void;
    handleDelete: (record: any, index: number) => void;
}) =>
    [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50,
        },
        {
            title: '任务名称',
            dataIndex: 'name',
            width: 180,
        },
        {
            title: '任务CODE',
            dataIndex: 'code',
            width: 180,
            ellipsis: {
                showTitle: false,
            },
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },

        {
            title: '任务类型',
            dataIndex: 'type',
            width: 100,
        },
        {
            title: '任务触发',
            dataIndex: 'disk',
            width: 250,
        },
        {
            title: '操作',
            fixed: 'right',
            width: 240,
            dataIndex: 'operate',
            render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                    <a onClick={() => handleDetail(record, index)}>详情</a>
                    <a onClick={() => edit(record, index)}>编辑</a>
                    <a onClick={() => stop(record, index)}>暂停</a>
                    <Popconfirm
                        title="确定要删除该任务吗？"
                        onConfirm={() => {
                            handleDelete(record, index)
                        }}
                    >
                        <a style={{ color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm>
                </div>
            ),
        },
    ] as ColumnProps[];