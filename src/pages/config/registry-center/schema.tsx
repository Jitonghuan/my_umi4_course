import { Space, Tooltip, Popconfirm } from 'antd';
import { parse, stringify } from 'query-string';
import { history, useLocation } from 'umi';
import type { ColumnsType } from 'antd/lib/table';

// 生产/消费列表
export const tableColumns = ({
    handleDel,
    tabKey,
    envCode,
    clickNamespace,
}: any) => {
    return [
        {
            title: '服务名称',
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
                    <a onClick={() => {
                        history.replace({
                            pathname: '/matrix/config/registry/subscriber',
                            search: stringify({ key: 'subscriber', serviceName: record?.name, groupName: record?.groupName, type: tabKey })
                        })
                    }}>订阅实例</a>
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