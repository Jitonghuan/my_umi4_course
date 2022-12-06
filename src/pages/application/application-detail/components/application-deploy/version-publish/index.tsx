
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions,} from 'antd';
import RelateDemand from './component/relate-demand';
import SubmitPublish from './component/submit-publish';
import DetailContext from '@/pages/application/application-detail/context';
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
    return (
        <div className='version-publish-page'>
             <RelateDemand visible={relateDemandVisible} onClose={() => { setRelateDemandVisible(false) }} initData={initData} />
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
                <Descriptions.Item label="版本说明">{'--'}</Descriptions.Item>
            </Descriptions>
       
        

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