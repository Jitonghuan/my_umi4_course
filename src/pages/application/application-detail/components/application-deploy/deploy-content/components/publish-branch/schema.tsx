import { Popconfirm, Button, Modal, Checkbox, Tag, Tooltip, Select, message, Radio } from 'antd';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { datetimeCellRender } from '@/utils';
import { ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { DeployInfoVO } from '@/pages/application/application-detail/types';

export interface PublishBranchProps {
    /** 是否有发布内容 */
    hasPublishContent: boolean;
    deployInfo: DeployInfoVO;
    env: string;
    loading: boolean;
    onSearch: (name?: string) => any;
    masterBranchChange: any;
    // loadData: any;
    dataSource: {
        id: string | number;
        branchName: string;
        desc: string;
        createUser: string;
        gmtCreate: string;
        status: string | number;
    }[];
    pipelineCode: string;
    /** 提交分支事件 */
    onSubmitBranch: (status: 'start' | 'end') => void;
    changeBranchName: any;
    versionData:any;
}

export const branchTableSchema = ({ id, appCode, appData, env }) => {
    return [
        {
            title: '分支名',
            dataIndex: 'branchName',
            fixed: "left",
            width: 320,
            render: (value: string, record: any) =>
                <div>
                    <Link to={`/matrix/application/detail/branch?appCode=${appCode}&id=${id}`}>{value}</Link>
                    <span style={{ marginLeft: 8, color: '#3591ff' }}>
                        <CopyToClipboard text={value} onCopy={() => message.success('复制成功！')}>
                            <CopyOutlined />
                        </CopyToClipboard>
                    </span>
                </div>
        },
        {
            title: '变更原因',
            dataIndex: 'desc',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (value: string, record: any) => <Tooltip placement="topLeft" title={value}>{value}</Tooltip>
        },
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
        },
        {
            title: '分支review状态',
            align: 'center',
            dataIndex: 'status',
            width: 120,
            render: (value: any) => <Tag color={STATUS_TYPE[value]?.color || 'red'}>{STATUS_TYPE[value]?.text || '---'}</Tag>
        },
        env === 'prod' ?
            {
                title: '关联需求状态',
                dataIndex: ['relationStatus', 'statusList'],
                width: 220,
                align: 'center',
                render: (value: string, record: any) => (
                    Array.isArray(value) && value.length ? (
                        value.map((item: any) => (
                            <div className='demand-cell'>
                                <Tooltip title={item.title}><a target="_blank" href={item.url}>{item.title}</a></Tooltip>
                                <Tag color={item.status === '待发布' ? '#87d068' : '#59a6ed'}>{item.status}</Tag>
                            </div>
                        ))
                    ) : null
                )
            } : {},
        {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            ellipsis: {
                showTitle: false,
            },
            width: 140,
            render: (value: string, record: any) => <Tooltip placement="topLeft" title={datetimeCellRender(value)}>{datetimeCellRender(value)}</Tooltip>
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            width: 80,
        },
        appData?.appType === 'frontend' ?
            {
                title: '和master对比',
                width: 110,
                fixed: 'right',
                align: 'center',
                render: (value: any, record: any) => (
                    <a
                        target="_blank"
                        href={`${appData?.gitAddress.replace('.git', '')}/-/compare/master...${value?.branchName}?view=parallel`}
                    >
                        查看
                    </a>
                )
            } : {}
    ]
}


type reviewStatusTypeItem = {
    color: string;
    text: string;
};

export const STATUS_TYPE: Record<number, reviewStatusTypeItem> = {
    1: { text: '未创建', color: 'default' },
    2: { text: '审核中', color: 'blue' },
    3: { text: '已关闭', color: 'orange' },
    4: { text: '未通过', color: 'red' },
    5: { text: '已删除', color: 'gray' },
    6: { text: '已通过', color: 'green' },
};
