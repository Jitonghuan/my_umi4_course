import { history } from 'umi';
import { Tooltip, Popconfirm, Button, Tag } from 'antd';
import { Html5Outlined, CodeOutlined, MinusCircleFilled } from '@ant-design/icons';
import type { ColumnProps } from '@cffe/vc-hulk-table';
import { LIST_STATUS_TYPE } from './load-detail/schema';
import { STATUS_TEXT, STATUS_COLOR } from '@/pages/pedestal/cluster-info/type'

// 节点列表
export const nodeListTableSchema = ({
    clickTag,
    updateNode,
    drain,
    // handleDelete,
    shell
}: {
    clickTag: (record: any, index: number) => void;
    updateNode: (record: any, index: number) => void;
    drain: (record: any, index: number) => void;
    // handleDelete: (record: any, index: number) => void;
    shell: (record: any, index: number) => void;
}) =>
    [
        {
            title: '节点名',
            dataIndex: 'nodeName',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'IP',
            dataIndex: 'nodeIp',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'CPU',
            dataIndex: ['metricInfo', 'cpuInfo', 'percentage'],
            width: 120,
            // fixed: 'left',
            render: (value: any, record: any) => (
                <div>
                    <span style={{ marginLeft: '10px' }}>{value ? `${(value * 100).toFixed(2)}%` : '-'}</span>
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
                    {record?.metricInfo?.memoryInfo?.unit ? `${record?.metricInfo?.memoryInfo?.usage}/${value}` : '-'}
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
                    {record?.metricInfo?.diskInfo?.unit ? `${record?.metricInfo?.diskInfo?.usage}/${value}` : '-'}
                    <span style={{ marginLeft: '10px' }}>{record?.metricInfo?.diskInfo?.unit}</span>
                </div>
            )
        },
        {
            title: '负载(5M)',
            dataIndex: 'load',
            width: 80,
            render: (value: any, record: any) => (
                <div>
                    <span style={{ marginLeft: '10px' }}>{value ? value : '-'}</span>
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 130,
            // fixed: 'left',
            render: (value: any, record: any) => (
                <div>
                    {value && <span style={{ color: `${value && value[0] ? STATUS_COLOR[value[0]] : '#929793'}` }}>{STATUS_TEXT[value[0]] || value[0] || '-'}</span>}
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
                    <Popconfirm
                        title={`确定要设置为${record.unschedulable ? '可调度' : '不可调度'}吗？`}
                        onConfirm={() => {
                            updateNode(record, index)
                        }}
                    >
                        <a >{record.unschedulable ? '可调度' : '不可调度'}</a>
                    </Popconfirm>
                    <Popconfirm
                        title="确定要排空吗？"
                        onConfirm={() => {
                            drain(record, index)
                        }}
                    >
                        <a >排空</a>
                    </Popconfirm>
                    {/* <Popconfirm
                        title="确定要删除该节点吗？"
                        onConfirm={() => {
                            handleDelete(record, index)
                        }}
                    >
                        <a style={{ color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm> */}
                </div>
            ),
        },
    ] as ColumnProps[];


// 资源详情-负载-Pods列表
export const podsTableSchema = ({
    toPodsDetail,
    viewLog,
    shell,
    // download,
    handleDelete
}: {
    toPodsDetail: (record: any, index: number) => void;
    viewLog: (record: any, index: number) => void;
    shell: (record: any, index: number) => void;
    // download: (record: any, index: number) => void;
    handleDelete: (record: any, index: number) => void;
}) =>
    [
        {
            title: '名称',
            dataIndex: 'name',
            width: 150,
            ellipsis: true,
            render: (value, record: any, index: number) => (
                <Tooltip placement="topLeft" title={value}>
                    <a onClick={() => { toPodsDetail(record, index) }}>{value}</a>
                </Tooltip>
            ),
        },
        {
            title: 'IP',
            dataIndex: ['info', 'ip'],
            width: 150,
            ellipsis: true,
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '状态',
            dataIndex: ['info', 'status'],
            width: 100,
            render: (value) => (
                <Tag color={LIST_STATUS_TYPE[value] && LIST_STATUS_TYPE[value].color ? LIST_STATUS_TYPE[value].color : 'green'}>{value}</Tag>
            ),
        },

        {
            title: '重启次数',
            dataIndex: ['info', 'restarts'],
            width: 80,
            ellipsis: true,
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '镜像',
            dataIndex: ['info', 'images'],
            width: 200,
            ellipsis: true,
            render: (value) => (
                <Tooltip placement="topLeft" title={<>{(value || []).map((item: string) => <div>{item}</div>)}</>}>
                    {value?.toString(',')}
                </Tooltip>
            ),
        },
        {
            title: '节点IP',
            dataIndex: ['info', 'nodeIp'],
            width: 200,
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120,
            ellipsis: true,
            render: (value) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
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
                    {/* <Button size="small" type="primary" onClick={() => download(record, index)}>下载文件</Button> */}
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
            dataIndex: ['info', 'type'],
            width: 80,
        },
        {
            title: '事件原因',
            dataIndex: ['info', 'reason'],
            width: 80,
        },
        {
            title: '事件信息',
            dataIndex: ['info', 'message'],
            width: 180,
            ellipsis: true,
            render: (value: any) => (
                <Tooltip placement="topLeft" title={value}>
                    {value}
                </Tooltip>
            ),
        },
        {
            title: '时间',
            dataIndex: ['info', 'lastUpdateTime'],
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
            dataIndex: 'name',
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

// 任务管理列表
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