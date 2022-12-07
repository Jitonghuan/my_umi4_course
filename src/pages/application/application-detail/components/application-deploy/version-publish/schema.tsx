import { Popconfirm } from 'antd';
import { dateCellRender } from '@/utils';
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

export const versionList = (params:{ 
    demandDetail:(value: string, record: any)=>void;
}) => {
    return [
        {
            title: '版本号',
            dataIndex: 'releaseNumber',
            width: 160,
            render: (value: string) => <a>{value}</a>
        },
        {
            title: '关联需求',
            dataIndex: 'demand',
            width: 100,
            render: (value: string, record: any) => <a onClick={() => { params?.demandDetail(value, record) }}>{record?.relationDemands?.length||0}</a>
        },
        {
            title: '版本负责人',
            dataIndex: 'owner',
            width: 120,
        },
        // {
        //     title: '创建时间',
        //     dataIndex: 'gmtCreate',
        //     width: 150,
        // },
        {
            title: '计划发布时间',
            dataIndex: 'planTime',
            width: 180,
            render: (value: any, record: any) => {
                return dateCellRender(value);
              },
        },
        {
            title: '版本简述',
            dataIndex: 'sketch',
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