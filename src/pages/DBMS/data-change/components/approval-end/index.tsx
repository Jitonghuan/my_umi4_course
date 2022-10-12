/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:42
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 01:13:53
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/approval-end/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card,Descriptions,Space ,Tag,Table,Input,Modal,Popconfirm,Form,Spin} from 'antd';
import React,{useMemo,useState,useEffect} from 'react';
import PageContainer from '@/components/page-container';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {createTableColumns} from './schema';
import {history,useLocation} from 'umi';
import './index.less';
import {CurrentStatusStatus,PrivWfType} from '../../../authority-manage/components/authority-apply/schema'
import {useGetSqlInfo,useAuditTicket} from './hook'
const StatusMapping: Record<string, number> = {
  wait:1,
  pass:2,
  reject:2
};
export default function ApprovalEnd(){
  const [info,setInfo]=useState<any>({});
  const [form]=Form.useForm()
  const [loading,setLoading]=useState<boolean>(false);
  const [status,setstatus]=useState<string>("");
  const [owner,setOwner]=useState<any>([]);
  const [auditLoading, auditTicket]= useAuditTicket();
  const [statusText,setStatusText]=useState<string>("");
  let location = useLocation();
  const initInfo: any = location.state || {};
  const { confirm } = Modal;

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
          <Form.Item name="remark"  rules={[{ required: true, message: '请输入' }]}>
            <Input.TextArea></Input.TextArea>

          </Form.Item>
        </Form>
      ),
      onOk () {
        form.validateFields().then((remark)=>{
          auditTicket({remark,auditType,id:initInfo?.record?.id}).then(()=>{
            getInfo()
          })
        })
      
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const getInfo=()=>{
    setLoading(true)
    useGetSqlInfo(initInfo?.record?.id).then((res)=>{
      setInfo(res)
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
  

  
    const columns = useMemo(() => {
       
        return createTableColumns(
            {onDetail: (record: any, index: number) => {
             
              },
             } ) as any;
      }, []);
    return(
    <PageContainer className="approval-end">
       {/* ------------------------------- */}
       <Spin spinning={loading}>
    <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>工单号:</span><span>{info?.id}</span></Space></span>
      <span><Space><span>工单类型:</span><span><Tag color={PrivWfType[info?.privWfType]?.tagColor||"default"}>{info?.title}</Tag></span></Space></span>
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
    column={2}
    >
  <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
  <Descriptions.Item label="实例">{info?.instanceName}</Descriptions.Item>
  <Descriptions.Item label="变更库" span={2}>{info?.dbCode}</Descriptions.Item>
  <Descriptions.Item label="执行方式" span={2}>定时执行</Descriptions.Item>
  <Descriptions.Item label="上线理由" span={2}>{info?.remark}</Descriptions.Item>
  <Descriptions.Item label="变更sql"span={2} contentStyle={{width:'100%',overflow:"scroll",whiteSpace:"nowrap"}}>{info?.sqlContent}</Descriptions.Item>
  <Descriptions.Item label="sql检测结果">影响行数：10000</Descriptions.Item>
  <Descriptions.Item label="sql审核">通过</Descriptions.Item>
  <Descriptions.Item label="风险项">修改列类型 int改为varchar</Descriptions.Item>

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
              <span><Tag color="geekblue">开始执行</Tag></span>
             
          </Space>
     </div>
     <Table columns={columns}/>
  </Card>

 {/* ------------------------------- */}
  <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>工单结束</span></Space></span>
     
      </span>
    
      
    </div>
  {/* ------------------------------- */}
  <div className="ticket-detail-footer">
      <span className="ticket-detail-title-left">
      <span><Space><span>回滚:</span><span><Tag color="geekblue">下载回滚SQL</Tag></span></Space></span>
      <span><Space><span>离线发布:</span><span><Tag color="geekblue">下载离线Sql包</Tag></span></Space></span>
     

      </span>
    
      
    </div>
    </PageContainer>)
}