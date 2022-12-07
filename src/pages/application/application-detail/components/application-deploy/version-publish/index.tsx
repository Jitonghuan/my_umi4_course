
import React, { useState, useContext, useEffect,  } from 'react';
import { Descriptions,Spin,Modal} from 'antd';
import RelateDemand from './component/relate-demand';
import SubmitPublish from './component/submit-publish';
import DetailContext from '@/pages/application/application-detail/context';
import { getAppPublishList } from '../service';
import AceEditor from '@/components/ace-editor';
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
    const [infoVisible,setInfoVisible]=useState<boolean>(false)
    const [type,setType]=useState<string>("")
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
                <Descriptions.Item label="变更配置"><a onClick={()=>{
                    setInfoVisible(true)
                    setType('config')
                }}>{Object.keys(infoDetail?.config)?.length ||'--'}</a> </Descriptions.Item>
                <Descriptions.Item label="变更SQL" > <a onClick={()=>{
                    setInfoVisible(true)
                    setType('sql')
                }}>{Object.keys(infoDetail?.sql)?.length ||'--'}</a></Descriptions.Item>
                <Descriptions.Item label="版本TAG"> {infoDetail?.tag||'--'}</Descriptions.Item>
                <Descriptions.Item label="发布人"> {infoDetail?.createUser||'--'}</Descriptions.Item>
                <Descriptions.Item label="发布时间"> 
                {infoDetail?.gmtCreate ? moment(infoDetail?.gmtCreate).format('YYYY-MM-DD HH:mm') : ''}
                </Descriptions.Item>
                {/* <Descriptions.Item label="版本说明"> {infoDetail?.releaseNumber||'--'}</Descriptions.Item> */}
            </Descriptions>
       
                

            </Spin>
           
       <Modal title="变更详情" visible={infoVisible} width={700} >
           <AceEditor readOnly height={500} />

       </Modal>
        </div>
    )
}