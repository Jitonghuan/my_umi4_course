/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:42
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-14 12:13:45
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/approval-end/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card, Descriptions, Space, Tag, Table, Input, Modal, Popconfirm,Button, Form, Spin, Radio, DatePicker, Steps, Tooltip } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import PageContainer from '@/components/page-container';
import { ExclamationCircleOutlined, DingdingOutlined, CheckCircleTwoTone, StarOutlined,CloseCircleOutlined ,LoadingOutlined} from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { createTableColumns } from './schema';
import { history, useLocation } from 'umi';
import moment from 'moment';
import { parse } from 'query-string';
import { CurrentStatusStatus, PrivWfType } from '../../../authority-manage/components/authority-apply/schema'
import { useGetSqlInfo, useAuditTicket, useRunSql, useworkflowLog } from './hook'
import './index.less';

const runModeOptions = [
  {
    label: "立即执行",
    value: "now"
  },
  {
    label: "定时执行",
    value: "timing"
  }
]
const runModeOnlyOptions = [
  {
    label: "立即执行",
    value: "now"
  },
 
]
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
  wait: 1,
  pass: 2,
  reject: 2,
  abort:2
};

export default function ApprovalEnd() {
  const [info, setInfo] = useState<any>({});
  const [tableLoading, logData, getWorkflowLog] = useworkflowLog()
  const [form] = Form.useForm()
  const [runSqlform] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setstatus] = useState<string>("");
  const [runMode, setRunMode] = useState<string>("now")
  const [owner, setOwner] = useState<any>([]);
  const [auditLoading, auditTicket] = useAuditTicket();
  //useRunSql
  const [runLoading, runSql] = useRunSql();
  const [statusText, setStatusText] = useState<string>("");
  const [executeResultData, setExecuteResultData] = useState<any>([])
  const [reviewContentData, setReviewContentData] = useState<any>([])
  const [dateString, setDateString] = useState<string>("");
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const afferentId = Number(query?.id)
  let userInfo: any = localStorage.getItem('USER_INFO');
  let userName=""
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    userName= userInfo ? userInfo.name : ''
  }
  const [visible, setVisible] = useState<boolean>(false)

  const { confirm } = Modal;
  useEffect(() => {
    if (query?.detail === "true" && query?.id) {
      getInfo(afferentId)
      getWorkflowLog(afferentId)
    }
    return()=>{
      // history.push(location.pathname)
    }
  }, [afferentId])
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (query?.detail === "true" && query?.id) {
        getInfo(afferentId)
        getWorkflowLog(afferentId)
      }else{
        getInfo()
        getWorkflowLog(initInfo?.record?.id)
      }
    }, 1000*60);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!initInfo?.record?.id) return
    getInfo()
    getWorkflowLog(initInfo?.record?.id)
  }, [])
  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: | string,
  ) => {
    setDateString(dateString)
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {


  };



  const showRunSqlConfirm = () => {
    setVisible(true)
    runSqlform.resetFields()
    setRunMode("now")
  }

  const showConfirm = (auditType: string) => {
    confirm({
      title: '请填写理由',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={form}>
          <Form.Item name="reason" rules={[{ required: true, message: '请输入' }]}>
            <Input.TextArea></Input.TextArea>

          </Form.Item>
        </Form>
      ),
      onOk(close) {
        form.validateFields().then((info) => {
          auditTicket({ reason: info?.reason, auditType, id: initInfo?.record?.id || afferentId }).then(() => {
            afferentId ? getInfo(afferentId) : getInfo()
            // history.back()
            close()
          })
        })

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const getInfo = (id?: number) => {
    setLoading(true)
    useGetSqlInfo(initInfo?.record?.id || id).then((res) => {
   
      if(Object.keys(res)?.length<1) return
      setInfo(res)
      let auditUsers = [];

      const executeResult = JSON.parse(res?.executeResult || "{}")
      //reviewContent
      const reviewContent = JSON.parse(res?.reviewContent || "{}")
      setReviewContentData(reviewContent)
      setExecuteResultData(executeResult)

      if (res?.audit?.length > 0) {
        setstatus(res?.audit[0]?.AuditStatus)
        setStatusText(res?.audit[0]?.AuditStatusDesc)
        auditUsers = res?.audit[0]?.Groups
        setOwner(auditUsers)
      } else {
        setstatus("")
        setStatusText("")
        auditUsers = []
        setOwner([])
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    // Can not select days before today and today
    // return current && current < moment().endOf('day');
    //当前时间小于开始时间，当前时间大于结束时间
    return current < moment(info?.runStartTime).startOf("days") || current > moment(info?.runEndTime).endOf("days")
  };

  const disabledDateTime = (current: any) => {
    const startHours = Number(moment(info?.runStartTime).hours());
    const endHours = Number(moment(info?.runEndTime).hours());
    const startMinutes = Number(moment(info?.runStartTime).minutes());
    const endMinutes = Number(moment(info?.runEndTime).minutes());
    const startSeconds = Number(moment(info?.runStartTime).seconds());
    const endSeconds = Number(moment(info?.runEndTime).seconds());
    if (current) {
      const startDate = moment(info?.runStartTime).endOf("days").date();
      const endDate = moment(info?.runEndTime).endOf("days").date();
      if (current.date() === startDate) {
        return {
          disabledHours: () => range(0, startHours),
          disabledMinutes: () => range(0, startMinutes),
          disabledSeconds: () => range(0, startSeconds),
        }
      }

      if (current.date() === endDate) {
        return {
          disabledHours: () => range(0, endHours),
          disabledMinutes: () => range(0, endMinutes),
          disabledSeconds: () => range(0, endSeconds),
        }
      }
    }
  };

  const columns = useMemo(() => {
    return createTableColumns() as any;
  }, []);
  return (
    <PageContainer className="approval-end">
      <ContentCard>
        <Modal width={700} title="请选择执行方式" destroyOnClose visible={visible} onCancel={() => { setVisible(false) }} onOk={
          () => {
            runSqlform.validateFields().then((info) => {
              if (info?.runMode === "now") {
                runSql({ runMode: "now", id: initInfo?.record?.id || afferentId }).then(() => {
                  afferentId ? getInfo(afferentId) : getInfo()
                  setVisible(false)
                })
              } else {
                runSql({ runMode: "timing", runDate: info?.runTime.format('YYYY-MM-DD HH:mm:ss'), id: initInfo?.record?.id || afferentId }).then(() => {
                  afferentId ? getInfo(afferentId) : getInfo()
                  setVisible(false)
                })
              }
            })
          }
        }>
          <Form form={runSqlform} labelCol={{ flex: '140px' }}>
            <Form.Item name="runMode" label="执行方式" rules={[{ required: true, message: '请输入' }]}>
              <Radio.Group options={info?.allowTiming ?runModeOptions:runModeOnlyOptions} onChange={(e) => setRunMode(e.target.value)} />
            </Form.Item >
            {runMode === "timing" && (
              <>
                <Form.Item label="sql可执行时间范围:">
                  <span>{info?.runStartTime}--{info?.runEndTime}</span>
                </Form.Item>
                <Form.Item label="执行时间" name="runTime" rules={[{ required: true, message: '请选择' }]}>
                  <DatePicker
                    showTime
                    onChange={onChange}
                    format="YYYY-MM-DD HH:mm:ss"
                    onOk={onOk}
                    showNow={false}
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}
                    placeholder="请选择执行时间"
                  />
                </Form.Item>
              </>)
            }
          </Form>
        </Modal>
        <div>
        <h3>工单标题：{info?.title}<span style={{float:"right"}}>
        <Button  type="primary" className="back-go" onClick={() => {
                  history.push({
                    pathname: "/matrix/DBMS/data-change",

                  })
                }}>
                  返回
              </Button>

        </span></h3>
        
      

        </div>
       
        {/* ------------------------------- */}
        <Spin spinning={loading}>
          <div className="ticket-detail-title">
           <div>
            <div className="second-info">
            <span className="second-info-left">
              {/* <span><Space><span>工单号:</span><span>{info?.id}</span></Space></span> */}
              <span><Space><span>工单号:</span><span>{info?.id}</span></Space></span>
              <span><Space><span>申请人:</span><span><Tag color="#2db7f5">{info?.userName}</Tag></span></Space></span>
              <span><Space><span>工单状态:</span><span><Tag color={CurrentStatusStatus[info?.currentStatus]?.tagColor || "default"}>{info?.currentStatusDesc}</Tag> </span></Space></span>
            </span>
            <span className="second-info-right">
              <Space>
                {status === "wait" &&info?.userName===userName&& 
                  <Tag color="orange" onClick={()=>{ showConfirm("abort")}} >撤销工单</Tag>
            }
               

               
              </Space>
            </span>
          
            </div>
            </div>

           </div>
        
        </Spin>
        {/* ------------------------------- */}
        <Spin spinning={loading}>
          <Descriptions
            bordered
            style={{ marginBottom: 12 }}
            size="small"
            labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap', width: 100 }}
            contentStyle={{ color: '#000' }}
            column={3}
          >
            <Descriptions.Item label="环境">{info?.envCode}</Descriptions.Item>
            <Descriptions.Item label="实例">{info?.instanceName}</Descriptions.Item>
            <Descriptions.Item label="变更库">{info?.dbCode}</Descriptions.Item>
            {/* <Descriptions.Item label="执行方式" span={2}>定时执行</Descriptions.Item> */}
            <Descriptions.Item label="上线理由" span={3}>{info?.remark}</Descriptions.Item>
            <Descriptions.Item label="变更sql" span={3} ><span style={{ maxWidth: '57vw', display: 'inline-block', overflow: "scroll", whiteSpace: "nowrap" }}>{info?.sqlContent?.replace(/\\n/g, '<br/>')}</span></Descriptions.Item>
            {/* <Descriptions.Item label="sql检测结果"><span style={{maxWidth:'57vw', display:'inline-block',overflow:"scroll",whiteSpace:"nowrap"}}>{info?.reviewContent}</span></Descriptions.Item> */}
            {/* <Descriptions.Item label="sql审核">通过</Descriptions.Item> */}
            {/* <Descriptions.Item label="风险项">修改列类型 int改为varchar</Descriptions.Item> */}
            <Descriptions.Item label="sql可执行时间范围" span={3}>{info?.runStartTime}--{info?.runEndTime}</Descriptions.Item>
            <Descriptions.Item label="是否允许定时执行" span={3}>{info?.allowTiming?"是":"否"}</Descriptions.Item>

          </Descriptions>
        </Spin>
        {/* ------------------------------- */}
        <Card style={{ width: "100%", marginTop: 12 }} size="small" className="approval-card" title={<span>审批进度：<span className="processing-title">{statusText}</span></span>}>
          <Spin spinning={auditLoading}>
            <Steps direction="vertical" current={StatusMapping[status] || -1} size="small">
              <Step title="提交" icon={<StarOutlined />} description={`提交时间:${info?.startTime}`} />
              <Step title="库Owner" icon={<DingdingOutlined />} description={`审批人:
              ${owner?.join(',') || ''}`} />
              <Step title={info?.currentStatusDesc} 
              icon={info?.currentStatus==="abort"?<CloseCircleOutlined style={{color:"red"}} />:
              info?.currentStatus==="autoReviewWrong"?<CloseCircleOutlined style={{color:"red"}}/>:
              info?.currentStatus==="exception"?<CloseCircleOutlined style={{color:"red"}} />: info?.currentStatus==="reject"?<CloseCircleOutlined style={{color:"red"}} />: status==="wait"?<LoadingOutlined style={{color:"#2db7f5"}} />:
              <CheckCircleTwoTone />}
                description={
                  status === "wait"&&owner?.join(',')?.includes(userName)? <Space>
                   <Tag color="success" onClick={() => {
                      auditTicket({ auditType: "pass", id: initInfo?.record?.id || afferentId }).then(() => {
                        afferentId ? getInfo(afferentId) : getInfo()
                        // history.back()
                      })
                    }}>审批通过</Tag>

                  
                   <Tag color="volcano" onClick={() => showConfirm("reject")}>拒绝</Tag>
                  </Space>:null} />
            </Steps>

          </Spin>
        </Card>
        {/* ------------------------------- */}
        <div style={{ marginTop: 12 }} >
          <div className="ticket-detail-title">
            <Space>
              <span><b>{(status === "wait"&&reviewContentData?.length > 0)?"检测详情":(status !== "wait" && executeResultData?.length > 0)?"执行详情":"检测详情"}</b></span>
              {info?.currentStatus === "reviewPass" && <span>
                <Spin spinning={runLoading}>
                  <Space>
                    <Tag color="geekblue" onClick={showRunSqlConfirm}>开始执行</Tag>
                  </Space>
                </Spin></span>}
            </Space>
          </div>
          {status === "wait" && (<Table bordered scroll={{ x: '100%' }} dataSource={reviewContentData} loading={loading} >
            {reviewContentData?.length > 0 && (
              Object.keys(reviewContentData[0])?.map((item: any) => {
                return (
                  item==="审批/执行信息"?
                    <Table.Column title={item} width={400} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value?.replace(/\\n/g, '<br/>')}>
                        
                          {value?.replace(/\\n/g, '<br/>')}
                      </Tooltip>
                    )}/>:item==="完整SQL内容"? <Table.Column width={400} title={item} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value?.replace(/\\n/g, '<br/>')}>
                        
                          {value?.replace(/\\n/g, '<br/>')}
                      </Tooltip>)}/>: <Table.Column title={item} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value}>
                       
                          {value}
                      </Tooltip>)}/>
                )
              })

            )}
          </Table>)}
          {status !== "wait" && (executeResultData?.length > 0 ?
            <Table bordered scroll={{ x: '100%' }} dataSource={executeResultData} loading={loading} >
              {executeResultData?.length > 0 && (
                Object.keys(executeResultData[0])?.map((item: any) => {
                  return (
                    item==="审批/执行信息"?
                    <Table.Column title={item} width={400} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value?.replace(/\\n/g, '<br/>')}>
                        
                          {value?.replace(/\\n/g, '<br/>')}
                      </Tooltip>
                    )}/>:item==="完整SQL内容"? <Table.Column width={400} title={item} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value?.replace(/\\n/g, '<br/>')}>
                        
                          {value?.replace(/\\n/g, '<br/>')}
                      </Tooltip>)}/>: <Table.Column title={item} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value}>
                       
                          {value}
                      </Tooltip>)}/>
                  )
                })
              )}
            </Table> : <Table bordered scroll={{ x: '100%' }} dataSource={reviewContentData} loading={loading} >
              {reviewContentData?.length > 0 && (
                Object.keys(reviewContentData[0])?.map((item: any) => {
                  return (
                    item==="审批/执行信息"?
                    <Table.Column title={item} dataIndex={item} key={item} width={400}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value?.replace(/\\n/g, '<br/>')}>
                        
                          {value?.replace(/\\n/g, '<br/>')}
                      </Tooltip>
                    )}/>:item==="完整SQL内容"? <Table.Column title={item} width={400} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value?.replace(/\\n/g, '<br/>')}>
                        
                          {value?.replace(/\\n/g, '<br/>')}
                      </Tooltip>)}/>: <Table.Column title={item} dataIndex={item} key={item}  render={(value) => (
                      <Tooltip placement="topLeft" title= {value}>
                       
                          {value}
                      </Tooltip>)}/>
                  )
                })

              )}
            </Table>
          )}
        </div>


        {/* ------------------------------- */}
        <div className="ticket-detail-title">
          <span className="ticket-detail-title-left">
            <span><Space><span><b>操作日志</b></span></Space></span>
          </span>
        </div>
        {/* ------------------------------- */}
        {/* <div style={{ marginBottom: 8 }} ><b>操作日志</b></div> */}
        <div>
          <Table columns={columns} bordered dataSource={logData} loading={tableLoading} />
        </div>
        {/* </div> */}

        {/* <div className="ticket-detail-footer">
      <span className="ticket-detail-title-left">
      <span><Space><span>回滚:</span><span><Tag color="geekblue">下载回滚SQL</Tag></span></Space></span>
      <span><Space><span>离线发布:</span><span><Tag color="geekblue">下载离线Sql包</Tag></span></Space></span>
     

      </span>
    
      
    </div> */}
      </ContentCard>
    </PageContainer>)
}