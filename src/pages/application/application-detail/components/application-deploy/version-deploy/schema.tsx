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