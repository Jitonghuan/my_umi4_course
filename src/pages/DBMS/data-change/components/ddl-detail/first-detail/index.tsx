import { Card, Descriptions, Space, Tag, Table, Input, Modal,Drawer, Typography, Button, Form, Spin, Radio, DatePicker, Steps, Tooltip } from 'antd';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import PageContainer from '@/components/page-container';
import { ExclamationCircleOutlined, DingdingOutlined, CheckCircleTwoTone, StarOutlined, CloseCircleOutlined, LoadingOutlined,CopyOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { createTableColumns } from './schema';
import { history, useLocation } from 'umi';
import NextEnvDraw from './next-env-draw'
import moment from 'moment';
import AceEditor from '@/components/ace-editor';
import { useGetDdlDesignFlow } from '../hook'
import DetailContext from '../context';
import { parse } from 'query-string';
import { CurrentStatusStatus, PrivWfType } from '../../../../authority-manage/components/authority-apply/schema'
import { useGetSqlInfo, useAuditTicket, useRunSql, useworkflowLog } from './hook'
import RollbackSql from '../../rollback-sql'
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
  abort: 2
};
const { Paragraph } = Typography;
export default function ApprovalEnd() {
  const [info, setInfo] = useState<any>({});
  const [tableLoading, logData, getWorkflowLog] = useworkflowLog()
  const [form] = Form.useForm()
  const [sqlForm] =Form.useForm()
  const [runSqlform] = Form.useForm()
  const { tabKey, parentWfId } = useContext(DetailContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setstatus] = useState<string>("");
  const [runMode, setRunMode] = useState<string>("now")
  const [owner, setOwner] = useState<any>([]);
  const [auditLoading, auditTicket] = useAuditTicket();
  const [visiable, setVisiable] = useState<boolean>(false);
  //useRunSql
  const [runLoading, runSql] = useRunSql();
  const [statusText, setStatusText] = useState<string>("");
  const [executeResultData, setExecuteResultData] = useState<any>([])
  const [reviewContentData, setReviewContentData] = useState<any>([])
  const [dateString, setDateString] = useState<string>("");
  const [nextEnvmode, setNextEnvmode] = useState<EditorMode>("HIDE")
  const [label, setLabel] = useState<any>([])
  const [showSql,setShowSql]=useState<boolean>(false)
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const afferentId = Number(query?.id) || Number(query?.parentId)
  let userInfo: any = localStorage.getItem('USER_INFO');
  let userName = ""
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    userName = userInfo ? userInfo.name : ''
  }
  const [visible, setVisible] = useState<boolean>(false)

  const { confirm } = Modal;
  useEffect(() => {
    if ((query?.detail === "true" && query?.id) || query?.parentId) {

      getInfo(afferentId)
      getWorkflowLog(afferentId)
    }
    return () => {
      // history.push(location.pathname)
    }
  }, [afferentId])
  useEffect(() => {
    let intervalId = setInterval(() => {
      if ((query?.detail === "true" && query?.id) || query?.parentId) {
        getInfo(afferentId)
        getWorkflowLog(afferentId)
      } else if (query?.entry !== "DDL") {
        getInfo()
        getWorkflowLog(initInfo?.record?.id)
      }
    }, 1000 * 60);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!initInfo?.record?.id && !query?.parentId) return
    getInfo(initInfo?.record?.id || query?.parentId)
    getWorkflowLog(initInfo?.record?.id || query?.parentId)

  }, [])
  useEffect(() => {

    getDdlDesignFlow()
  }, [tabKey])
  const getDdlDesignFlow = () => {
    if (tabKey) {
      useGetDdlDesignFlow(initInfo?.record?.id || query?.parentId, tabKey).then((res) => {
        let nextEnv = res?.nextEnv
        setLabel(nextEnv)
      })

    }

  }
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
            //afferentId ? getInfo(afferentId) : getInfo()
            // history.back()
            close()

          }).then(() => {
            if ((query?.detail === "true" && query?.id) || query?.parentId) {
              getInfo(afferentId)
              getWorkflowLog(afferentId)
            } else if (query?.entry !== "DDL") {
              getInfo()
              getWorkflowLog(initInfo?.record?.id)
            }
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
    let currentId = id ? id : initInfo?.record?.id
    useGetSqlInfo(currentId).then((res) => {

      if (Object.keys(res)?.length < 1) return
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
     
      if( endDate=== startDate){
        return {
          disabledHours: () => range(0, startHours).concat(range( endHours+1,24)),
          disabledMinutes: () => current.hours() === startHours?range( 0, startMinutes):current.hours() === endHours?range( endMinutes+1,60):[],
          disabledSeconds: () => current.minutes() === startMinutes?range( 0, startSeconds):current.minutes() === endMinutes?range( endSeconds+1,60):[],
        }
      }
      if (current.date() === startDate) {
        return {
          disabledHours: () => range(0, startHours),
          disabledMinutes: () => range(0, startMinutes),
          disabledSeconds: () => range(0, startSeconds),
        }
      }

      if (current.date() === endDate) {
        return {
          disabledHours: () => range( endHours+1,24),
          disabledMinutes: () => range( endMinutes+1,60),
          disabledSeconds: () => range(endSeconds+1,60),
        }
      }
    }
  };

  const renderInfo = (data: any) => {
    return (
      Object.keys(data)?.map((item: any) => {
        return (
          item === "阶段状态" ?
            <Table.Column title={item} width={80}  dataIndex={item} key={item} render={(value) => (
              <span >
                {value?.replace(/\\n/g, '<br/>')}
              </span>
            )} /> :
            item === "错误级别" ?
              <Table.Column title={item} width={80} dataIndex={item} key={item} render={(value) => (
                <span><Tag color={value === "通过" ? "green" : value === "警告" ? "orange" : value === "错误" ? "red" : "default"}>{value}</Tag></span>
              )} /> : item === "审核/执行信息" ?
                <Table.Column title={item} width={400} ellipsis  dataIndex={item} key={item} render={(value) => (

                   <span >
                    <a onClick={()=>{
                      setShowSql(true)
                      sqlForm.setFieldsValue({
                        showSql:value?.replace(/\\n/g, '<br/>')
                      })
                    }}>{value?.replace(/\\n/g, '<br/>')}</a>
                   
                  </span>

                )} /> : item === "完整SQL内容" ? <Table.Column width={400} ellipsis title={item} dataIndex={item} key={item} render={(value) => (

                  // <span style={{ display: "inline-block", whiteSpace: "pre-line" }}>
                      <a onClick={()=>{
                      setShowSql(true)
                      sqlForm.setFieldsValue({
                        showSql:value?.replace(/\\n/g, '<br/>')
                      })
                    }}>{value?.replace(/\\n/g, '<br/>')}</a>
                   
                  // </span>

                )} /> : <Table.Column title={item} width={80} ellipsis dataIndex={item} key={item} render={(value) => (
                  <Tooltip placement="topLeft" title={value}>

                    {value}
                  </Tooltip>)} />
        )
      })

    )
  }

  const columns = useMemo(() => {
    return createTableColumns() as any;
  }, []);
  return (
    <PageContainer className="approval-end">
      <Drawer title="sql详情" visible={showSql} footer={false} width={"70%"} onClose={()=>{setShowSql(false)}} destroyOnClose>
        <Form form={sqlForm} preserve={false}>
          <Form.Item name="showSql">
          <AceEditor mode="sql" height={900} readOnly={true} />
          </Form.Item>

        </Form>
       

      </Drawer>
      <RollbackSql visiable={visiable} onClose={() => { setVisiable(false) }} curId={initInfo?.record?.id || afferentId} />
      <NextEnvDraw
        mode={nextEnvmode}
        onClose={() => {
          setNextEnvmode("HIDE")
        }}
        nextEnvType={label?.value}

        onSave={() => {
          if ((query?.detail === "true" && query?.id) || query?.parentId) {
            getInfo(afferentId)
            getWorkflowLog(afferentId)
          } else {
            getInfo()
            getWorkflowLog(initInfo?.record?.id || afferentId)
          }
          setNextEnvmode("HIDE")
        }}
        label={label}
        sqlContent={info?.sqlContent}
      />
      <ContentCard>
        <Modal width={700} title="请选择执行方式" destroyOnClose visible={visible} onCancel={() => { setVisible(false) }} onOk={
          () => {
            runSqlform.validateFields().then((info) => {
              if (info?.runMode === "now") {
                runSql({ runMode: "now", id: initInfo?.record?.id || afferentId }).then(() => {
                  //afferentId ? getInfo(afferentId) : getInfo()
                  setVisible(false)


                }).then(() => {
                  setTimeout(() => {
                    if ((query?.detail === "true" && query?.id) || query?.parentId) {
                      getInfo(afferentId)
                      getWorkflowLog(afferentId)
                    } else {
                      getInfo()
                      getWorkflowLog(initInfo?.record?.id || afferentId)
                    }

                  }, 300);
                })
              } else {
                runSql({ runMode: "timing", runDate: info?.runTime.format('YYYY-MM-DD HH:mm:ss'), id: initInfo?.record?.id || afferentId }).then(() => {
                  //afferentId ? getInfo(afferentId) : getInfo()
                  setVisible(false)

                }).then(() => {
                  if ((query?.detail === "true" && query?.id) || query?.parentId) {
                    getInfo(afferentId)
                    getWorkflowLog(afferentId)
                  } else {
                    getInfo()
                    getWorkflowLog(initInfo?.record?.id || afferentId)
                  }
                })
              }
            })
          }
        }>
          <Form form={runSqlform} labelCol={{ flex: '140px' }}>
            {info?.allowTiming === true ?
              <Form.Item name="runMode" label="执行方式" rules={[{ required: true, message: '请输入' }]} >
                <Radio.Group options={runModeOptions} onChange={(e) => setRunMode(e.target.value)} />
              </Form.Item > :
              <Form.Item name="runMode" label="执行方式" rules={[{ required: true, message: '请输入' }]} initialValue={runModeOnlyOptions[0]?.value} >
                <Radio.Group options={runModeOnlyOptions} onChange={(e) => setRunMode(e.target.value)} defaultValue={runModeOnlyOptions[0]?.value} />
              </Form.Item >}

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
                    //@ts-ignore
                    disabledTime={disabledDateTime}
                    placeholder="请选择执行时间"
                  />
                </Form.Item>
              </>)
            }
          </Form>
        </Modal>
        <div>
          <h3>工单标题：{info?.title}<span style={{ float: "right" }}>
            <Button type="primary" className="back-go" onClick={() => {
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
                  <span><Space><span>工单号:</span><span>{info?.id}</span></Space></span>
                  <span><Space><span>申请人:</span><span><Tag color="#2db7f5">{info?.userName}</Tag></span></Space></span>
                  <span><Space><span>工单状态:</span><span><Tag color={CurrentStatusStatus[info?.currentStatus]?.tagColor || "default"}>{info?.currentStatusDesc}</Tag> </span></Space></span>
                </span>
                <span className="second-info-right">
                  <Space>
                    {status === "wait" && info?.userName === userName &&
                      <Tag color="orange" onClick={() => { showConfirm("abort") }} >撤销工单</Tag>
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
            <Descriptions.Item label="上线理由" span={3}>{info?.remark}</Descriptions.Item>
            <Descriptions.Item label="变更sql" span={3} ><span style={{ maxWidth: '57vw', display: 'inline-block', overflow: "scroll", whiteSpace: "nowrap" }}>{info?.sqlContent?.replace(/\\n/g, '<br/>')}</span></Descriptions.Item>
            <Descriptions.Item label="sql可执行时间范围" span={3}>{info?.runStartTime}--{info?.runEndTime}</Descriptions.Item>
            <Descriptions.Item label="是否允许定时执行" span={3}>{info?.allowTiming ? "是" : "否"}</Descriptions.Item>

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
                icon={info?.currentStatus === "abort" ? <CloseCircleOutlined style={{ color: "red" }} /> :
                  info?.currentStatus === "autoReviewWrong" ? <CloseCircleOutlined style={{ color: "red" }} /> :
                    info?.currentStatus === "exception" ? <CloseCircleOutlined style={{ color: "red" }} /> : info?.currentStatus === "reject" ? <CloseCircleOutlined style={{ color: "red" }} /> : status === "wait" ? <LoadingOutlined style={{ color: "#2db7f5" }} /> :
                      <CheckCircleTwoTone />}
                description={
                  status === "wait" && owner?.join(',')?.includes(userName) ? <Space>
                    <Tag color="success" onClick={() => {
                      auditTicket({ auditType: "pass", id: initInfo?.record?.id || afferentId }).then(() => {
                        //afferentId ? getInfo(afferentId) : getInfo()
                        setTimeout(() => {
                          if ((query?.detail === "true" && query?.id) || query?.parentId) {
                            getInfo(afferentId)
                            getWorkflowLog(afferentId)
                          } else {
                            getInfo()
                            getWorkflowLog(initInfo?.record?.id)
                          }

                        }, 300);

                      })
                    }}>审批通过</Tag>


                    <Tag color="volcano" onClick={() => showConfirm("reject")}>拒绝</Tag>
                  </Space> : null} />
            </Steps>

          </Spin>
        </Card>
        {/* ------------------------------- */}
        <div style={{ marginTop: 12 }} >
          <div className="ticket-detail-env-title" >
            <Space  >
              <span>
                <span style={{ display: "inline-flex" }}>
                  <b>{(status === "wait" && reviewContentData?.length > 0) ? "检测详情" : (status !== "wait" && executeResultData?.length > 0) ? "执行详情" : "检测详情"}</b>&nbsp;&nbsp;
                  <Spin spinning={runLoading} >
                    {info?.currentStatus === "reviewPass" && <Tag color="geekblue" onClick={showRunSqlConfirm}>开始执行</Tag>}
                  </Spin>
                </span>

              </span>
              <span>
                {info?.currentStatus === "finish" && label?.value && (
                  <Button type="primary" onClick={() => {
                    setNextEnvmode("EDIT")
                  }}>执行到下个环境</Button>
                )}
              </span>
            </Space>
            <span >
              {info?.currentStatus === "finish" && <Button type="primary" onClick={() => {
                setVisiable(true)
              }}>获取回滚语句</Button>}
              {info?.currentStatus === "exception" && <Button type="primary" onClick={() => {
                setVisiable(true)
              }}>获取回滚语句</Button>}
            </span>

          </div>
          {status === "wait" && (<Table bordered scroll={{ x: '100%' }} dataSource={reviewContentData} loading={loading} >
            {reviewContentData?.length > 0 && (
              renderInfo(reviewContentData[0])

            )}
          </Table>)}
          {status !== "wait" && (executeResultData?.length > 0 ?
            <Table bordered scroll={{ x: '100%' }} dataSource={executeResultData} loading={loading} >
              {executeResultData?.length > 0 && (
                renderInfo(executeResultData[0])

              )}
            </Table> : <Table bordered scroll={{ x: '100%' }} dataSource={reviewContentData} loading={loading} >
              {reviewContentData?.length > 0 && (
                renderInfo(reviewContentData[0])
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

        <div>
          <Table columns={columns} bordered dataSource={logData} loading={tableLoading} />
        </div>

      </ContentCard>
    </PageContainer>)
}