// 数据管理-工单详情
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/09/8 14:50

import React, { useState, useEffect, useRef } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Drawer, Form, Spin, Input, Steps, Card ,Tag,Descriptions,Space,Modal} from 'antd';
import {SendOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons'
import './index.less';
import {useGetPrivInfo,useAuditTicket} from './hook';
import {CurrentStatusStatus,PrivWfType} from '../authority-apply/schema'


export interface CreateArticleProps {
  mode?: EditorMode;
  curRecord?: any;
  queryId?:any;
  onClose: () => any;
  onSave: () => any;
  getList: () => any;
}
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
  wait:1,
  pass:2,
  reject:2
};
export default function CreateArticle(props: CreateArticleProps) {
  const { mode, curRecord, onClose, onSave,getList,queryId } = props;
  const afferentId=Number(queryId)
  const { confirm } = Modal;
  const [form]=Form.useForm()
  const [info,setInfo]=useState<any>({});
  const [loading,setLoading]=useState<boolean>(false);
  const [owner,setOwner]=useState<any>([]);
  const [status,setstatus]=useState<string>("");
  const [auditLoading, auditTicket]= useAuditTicket();
  useEffect(()=>{
    if(afferentId&&mode !== 'HIDE'){
      getInfo(afferentId)

    }

  },[afferentId,mode])
 
  useEffect(() => {
    if (mode === 'HIDE' || !curRecord?.id) return;
    getInfo()
   

   
    return () => {
     
    };
  }, [mode]);
  
 
  const getInfo=(id?:number)=>{
    setLoading(true)
    let paramId=afferentId?afferentId:curRecord?.id
    useGetPrivInfo(curRecord?.id||id).then((res)=>{
      setInfo(res)
      let auditUsers=[];
     
      if(res?.audit?.length>0){
        setstatus(res?.audit[0]?.AuditStatus)
        // if(res?.audit[0]?.AuditStatus==="wait"){
          auditUsers=res?.audit[0]?.Groups 
          setOwner(auditUsers)
         
        // }

      }
      
     
      
    }).finally(()=>{
      setLoading(false)
    })

  }
  const showConfirm = (auditType:string) => {
    confirm({
      title: '请填写理由',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={form}>
          <Form.Item name="reason"  rules={[{ required: true, message: '请输入' }]}>
            <Input.TextArea></Input.TextArea>

          </Form.Item>
        </Form>
      ),
      onOk () {
        form.validateFields().then((info)=>{
          auditTicket({reason:info?.reason,auditType,id:curRecord?.id||afferentId}).then(()=>{
            afferentId?getInfo(afferentId):getInfo()
            getList()
            
          })
        })
      
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
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
                    
                    <Descriptions.Item label="工单类型"><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>暂无</Tag></Descriptions.Item>
                   
                    <Descriptions.Item  label="工单状态"><Tag color={CurrentStatusStatus[info?.currentStatus]?.tagColor||"default"}>{info?.currentStatusDesc}</Tag> </Descriptions.Item>
                    <Descriptions.Item label="">
                      {status==="wait"&&  <Tag color="volcano" onClick={()=>showConfirm("abort")}>撤销工单</Tag>}
                    
                    </Descriptions.Item>
                    
             </Descriptions>

            </Spin>
             
          </Card>
          <Card style={{ width: "90%",marginTop:16 }} >
          <Spin spinning={loading}>
          <Descriptions column={2} size="small" >
                    <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
                    
                    <Descriptions.Item label="实例"><Tag>{info?.InstanceName}</Tag></Descriptions.Item>
                    <Descriptions.Item label="对象类型"><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>{info?.privWfTypeDesc}</Tag></Descriptions.Item>
                    
                    <Descriptions.Item label="有效期">{info?.validEndTime}</Descriptions.Item>
                    <Descriptions.Item label="库表对象" span={2}>{info?.tableList?.length>0?info?.tableList?.map((item:string)=>{return(<span style={{padding:2}}>{item},</span>)}):"--"}</Descriptions.Item>
                    
                  
                   
                    <Descriptions.Item span={2} label="授权功能">{info?.privList?.length>1?info?.privList?.map((item:string)=>{return(<span style={{padding:2}}>{item}｜</span>)}):info?.privList?.length===1?info?.privList[0]:'--'}</Descriptions.Item>
                    <Descriptions.Item span={2} label="理由">{info?.remark}</Descriptions.Item>
                    
             </Descriptions>

            </Spin>
             
          </Card>
          <Card size="small" style={{ width: "90%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">{status==="wait"?"等待审批":status==="pass"?"审批通过":"已拒绝"}</span></span>}>
          <Spin spinning={loading}>
          <Steps direction="vertical" current={StatusMapping[status] || -1} size="small" >
           <Step title="提交" icon={<StarOutlined />} description={`提交时间:${info?.startTime}`} />
           <Step title="库Owner" icon={<DingdingOutlined />} 
           description={`当前审批人:
           ${owner?.join(',') || ''}
         `} />
           
           <Step title="完成" icon={<CheckCircleTwoTone />} description={
             <Spin spinning={auditLoading}>
                <Space>
             {status==="wait"&&(<> <Tag color="geekblue" onClick={()=>{
                auditTicket({auditType:"pass",id:curRecord?.id||afferentId}).then(()=>{
                  afferentId?getInfo(afferentId):  getInfo()
                
                  getList()
                })
             }}>同意</Tag> <Tag color="volcano" onClick={()=>showConfirm("reject")}>拒绝</Tag>  </>)}
            
            </Space>

             </Spin>
          } />
         </Steps>


          </Spin>
        

          </Card>
 


      </Drawer>
  );
}
