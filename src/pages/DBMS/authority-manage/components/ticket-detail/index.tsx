// 数据管理-工单详情
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/09/8 14:50

import React, { useState, useEffect, useMemo } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Drawer, Form, Spin, Input, Steps, Card ,Tag,Descriptions,Space,Modal,Table,Empty} from 'antd';
import {CloseCircleOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined,LoadingOutlined} from '@ant-design/icons'
import './index.less';
import { getRequest, postRequest, } from '@/utils/request';
import { history } from 'umi';
import {createTableColumns} from './schema';
import {useGetPrivInfo,useAuditTicket} from './hook';
import {useworkflowLog} from '../../../data-change/components/approval-end/hook'
import {CurrentStatusStatus,PrivWfType} from '../authority-apply/schema';
import {getPrivInfoApi} from  '../../../service'


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
  reject:2,
  abort:2
};
export default function CreateArticle(props: CreateArticleProps) {
  const { mode, curRecord, onClose, onSave,getList,queryId } = props;
  const afferentId=Number(queryId)
  const [tableLoading,logData, getWorkflowLog]=useworkflowLog()
  const { confirm } = Modal;
  const [form]=Form.useForm()
  const [info,setInfo]=useState<any>({});
  const [loading,setLoading]=useState<boolean>(false);
 
  const [owner,setOwner]=useState<any>([]);
  const [status,setstatus]=useState<string>("");
  const [auditLoading, auditTicket]= useAuditTicket();
  const [auditStatusDesc,setAuditStatusDesc]=useState<string>("")
  const [privWfType,setPrivWfType]=useState<any>([]);
  const [idActive,setIdActive]=useState<boolean>(true)
  let userInfo: any = localStorage.getItem('USER_INFO');
  
  let userName=""
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    userName= userInfo ? userInfo.name : ''
  }
 

 
  useEffect(() => {
   // debugger
    if ( !curRecord?.id&&!afferentId) return;
    if(mode!=="HIDE"){
      if(curRecord?.id){
        getInfo()
        getWorkflowLog(curRecord?.id)
  
      }else if(afferentId&&!curRecord?.id){
        getInfo(afferentId)
        getWorkflowLog(afferentId)
      }

    }
    return () => {
      setIdActive(true)
    };
  }, [mode,afferentId]);
  
  const columns = useMemo(() => {
       
    return createTableColumns() as any;
  }, []);

  const getInfo=(id?:number)=>{
    setLoading(true)
   
    let paramId=afferentId?afferentId:curRecord?.id
    getRequest(getPrivInfoApi,{data:{id:curRecord?.id||id}}).then((res: any) => {
      if (res?.success){
        setInfo(res?.data)
        let auditUsers=[];
        let privList:any=[]
        res?.data?.privList?.map((item:any)=>{
          if(item==="query"){
            privList.push("查询")
  
          }
          if(item==="exec"){
            privList.push("变更")
          }
          if(item==="owner"){
            privList.push("owner")
          }
  
        })
        setPrivWfType(privList)
        if(res?.data?.audit?.length>0){
          setstatus(res?.data?.audit[0]?.AuditStatus)
          // if(res?.audit[0]?.AuditStatus==="wait"){
            auditUsers=res?.data?.audit[0]?.Groups||[] 
            setOwner(auditUsers)
           
            setAuditStatusDesc(res?.data?.audit[0]?.AuditStatusDesc)
           
          // }
  
        }
        
       
        setIdActive(true)
      }else{
        setIdActive(false)
        setInfo({})
        
       
        setTimeout(() => {
          onClose();
        }, 3000);  
        history.replace("/matrix/DBMS/authority-manage/authority-apply")  
      }
    }).finally(()=>{
        setLoading(false)
      })
    

  }
  const showConfirm = (auditType:string) => {
    form.resetFields()
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
      onOk (close) {
        form.validateFields().then((info)=>{
          auditTicket({reason:info?.reason,auditType,id:curRecord?.id||afferentId}).then(()=>{
            afferentId?getInfo(afferentId):getInfo()
            getList()
            close()
            
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
       {/* {!idActive&& <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} */}
    <>
        <Card style={{ width: "90%" }} >
            <Spin spinning={loading}>
            <Descriptions column={2} size="small" >
            
                    <Descriptions.Item label="工单号">{info?.id}</Descriptions.Item>
                    <Descriptions.Item label="申请人" >{info?.userName}</Descriptions.Item>
                    <Descriptions.Item label="标题" span={2}><span style={{width:320,overflow:"auto",textOverflow:"ellipsis"}}>{info?.title}</span></Descriptions.Item>
                    <Descriptions.Item  label="工单状态"><Tag color={CurrentStatusStatus[info?.currentStatus]?.tagColor||"default"}>{info?.currentStatusDesc}</Tag> </Descriptions.Item>
                    <Descriptions.Item label="">
                      {status==="wait"&&info?.userName===userName&&  <Tag color="volcano" onClick={()=>showConfirm("abort")}>撤销工单</Tag>}
                    
                    </Descriptions.Item>
                    
             </Descriptions>

            </Spin>
             
          </Card>
          <Card style={{ width: "90%",marginTop:16 }} >
          <Spin spinning={loading}>
          <Descriptions column={2} size="small" >
                    <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
                    
                    <Descriptions.Item label="实例"><Tag>{info?.instanceName}</Tag></Descriptions.Item>
                    <Descriptions.Item label="对象类型"><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>{info?.privWfTypeDesc}</Tag></Descriptions.Item>
                    
                    <Descriptions.Item label="有效期">{info?.validEndTime}</Descriptions.Item>
                    <Descriptions.Item label="库对象" span={2}>
                     <div > {info?.dbList?.length>0?
                    info?.dbList?.join(',') :"--"}</div>
                    </Descriptions.Item>
                    <Descriptions.Item label="表对象" span={2}>
                      <div>
                      {info?.tableList?.length>0?info?.tableList?.join(','):"--"}
                      </div>
                    </Descriptions.Item>
                   {info?.privWfType==="limit"&& <Descriptions.Item span={2} label="授权行数">{info?.limitNum||"--"}</Descriptions.Item>}
                    <Descriptions.Item span={2} label="授权功能">
                      {info?.privList?.length>0?
                      privWfType?.join('|'):'--'}
                      </Descriptions.Item>
                    <Descriptions.Item span={2} label="理由">{info?.remark}</Descriptions.Item>
                    
             </Descriptions>

            </Spin>
             
          </Card>
          <Card size="small" style={{ width: "90%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">{auditStatusDesc}</span></span>}>
          <Spin spinning={loading}>
          <Steps direction="vertical" current={StatusMapping[status] || -1} size="small" >
           <Step title="提交" icon={<StarOutlined />} description={`提交时间:${info?.startTime}`} />
           <Step title="库Owner" icon={<DingdingOutlined />} 
           description={`审批人:
           ${owner?.join(',') || ''}
         `} />
           {/* LoadingOutlined */}
           <Step title={info?.currentStatusDesc} icon={info?.currentStatus==="abort"?<CloseCircleOutlined style={{color:"red"}} />:
              info?.currentStatus==="autoReviewWrong"?<CloseCircleOutlined style={{color:"red"}}/>:
              info?.currentStatus==="exception"?<CloseCircleOutlined style={{color:"red"}} />:  info?.currentStatus==="reject"?<CloseCircleOutlined style={{color:"red"}} />:
              status==="wait"?<LoadingOutlined style={{color:"#2db7f5"}} />:
              <CheckCircleTwoTone />} 
              description={
             <Spin spinning={auditLoading}>
             {status==="wait"&&owner?.join(',')?.includes(userName)?(
                <Space> 
                <Tag color="geekblue" onClick={()=>{
                auditTicket({auditType:"pass",id:curRecord?.id||afferentId}).then(()=>{
                  afferentId?getInfo(afferentId):  getInfo()
                
                  getList()
                })
             }}>同意</Tag> 
             <Tag color="volcano" onClick={()=>showConfirm("reject")}>拒绝</Tag>   
             </Space>):null}
            
          

             </Spin>
          } />
         </Steps>


          </Spin>
        

          </Card>
          <div>
          <div className="ticket-detail-title" style={{marginTop:14,paddingBottom:8}}><b>操作日志</b></div>
          <Table columns={columns} bordered dataSource={logData} loading={tableLoading}/>
          </div>
 
     
</>
      </Drawer>
  );
}
