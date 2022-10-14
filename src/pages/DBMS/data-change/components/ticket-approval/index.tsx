/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:51
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-14 08:47:20
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/ticket-approval/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Card,Descriptions,Space ,Tag,Modal,Input,Steps,Popconfirm,Form,Spin,Table,DatePicker,Radio} from 'antd';
import React,{useMemo,useState,useEffect} from 'react';
import type { DatePickerProps } from 'antd';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import {ExclamationCircleOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons';
import {history,useLocation} from 'umi';

import {CurrentStatusStatus,PrivWfType} from '../../../authority-manage/components/authority-apply/schema'
import {useGetSqlInfo,useAuditTicket,useRunSql} from './hook';
import { parse } from 'query-string';

import './index.less'
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
  wait:1,
  pass:2,
  reject:2
};
const runModeOptions=[
  {
    label:"立即执行",
    value:"now"
  },
  {
    label:"定时执行",
    value:"timing"
  }
]
export default function TicketApproval(){
  const [info,setInfo]=useState<any>({});
  const [dateString,setDateString]=useState<string>("");
  const [form]=Form.useForm()
  const [runSqlform]=Form.useForm()
  const [loading,setLoading]=useState<boolean>(false);
  const [status,setstatus]=useState<string>("");
  const [statusText,setStatusText]=useState<string>("");
  const [owner,setOwner]=useState<any>([]);
  const [reviewContentData,setReviewContentData]=useState<any>([])
  const [auditLoading, auditTicket]= useAuditTicket();
  const [runLoading, runSql]= useRunSql();
  let location = useLocation();
  const initInfo: any = location.state || {};
  const { confirm } = Modal;

  const query = parse(location.search);
  const afferentId=Number(query?.id)

  useEffect(()=>{
    if(query?.detail==="true"&&query?.id){
     
      getInfo(afferentId)
    }
    return()=>{
     
    }

  },[afferentId])
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setDateString(dateString)
  };
  const showRunSqlConfirm = () => {
    confirm({
      title: '请选择执行方式',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={runSqlform}>
          <Form.Item name="runMode" label="执行方式"  rules={[{ required: true, message: '请输入' }]}>
          <Radio.Group options={runModeOptions} />

          </Form.Item >
          <Form.Item label="执行时间" name="runTime" rules={[{ required: true, message: '请选择' }]}>
          <DatePicker onChange={onChange} />
          </Form.Item>
        </Form>
      ),
      onOk () {
        form.validateFields().then((info)=>{
          
          runSql({runMode:info?.runMode,runDate:dateString,id:initInfo?.record?.id||afferentId}).then(()=>{
            afferentId?getInfo(afferentId):getInfo()
          })
        })
      
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

 
  
  useEffect(()=>{
    if(!initInfo?.record?.id) return

    getInfo()
  },[])

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
          auditTicket({reason:info?.reason,auditType,id:initInfo?.record?.id||afferentId}).then(()=>{
            afferentId?getInfo(afferentId):getInfo()
            history.back()
          })
        })
      
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const getInfo=(id?:number)=>{
    setLoading(true)
    useGetSqlInfo(initInfo?.record?.id||id).then((res)=>{
      setInfo(res)
      let reviewContent=[]
      try {
        reviewContent=JSON.parse(res?.reviewContent||"{}")
      } catch (error) {
        
      }
      
setReviewContentData(reviewContent)
      let auditUsers=[];
     
      if(res?.audit?.length>0){
        setstatus(res?.audit[0]?.AuditStatus)
        setStatusText(res?.audit[0]?.AuditStatusDesc)
        // if(res?.audit[0]?.AuditStatus==="wait"){
          auditUsers=res?.audit[0]?.Groups 
          setOwner(auditUsers)
        
        
        // }

      }
      
     
      
    }).finally(()=>{
      setLoading(false)
    })

  }
  
   
    return(<PageContainer className="ticket-approval-detail">
      <ContentCard>
     {/* ------------------------------- */}
     <Spin spinning={loading}>
     <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>工单号:</span><span>{info?.id}</span></Space></span>
      <span><Space><span>工单类型:</span><span><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>暂无</Tag></span></Space></span>
      <span><Space><span>工单状态:</span><span><Tag color={CurrentStatusStatus[info?.currentStatus]?.tagColor||"default"}>{info?.currentStatusDesc}</Tag> </span></Space></span>

      </span>
      <span className="ticket-detail-title-right">
       <Space>
        {status==="wait"&&    <Popconfirm  title="确认撤销该工单吗?"
            onConfirm={() => {
              showConfirm("abort")
             
            }}>
         <Tag color="orange" >撤销工单</Tag>
         </Popconfirm>}

       {/* <Tag color="geekblue">复制工单</Tag> */}
     
         <Tag className="back-go" onClick={()=>{
          
           history.push({
            pathname:"/matrix/DBMS/data-change",
            
          })
         }}>
           返回

         </Tag>
         
       </Space>
      </span>
      
    </div>
      </Spin>
  
     {/* ------------------------------- */}
     <Spin spinning={loading}>
     <Descriptions 
    bordered 
    style={{marginBottom:12}}
    size="small"
    labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap',width: 100 }}
    contentStyle={{ color: '#000' }}
    column={2}
    >
  <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
  <Descriptions.Item label="实例">{info?.instanceName}</Descriptions.Item>
  <Descriptions.Item label="变更库" span={2}>{info?.dbCode}</Descriptions.Item>
  {/* <Descriptions.Item label="执行方式" span={2}>定时执行</Descriptions.Item> */}
  <Descriptions.Item label="上线理由" span={2}>{info?.remark}</Descriptions.Item>
  <Descriptions.Item label="变更sql"span={2}>{info?.sqlContent}</Descriptions.Item>
  {/* <Descriptions.Item label="sql检测结果">{}</Descriptions.Item> */}
  {/* <Descriptions.Item label="sql审核">{}</Descriptions.Item> */}
  {/* <Descriptions.Item label="风险项">{}</Descriptions.Item> */}

  </Descriptions>
    </Spin>
   
    {/* ------------------------------- */}
  <Card style={{ width: "100%" ,marginTop:12 }} size="small" title={<span>审批进度：<span className="processing-title">{statusText}</span></span>}>
  <Spin spinning={auditLoading}>
          <Steps direction="vertical" current={StatusMapping[status] || -1} size="small">
            <Step title="提交" icon={<StarOutlined />} description={`提交时间:${info?.startTime}`} />
           <Step title="库Owner" icon={<DingdingOutlined />} description={`当前审批人:
           ${owner?.join(',') || ''}`} />
           <Step title="完成" icon={<CheckCircleTwoTone />} 
           description={
           <Space>
               {status==="wait"&&( <Tag color="success" onClick={()=>{
                auditTicket({auditType:"pass",id:initInfo?.record?.id||afferentId}).then(()=>{
                  afferentId?getInfo(afferentId):getInfo()
                  history.back()
                })
             }}>审批通过</Tag> 
             
             )}
           {status==="wait"&&(  <Tag color="volcano" onClick={()=>showConfirm("reject")}>拒绝</Tag> )}
            </Space>} />
         </Steps>

       </Spin>
          </Card>
          <div  style={{marginTop:12 }} >
         
          <Table   scroll={{ x: '100%' }} dataSource={reviewContentData} loading={loading} >
          {reviewContentData?.length>0&&(
            Object.keys(reviewContentData[0])?.map((item:any)=>{
              return(
                <Table.Column title={item}  ellipsis={{
                  showTitle: true,
                }} dataIndex={item}   key={item}  />
              )
            })

          )}
        </Table>

          </div>
         
        </ContentCard>
    </PageContainer>)
}