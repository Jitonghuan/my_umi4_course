import { Popconfirm } from 'antd';
export const contentList = () => {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 160,
        },
        {
            title: '类型',
            dataIndex: 'title',
            width: 100,
        },
        {
            title: '标题',
            dataIndex: 'feature',
            width: 280,
        },
        {
            title: '关联分支',
            dataIndex: 'feature',
            width: 240,
        },
    ]
}

export const versionList = ({ demandDetail }) => {
    return [
        {
            title: '版本号',
            dataIndex: 'id',
            width: 160,
        },
        {
            title: '关联需求',
            dataIndex: 'demand',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { demandDetail(value, record) }}>{value}</a>
        },
        {
            title: '版本负责人',
            dataIndex: 'feature',
            width: 120,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150,
        },
        {
            title: '计划发布时间',
            dataIndex: 'publishTime',
            width: 180,
        },
        {
            title: '版本简述',
            dataIndex: 'mark',
            width: 240,
        },
    ]
}

export const relateDemandColumn = () => {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 160,
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 100,
        },
        {
            title: '标题',
            dataIndex: 'content',
        },
    ]
}