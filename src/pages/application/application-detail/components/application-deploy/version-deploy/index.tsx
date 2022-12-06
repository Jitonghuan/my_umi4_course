
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, Table, Checkbox, Radio, Upload, Form, Select, Typography, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { contentList, versionList } from './schema';
import RelateDemand from './component/relate-demand';
import SubmitPublish from './component/submit-publish';
import DeploySteps from '@/pages/application/application-detail/components/application-deploy/deploy-content/components/publish-content/steps';
import './index.less';
const mockData = [{ demand: 5, code: "code1" }]
export default function VersionDeploy(props: any) {
    const { pipelineCode, data = [] } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [initData, setInitData] = useState<any>({});
    const [submitVisible, setSubmitVisible] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const columns: any = useMemo(() => {
        return contentList()
    }, [data])
    const verisionColumns = useMemo(() => {
        return versionList({
            demandDetail: (value: string, record: any) => {
                setInitData(record);
                setVisible(true)
            }
        })
    }, [mockData])
    return (
        <div className='version-deploy-page'>
            <RelateDemand visible={visible} onClose={() => { setVisible(false) }} initData={initData} />
            <SubmitPublish visible={submitVisible} onClose={() => { setSubmitVisible(false) }} />
            {/* 发布详情 */}
            <Descriptions
                title="发布详情"
                labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
                contentStyle={{ color: '#000' }}
                column={3}
                bordered
            >
                <Descriptions.Item label="版本号" contentStyle={{ whiteSpace: 'nowrap' }}>
                    {'--'}
                </Descriptions.Item>
                <Descriptions.Item label="变更需求" >{'--'}</Descriptions.Item>
                <Descriptions.Item label="变更配置">{'--'}</Descriptions.Item>
                <Descriptions.Item label="变更SQL" >{'--'}</Descriptions.Item>
                <Descriptions.Item label="版本TAG">{'--'}</Descriptions.Item>
                <Descriptions.Item label="发布时间">{'--'}</Descriptions.Item>
                <Descriptions.Item label="发布人">{'--'}</Descriptions.Item>
                <Descriptions.Item label="版本说吗">{'--'}</Descriptions.Item>
            </Descriptions>
            {/* 发布内容 */}
            <div className='version-publish publish-content-compo'>
                <div className='flex-space-between'>
                    <div className='ant-descriptions-title'>发布内容</div>
                    <Button>取消发布</Button>
                </div>
                <DeploySteps
                    stepData={[]}
                    deployInfo={{}}
                    onOperate={() => { }}
                    isFrontend={false}
                    envTypeCode={''}
                    appData={{}}
                    onCancelDeploy={() => { }}
                    stopSpin={() => { }}
                    notShowCancel={() => { }}
                    showCancel={() => { }}
                    onSpin={() => { }}
                    deployedList={[]}
                    getItemByKey={() => { }}
                    pipelineCode={pipelineCode}
                    envList={[]}
                />
            </div>
            {/* 内容列表 */}
            <div className="table-caption" style={{ marginTop: 16 }}>
                <h4>内容列表</h4>
                <div className="caption-right">

                </div>
            </div>
            <Table
                dataSource={data}
                // loading={loading || updateLoading}
                bordered
                rowKey="id"
                pagination={false}
                columns={columns}
            />
            {/* 版本列表 */}
            <div className='version-list'>
                <div className='flex-space-between'>
                    <div className='ant-descriptions-title'>版本列表</div>
                    <Button type='primary' disabled={!selectedRowKeys.length} onClick={() => { setSubmitVisible(true) }}>提交发布</Button>
                </div>
                <Table
                    dataSource={mockData}
                    // loading={loading || updateLoading}
                    bordered
                    rowKey="id"
                    pagination={false}
                    columns={verisionColumns}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                            setSelectedRowKeys(selectedRowKeys as any);
                        },
                    }}
                />
            </div>
        </div>
    )
}