/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:42
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-14 08:43:52
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/approval-end/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card,Descriptions,Space ,Tag,Table,Input,Modal,Popconfirm,Form,Spin,Radio,DatePicker} from 'antd';
import React,{useMemo,useState,useEffect,useCallback} from 'react';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';

import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {createTableColumns} from './schema';
import {history,useLocation} from 'umi';
import './index.less';
import { parse } from 'query-string';
import {CurrentStatusStatus,PrivWfType} from '../../../authority-manage/components/authority-apply/schema'
import {useGetSqlInfo,useAuditTicket,useRunSql} from './hook'
const StatusMapping: Record<string, number> = {
  wait:1,
  pass:2,
  reject:2
};
const runModeOptions=[
  {
    label:"立即执行",
    value:1
  },
  {
    label:"定时执行",
    value:2
  }
]
export default function ApprovalEnd(){
  const [info,setInfo]=useState<any>({});
  const [form]=Form.useForm()
  const [runSqlform]=Form.useForm()
  const [loading,setLoading]=useState<boolean>(false);
  const [status,setstatus]=useState<string>("");
  const [runMode,setRunMode]=useState<number>(1)
  const [owner,setOwner]=useState<any>([]);
  const [auditLoading, auditTicket]= useAuditTicket();
  //useRunSql
  const [runLoading, runSql]= useRunSql();
  const [statusText,setStatusText]=useState<string>("");
  const [executeResultData,setExecuteResultData]=useState<any>([])
  const [reviewContentData,setReviewContentData]=useState<any>([])
  const [dateString,setDateString]=useState<string>("");
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const afferentId=Number(query?.id)
  
  const { confirm } = Modal;
  useEffect(()=>{
    if(query?.detail==="true"&&query?.id){
     
      getInfo(afferentId)
    }
    return()=>{
     
    }

  },[afferentId])

  useEffect(()=>{
    if(!initInfo?.record?.id) return

    getInfo()
  },[])
  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    setDateString(dateString)
  };
  
  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
   
  };
  
  const showRunSqlConfirm =() => {
    runSqlform.resetFields()
    confirm({
      title: '请选择执行方式',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={runSqlform}>
          <Form.Item name="runMode" label="执行方式"  rules={[{ required: true, message: '请输入' }]}>
          <Radio.Group options={runModeOptions} onChange={(e)=>setRunMode(e.target.value)} />

          </Form.Item >
          {runMode===2? <Form.Item label="执行时间" name="runTime" rules={[{ required: true, message: '请选择' }]}>
          <DatePicker showTime onChange={onChange} format="YYYY-MM-DD HH:mm:ss" onOk={onOk} />
          </Form.Item>:
           <Form.Item label="执行时间" name="runTime" >
           <DatePicker showTime onChange={onChange} format="YYYY-MM-DD HH:mm:ss" onOk={onOk} />
           </Form.Item>
          }
        
        
        </Form>
      ),
      onOk () {
        runSqlform.validateFields().then((info)=>{
         
          runSql({runMode:info?.runMode,runDate:info?.runTime.format('YYYY-MM-DD HH:mm'),id:initInfo?.record?.id||afferentId}).then(()=>{
            afferentId?getInfo(afferentId):getInfo()
          })
        })
      
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

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
      let auditUsers=[];

    const executeResult=JSON.parse(res?.executeResult||"{}")
    //reviewContent
    const reviewContent=JSON.parse(res?.reviewContent||"{}")
    setReviewContentData(reviewContent)
    setExecuteResultData(executeResult)
     
      if(res?.audit?.length>0){
        setstatus(res?.audit[0]?.AuditStatus)
        setStatusText(res?.audit[0]?.AuditStatusDesc)
        // if(res?.audit[0]?.AuditStatus==="wait"){
          auditUsers=res?.audit[0]?.Groups 
          setOwner(auditUsers)

        
        // }

      }else{
        setstatus("")
        setStatusText("")
        // if(res?.audit[0]?.AuditStatus==="wait"){
          auditUsers=res?.audit[0]?.Groups 
          setOwner([])


      }
      
     
      
    }).finally(()=>{
      setLoading(false)
    })

  }
 

  
    const columns = useMemo(() => {
       
        return createTableColumns(
            {onDetail: (record: any, index: number) => {
             
              },
             } ) as any;
      }, []);
    return(
    <PageContainer className="approval-end">
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
    column={3}
    >
  <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
  <Descriptions.Item label="实例">{info?.instanceName}</Descriptions.Item>
  <Descriptions.Item label="变更库">{info?.dbCode}</Descriptions.Item>
  {/* <Descriptions.Item label="执行方式" span={2}>定时执行</Descriptions.Item> */}
  <Descriptions.Item label="上线理由" span={3}>{info?.remark}</Descriptions.Item>
  <Descriptions.Item label="变更sql"span={3} ><span style={{maxWidth:'57vw', display:'inline-block',overflow:"scroll",whiteSpace:"nowrap"}}>{info?.sqlContent}</span></Descriptions.Item>
  {/* <Descriptions.Item label="sql检测结果"><span style={{maxWidth:'57vw', display:'inline-block',overflow:"scroll",whiteSpace:"nowrap"}}>{info?.reviewContent}</span></Descriptions.Item> */}
  {/* <Descriptions.Item label="sql审核">通过</Descriptions.Item> */}
  {/* <Descriptions.Item label="风险项">修改列类型 int改为varchar</Descriptions.Item> */}
  <Descriptions.Item label="sql可执行时间范围" span={3}>{info?.runStartTime}--{info?.runEndTime}</Descriptions.Item>

  </Descriptions>
  </Spin>
    {/* ------------------------------- */}
  <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>审批进度:</span><Tag >{statusText}</Tag></Space></span>
     
      </span>
    
      
    </div>
   {/* ------------------------------- */}
  <Card bordered style={{marginBottom:12}}>
      <div style={{marginBottom:10}}>
          <Space>
              <span><b>执行详情</b></span>&nbsp;&nbsp;
              {info?.currentStatus==="reviewPass"&&<span>
                <Spin spinning={runLoading}>
                  <Space>
                  <Tag color="geekblue" onClick={showRunSqlConfirm}>开始执行</Tag>
                

                  </Space>
                  
                </Spin></span>} 
             
          </Space>
     </div>
     {executeResultData?.length>0?
      <Table   scroll={{ x: '100%' }} dataSource={executeResultData} loading={loading} >
      {executeResultData?.length>0&&(
        Object.keys(executeResultData[0])?.map((item:any)=>{
          return(
            <Table.Column title={item} dataIndex={item}    ellipsis={{
              showTitle: true,
            }}  key={item}  />
          )
        })

      )}
    </Table>: <Table   scroll={{ x: '100%' }} dataSource={reviewContentData} loading={loading} >
          {reviewContentData?.length>0&&(
            Object.keys(reviewContentData[0])?.map((item:any)=>{
              return(
                <Table.Column title={item} dataIndex={item}  ellipsis={{
                  showTitle: true,
                }}  key={item}  />
              )
            })

          )}
        </Table>
     }
    
  </Card>

 {/* ------------------------------- */}
  <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>工单结束</span></Space></span>
     
      </span>
    
      
    </div>
  {/* ------------------------------- */}
  {/* <div className="ticket-detail-footer">
      <span className="ticket-detail-title-left">
      <span><Space><span>回滚:</span><span><Tag color="geekblue">下载回滚SQL</Tag></span></Space></span>
      <span><Space><span>离线发布:</span><span><Tag color="geekblue">下载离线Sql包</Tag></span></Space></span>
     

      </span>
    
      
    </div> */}
    </ContentCard>
    </PageContainer>)
}