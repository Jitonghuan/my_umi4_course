import { Space, Tooltip, Popconfirm } from 'antd';
import { parse, stringify } from 'query-string';
import { history, useLocation } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import { QuestionCircleOutlined } from '@ant-design/icons';

const providerTooltip = '生产者在注册中心进行注册，为消费者提供服务';
const consumerTooltip = '消费者在注册中心订阅生产者提供的服务';

// 生产/消费列表
export const tableColumns = ({
    handleDel,
    tabKey,
    envCode,
    clickNamespace,
}: any) => {
    return [
        {
            title: <div><span>{`${tabKey === 'provider' ? '注册' : '订阅'}服务名称`}
                <Tooltip title={tabKey === 'provider' ? providerTooltip : consumerTooltip} placement="top">
                    <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
                </Tooltip>
            </span>
            </div>,
            dataIndex: 'name',
            key: 'name',
            width: '35%',
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
            dataIndex: 'ipCount',
            key: 'ipCount',
            width: '5%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '健康实例数',
            dataIndex: 'healthyInstanceCount',
            key: 'healthyInstanceCount',
            width: '7%',
            ellipsis: true,
            render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            width: '12%',
            render: (_: string, record: any) => (
                <Space>
                    <a onClick={() => {
                        history.push({
                            pathname: '/matrix/config/registry/service-detail',
                            search: stringify({ serviceName: record?.name, groupName: record?.groupName, key: tabKey, envCode, namespaceId: clickNamespace?.namespaceId || '' })
                        })
                    }}>详情</a>
                    {tabKey === 'provider' && <a onClick={() => {
                        history.replace({
                            pathname: '/matrix/config/registry/subscriber',
                            search: stringify({ key: 'subscriber', serviceName: record?.name, groupName: record?.groupName, type: tabKey })
                        })
                    }}>订阅实例</a>}
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