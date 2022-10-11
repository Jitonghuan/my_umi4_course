// 数据管理-工单详情
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/09/8 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Spin, Select, Steps, Card ,Tag,Descriptions,Space} from 'antd';
import {SendOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons'
import './index.less';
import {useGetPrivInfo} from './hook';
import {CurrentStatusStatus,PrivWfType} from '../authority-apply/schema'


export interface CreateArticleProps {
  mode?: EditorMode;
  curRecord?: any;
  onClose: () => any;
  onSave: () => any;
}
const { Step } = Steps;
export default function CreateArticle(props: CreateArticleProps) {
  const { mode, curRecord, onClose, onSave } = props;
  const [info,setInfo]=useState<any>({});
  const [loading,setLoading]=useState<boolean>(false);
  const [owner,setOwner]=useState<any>([]);
 
  useEffect(() => {
    if (mode === 'HIDE' || !curRecord?.id) return;
    setLoading(true)
    useGetPrivInfo(curRecord?.id).then((res)=>{
      setInfo(res)
      let auditUsers=[];
      if((res?.audit[0])?.AuditStatus==="wait"){
        auditUsers=res?.audit?.AuditStatus?.Groups 
      }
      setOwner(auditUsers)
      
    }).finally(()=>{
      setLoading(false)
    })

   
    return () => {
     
    };
  }, [mode]);
  
  return (
      <Drawer
          width={700}
          title="工单详情"
          placement="right"
          visible={mode !== 'HIDE'}
          onClose={onClose}
          maskClosable={false}
          footer={null}
          className="ticket-detail-drawer"
      >
          <Card style={{ width: "90%" }} >
            <Spin spinning={loading}>
            <Descriptions column={2} size="small" >
                    <Descriptions.Item label="工单号">{info?.id}</Descriptions.Item>
                    
                    <Descriptions.Item label="工单类型"><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>{info?.title}</Tag></Descriptions.Item>
                   
                    <Descriptions.Item  label="工单状态"><Tag color={CurrentStatusStatus[info?.currentStatus]?.tagColor||"default"}>{info?.currentStatusDesc}</Tag> </Descriptions.Item>
                    <Descriptions.Item label=""><Tag color="volcano">撤销工单</Tag></Descriptions.Item>
                    
             </Descriptions>

            </Spin>
             
          </Card>
          <Card style={{ width: "90%",marginTop:16 }} >
          <Spin spinning={loading}>
          <Descriptions column={2} size="small" >
                    <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
                    
                    <Descriptions.Item label="实例"><Tag>{info?.InstanceName}</Tag></Descriptions.Item>
                    <Descriptions.Item label="对象类型"><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>{info?.privWfTypeDesc}</Tag></Descriptions.Item>
                    
                    <Descriptions.Item label="有效期">待写</Descriptions.Item>
                    <Descriptions.Item label="库表对象" span={2}>{info?.tableList?.length>0?info?.tableList?.map((item:string)=>{return(<span style={{padding:2}}>{item},</span>)}):"--"}</Descriptions.Item>
                    
                  
                   
                    <Descriptions.Item span={2} label="授权功能">{info?.privList?.length>1?info?.privList?.map((item:string)=>{return(<span style={{padding:2}}>{item}｜</span>)}):info?.privList?.length===1?info?.privList[0]:'--'}</Descriptions.Item>
                    <Descriptions.Item span={2} label="理由">{info?.remark}</Descriptions.Item>
                    
             </Descriptions>

            </Spin>
             
          </Card>
          <Card size="small" style={{ width: "90%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">{info?.audit?.length>0?(info?.audit)[0]?.AuditStatus:"--"}</span></span>}>
          <Steps direction="vertical" current={1} size="small">
            <Step title="提交" icon={<StarOutlined />} description={`提交时间:${info?.startTime}`} />
           <Step title="库Owner" icon={<DingdingOutlined />} description={`当前审批人:${owner?.length>0?owner?.map((ele:string)=>{return(<span style={{padding:2}}>{ele}</span>)}):"--"}`} />
           
           <Step title="完成" icon={<CheckCircleTwoTone />} description={<Space><Tag color="geekblue" >同意</Tag> <Tag >拒绝</Tag></Space>} />
         </Steps>


          </Card>



      </Drawer>
  );
}
