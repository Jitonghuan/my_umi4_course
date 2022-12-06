
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions,Spin} from 'antd';
import RelateDemand from './component/relate-demand';
import SubmitPublish from './component/submit-publish';
import DetailContext from '@/pages/application/application-detail/context';
import { getAppPublishList } from '../service';
import moment from 'moment';
import './index.less';
interface Iprops{
    pipelineCode:string;
    envTypeCode:string;
    isActive:boolean;
    visible:boolean;


}
const rootCls = 'version-deploy-page';
export default function VersionDeploy(props: Iprops) {
    const { pipelineCode, envTypeCode,isActive, visible} = props;
    const { appData } = useContext(DetailContext);
    const { appCode } = appData || {};
    const [relateDemandVisible, setRelateDemandVisible] = useState<boolean>(false);
    const [initData, setInitData] = useState<any>({});
    const [submitVisible, setSubmitVisible] = useState<boolean>(false);
    const [infoDetail,setInfoDetail]=useState<any>({})
    const [loading,setLoading]=useState<boolean>(false)
    useEffect(()=>{
        if(!appCode) return;
        queryDataSource(appCode)
    },[appCode])
    const queryDataSource=(appCode:string)=>{
        setLoading(true)
       
        getAppPublishList(appCode).then((res)=>{
            if(res?.success){
                if(res?.data?.length>0){
                    let length=res?.data?.length;
                    let dataSource=res?.data;
                    const i = dataSource.findIndex((item: any,index:number) => index === length-1);
                    if(i!==-1){
                        setInfoDetail(dataSource[i])
                    }else{
                        setInfoDetail({})
                    }



                }
             
            }
    
        }).finally(()=>{
            setLoading(false)
        })
    }
    return (
        <div className='version-publish-page'>
             <RelateDemand visible={relateDemandVisible} onClose={() => { setRelateDemandVisible(false) }} initData={initData} />
            <SubmitPublish visible={submitVisible} onClose={() => { setSubmitVisible(false) }} />
                 
            {/* 发布详情 */}
            <Spin spinning={loading}>
            <Descriptions
                title="发布详情"
                labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' ,width:100}}
                contentStyle={{ color: '#000' }}
                column={3}
                bordered
            >
                <Descriptions.Item label="版本号" contentStyle={{ whiteSpace: 'nowrap' }}>
                    {infoDetail?.releaseNumber||'--'}
                </Descriptions.Item>
                {/* <Descriptions.Item label="变更需求" > {infoDetail?.releaseNumber||'--'}</Descriptions.Item> */}
                <Descriptions.Item label="变更配置"> {infoDetail?.config||'--'}</Descriptions.Item>
                <Descriptions.Item label="变更SQL" > {infoDetail?.sql||'--'}</Descriptions.Item>
                <Descriptions.Item label="版本TAG"> {infoDetail?.tag||'--'}</Descriptions.Item>
                <Descriptions.Item label="发布人"> {infoDetail?.createUser||'--'}</Descriptions.Item>
                <Descriptions.Item label="发布时间"> 
                {infoDetail?.gmtCreate ? moment(infoDetail?.gmtCreate).format('YYYY-MM-DD HH:mm') : ''}
                </Descriptions.Item>
                {/* <Descriptions.Item label="版本说明"> {infoDetail?.releaseNumber||'--'}</Descriptions.Item> */}
            </Descriptions>
       
                

            </Spin>
           
        

         {/* <div className={`${rootCls}-sider`}>
         <VersionDetail envTypeCode={envTypeCode}  />
      </div> */}
      
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