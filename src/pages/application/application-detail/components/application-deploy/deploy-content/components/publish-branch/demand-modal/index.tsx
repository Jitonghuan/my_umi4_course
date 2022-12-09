import React from 'react';
import { Modal, Table, Tag, } from 'antd';
import './index.less'
interface Iprops {
    curRecord: any;
    visible: boolean;
    onClose: () => void;
    appCategoryLabel: string;
    appCategoryValue: string
}
export default function DemandModal(props: Iprops) {
    const { curRecord, visible, onClose, appCategoryLabel, appCategoryValue } = props
    const modalColumns = [
        {
            title: 'ID',
            dataIndex: 'entryCode',
            width: 160,
            render: (value: string, record: any) => <a href={record?.url} target="_blank">{value}</a>

        },
        {
            title: '类型',
            dataIndex: 'relatedPlat',
            width: 120,
            render: (value: string) => <span><Tag color={value === 'demandPlat' ? 'green' : 'blue'}>{value === 'demandPlat' ? '需求' : 'bug'}</Tag></span>


        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '关联分支',
            dataIndex: 'feature',
            width: 220,
            render: (value: string, record: any) => <span>
                {record?.branchInfos?.map((ele: any) => {
                    return <p>{ele?.branchName}</p>

                })}

            </span>
        },

    ]
    return (
        <Modal width={900} title={
            <div style={{ position: 'relative' }}>
                当前版本：{curRecord?.releaseNumber || '--'}
                <span style={{ right: '40px', position: "absolute" }}>
                    <span className='group-code'>{appCategoryValue || '---'}</span>
                    <span className='group-label'>{appCategoryLabel || '---'}</span>
                </span>
            </div>
        }
            visible={visible}
            onCancel={onClose}
            footer={false}
        >
            <Table
                dataSource={curRecord?.relationDemands || []}
                // loading={loading || updateLoading}
                bordered
                rowKey="id"
                pagination={false}
                columns={modalColumns}
            ></Table>
        </Modal>
    )
}