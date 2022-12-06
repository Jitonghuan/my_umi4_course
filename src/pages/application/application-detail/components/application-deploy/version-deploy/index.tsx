
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, Table, Checkbox, Radio, Upload, Form, Select, Typography, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { contentList, versionList } from './schema';
import RelateDemand from './component/relate-demand';
import SubmitPublish from './component/submit-publish';
import DeploySteps from '@/pages/application/application-detail/components/application-deploy/deploy-content/components/publish-content/steps';
import {getAppPublishList} from '../service'
import VersionDetail from './component/version-detail'
import './index.less';
interface Iprops{
    pipelineCode:string;
    envTypeCode:string;
    isActive:boolean;
    visible:boolean;
    appData:any;


}
const rootCls = 'version-deploy-page';
export default function VersionDeploy(props: Iprops) {
    const { pipelineCode, envTypeCode,isActive, visible,appData} = props;
    const [relateDemandVisible, setRelateDemandVisible] = useState<boolean>(false);
    const [initData, setInitData] = useState<any>({});
    const [submitVisible, setSubmitVisible] = useState<boolean>(false);
    const getTableData=()=>{
        //getAppPublishList()
    }
    const columns: any = useMemo(() => {
        return contentList()
    }, [])
    const verisionColumns = useMemo(() => {
        return versionList({
            demandDetail: (value: string, record: any) => {
                setInitData(record);
                setRelateDemandVisible(true)
            }
        })
    }, [])
    return (
        <div className='version-deploy-page'>
             <RelateDemand visible={relateDemandVisible} onClose={() => { setRelateDemandVisible(false) }} initData={initData} />
            <SubmitPublish visible={submitVisible} onClose={() => { setSubmitVisible(false) }} />
        <div className={`${rootCls}-body`}>
                 
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
                <Descriptions.Item label="版本说明">{'--'}</Descriptions.Item>
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
                dataSource={[]}
                // loading={loading || updateLoading}
                bordered
                rowKey="id"
                pagination={false}
                columns={columns}
            />

                  </div>
      

         <div className={`${rootCls}-sider`}>
         <VersionDetail envTypeCode={envTypeCode}  />
      </div>
      
            {/* 版本列表 */}
            {/* <div className='version-list'>
                <div className='flex-space-between'>
                    <div className='ant-descriptions-title'>版本列表</div>
                    
                </div>
                <Table
                    dataSource={[]}
                    // loading={loading || updateLoading}
                    bordered
                    rowKey="id"
                    pagination={false}
                    columns={verisionColumns}
                   
                />
            </div> */}
        </div>
    )
}