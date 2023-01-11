import { Card, Space, Tag,  Steps,Spin} from 'antd';
import React, { useCallback } from 'react';
import { CheckCircleTwoTone, StarOutlined, CloseCircleOutlined, LoadingOutlined,MinusCircleOutlined } from '@ant-design/icons';

const { Step } = Steps;

const StatusMappingIcon: Record<string, React.ReactNode> = {
  wait: <LoadingOutlined /> ,//待审批状态
  reject:<CloseCircleOutlined style={{color:"red"}}/>,//审批拒绝状态，结束流程，
  abort:<CloseCircleOutlined style={{color:"red"}}/>,//审批撤销状态，结束流程，
  pass:<CheckCircleTwoTone/>,//通过状态
};
interface Iprops{
    auditInfo:any;
    subTime:string;
    onAgree:()=>void;
    onRefuse:()=>void;
    auditLoading:boolean;
    canAudit:boolean
}
export default function ApprovalCard(props:Iprops){
    const {auditInfo,subTime,onAgree,onRefuse,auditLoading,canAudit} =props;
    const getCurrent =useCallback(()=>{
        if (!auditInfo?.length ) return -1
        let status:any=[]
        auditInfo?.map((item:any)=>{
          if(item?.AuditStatus==="pass"){
           status.push(item)
          }
   
        })
       
        if(status?.length==3){
          return 3
   
        }
        if(status?.length==2){
         return 3
   
       }
       
       return  auditInfo?.findIndex(ele => ele?.AuditStatus==="pass")+2|| -1
   
      },[auditInfo])
   

    return (
        // <Card style={{ width: "100%", marginTop: 12 }} size="small" className="approval-card" title={<span>审批进度</span>}>
        <Steps direction="vertical" current={ getCurrent()|| -1} size="small">
          <Step title="提交" icon={<StarOutlined />} description={`提交时间:${subTime}`} />
          {auditInfo?.map((item:any,index:number)=> <Step 
          title={item?.Name} 
          icon={(auditInfo[index-1]&&auditInfo[index-1]?.AuditStatus!=="pass")?<MinusCircleOutlined />: StatusMappingIcon[item?.AuditStatus]||<LoadingOutlined/>}  
          subTitle={ item?.AuditTime?`审批时间：${item?.AuditTime}`:null}
          description={<p>
           
            <div><span>审批人：</span><span>{item?.Groups?.join(',') || ''}</span></div>
            {item?.AuditRemark?  <div><span>操作原因：</span><span>{item?.AuditRemark}</span></div>:null}
            {item?.AuditUserName?<div><span><b>操作人：</b>{item?.AuditUserName}</span></div>:null} 
           
            {
                getCurrent()-1===index&&  canAudit ?<p> <Spin spinning={auditLoading}>
                      <Space>
                    <Tag color="success" onClick={onAgree}>审批通过</Tag>
                    <Tag color="volcano" onClick={onRefuse}>拒绝</Tag>
                  </Space>
                  </Spin></p> : null} 
            
          </p>} />)}

        </Steps>

        // </Card>
    )
}