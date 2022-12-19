import React, { useState, useMemo, useEffect } from 'react';
import { Drawer, Button, Table, Row, Col, Space, Spin, message, Steps, Tag } from 'antd';
import { DEPLOY_TYPE_MAP, APP_TYPE_MAP, AppType } from '../../const';
import { createApplyDetailSchemaColumns } from '../../schema';
import { getApplyRelInfoReq, auditApply } from '@/pages/publish/service';
import { CloseCircleOutlined, MobileOutlined,DingdingOutlined, CheckCircleTwoTone, StarOutlined, LoadingOutlined } from '@ant-design/icons'
import { getEnvName } from '@/utils';
import moment from 'moment';
import { createTableColumns } from './schema';



export interface IPorps {
  id: string;
  visible: boolean;
  categoryData: any[];
  businessDataList: any[];
  envsUrlList: any[];
  onClose: (reload?:boolean) => void;
  onSave: () => void;
}

const rootCls = 'apply-detail-drawer';
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
  first_0: 1,//一级审批待审批状态
  first_2:1,//一级审批拒绝状态，结束流程，
  first_3:1,//一级审批撤销状态，结束流程，
  first_1:2,//第一层通过状态来到二级审批
  second_0:2,//二级审批待审批状态
  second_1:2,//二级审批通过状态，此时结束
  second_2:2,//二级审批拒绝状态，此时结束
  second_3:2,//二级审批撤销状态，此时结束

 
};
// first_2
const StatusFirstMappingIcon: Record<string, React.ReactNode> = {
  first_0: <LoadingOutlined /> ,//一级审批待审批状态
  first_2:<CloseCircleOutlined style={{color:"red"}}/>,//一级审批拒绝状态，结束流程，
  first_3:<CloseCircleOutlined style={{color:"red"}}/>,//一级审批撤销状态，结束流程，
  first_1:<CheckCircleTwoTone/>,//第一层通过状态来到二级审批
 

 
};
const StatusSecondMappingIcon: Record<string, React.ReactNode> = {
  second_0:<LoadingOutlined/> ,//二级审批待审批状态
  second_1:<CheckCircleTwoTone/>,//二级审批通过状态，此时结束
  second_2:<CloseCircleOutlined style={{color:"red"}}/>,//二级审批拒绝状态，此时结束
  second_3:<CloseCircleOutlined style={{color:"red"}}/>,//二级审批撤销状态，此时结束

 
 
};

const DetailDrawer = (props: IPorps) => {
  const { id, visible, onClose, onSave, categoryData, businessDataList, envsUrlList } = props;
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [auditGroups, setAuditGroups] = useState<any[]>([]);
  const [auditLogs,setAuditLogs] = useState<any[]>([]);
  const [status,setStatus]=useState<string>('')
  const [infoLoading,setInfoLoading]= useState<boolean>(false)
  let userInfo: any = localStorage.getItem('USER_INFO');
  
  let userName=""
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    userName= userInfo ? userInfo.name : ''
  }
 

 
  const handleClose = () => {
    setBaseInfo({});
    setPlans([]);
    onClose && onClose();
  };

  useEffect(() => {
    if (id && visible) {
      getRelInfo()
    }
  }, [id, visible]);
  const getRelInfo=()=>{
    setInfoLoading(true)
    getApplyRelInfoReq({ id }).then((data) => {
      const { base = {}, plans = [], auditGroups = [],auditLogs=[] } = data;
      setBaseInfo(base);
      setPlans(plans);
      setAuditGroups(auditGroups)
      setAuditLogs(auditLogs)
      if(auditGroups?.length>0){
        setStatus(`first_${auditGroups[0]?.auditStatus}`)
      }else{
        setStatus("")
       
      }
      if(auditGroups?.length>1&&auditGroups[0]?.auditStatus===1){ 
          setStatus(`second_${auditGroups[1]?.auditStatus}`) 
      }
    }).finally(()=>{
      setInfoLoading(false)
    });

  }

  const onAuditApply = (result: number) => {
    setLoading(true)
    auditApply({ processInstanceId: baseInfo?.processInstanceId, result }).then((res: any) => {
      if (res?.success) {
        message.success("操作成功！")
        getRelInfo()

       
        if(result===3){
          onClose(true);
        }else{
          onSave && onSave()
        }
      }

    }).finally(() => {

      setLoading(false)

    })
  }
  const columns = useMemo(() => {
    return createTableColumns() as any;
  }, []);
  return (
    <Drawer title="发布申请详情" visible={visible} width={'80%'} onClose={() => handleClose()} className={`${rootCls}`}>
      <div className={`${rootCls}-box`} style={{ marginBottom: 16 }}>
        <div className={`${rootCls}-box-title`}>{baseInfo?.title}</div>
        <Row>
          <Col span={6}>发布类型：{DEPLOY_TYPE_MAP[baseInfo?.deployType] || '--'}</Col>
          <Col span={6}>
            应用分类：
            {categoryData?.find((v) => v.categoryCode === baseInfo?.appCategoryCode)?.categoryName || '-'}
          </Col>
          <Col span={6}>
            应用组：
            {businessDataList?.find((v) => v.groupCode === baseInfo?.appGroupCode)?.groupName || '-'}
          </Col>
          <Col span={6}>发布环境：{getEnvName(envsUrlList, baseInfo?.deployEnv) || ''}</Col>
          <Col span={6}>发布负责人：{baseInfo?.deployUser || ''}</Col>
          <Col span={6}>计划发布时间：{baseInfo?.deployDate || ''}</Col>
          <Col span={6}>
            申请时间：
            {baseInfo?.gmtCreate ? moment(baseInfo?.gmtCreate).format('YYYY-MM-DD HH:mm') : ''}
          </Col>
          <Col span={6}>申请人：{baseInfo?.applyUser || ''}</Col>
        </Row>
      </div>
      <div className={`${rootCls}-box-list`}>
        {plans?.map((plan, index) => {
          return (
            <div className={`${rootCls}-box`}>
              <div className={`${rootCls}-box-title`}>发布计划&nbsp;-&nbsp;{plan?.id}</div>
              <Row>
                <Col span={6}>应用CODE：{plan?.appCode || ''}</Col>
                <Col span={6}>
                  应用分类：
                  {categoryData?.find((v) => v.categoryCode === plan?.appCategoryCode)?.categoryName || '-'}
                </Col>
                <Col span={6}>
                  应用组：
                  {businessDataList?.find((v) => v.groupCode === plan?.appGroupCode)?.groupName || ''}
                </Col>
                <Col span={6}>应用类型：{APP_TYPE_MAP[plan?.deployType as AppType] || '-'}</Col>
                <Col span={6}>版本号：{plan?.version || ''}</Col>
                <Col span={6}>版本分支：{plan?.deployRelease || ''}</Col>
                <Col span={6}>发布依赖：{plan?.dependency || ''}</Col>
                <Col span={6}>开发：{plan?.developer || ''}</Col>
                <Col span={6}>测试：{plan?.tester || ''}</Col>
                <Col span={6}>发布人：{plan?.deployer || ''}</Col>
                <Col span={6}>计划发布时间：{plan?.preDeployTime || ''}</Col>
                <Col span={6}>创建人：{plan?.createUser || ''}</Col>
              </Row>
              {plan.funcs && (
                <Table
                  rowKey="id"
                  scroll={{ x: 1200 }}
                  columns={createApplyDetailSchemaColumns({
                    categoryData,
                    businessDataList,
                    envsUrlList,
                  })}
                  dataSource={plan.funcs}
                  pagination={false}
                  style={{ marginBottom: 12 }}
                />
              )}
              {(plan?.DDL || plan?.DML) && (
                <Row>
                  <Col span={12}>
                    DDL：
                    <br />
                    <textarea rows={5} style={{ width: '95%' }} value={plan?.DDL}></textarea>
                  </Col>
                  <Col span={12}>
                    DML：
                    <br />
                    <textarea rows={5} style={{ width: '95%' }} value={plan?.DML}></textarea>
                  </Col>
                </Row>
              )}
              {plan?.configs && (
                <Row>
                  <Col span={24}>
                    配置：
                    <br />
                    <textarea rows={5} style={{ width: '95%' }} value={plan?.configs}></textarea>
                  </Col>
                </Row>
              )}
              {/* {index !== plans.length - 1 && <Divider />} */}
            </div>
          );
        })}
      </div>
      <div className={`${rootCls}-ticket`}>
      <div className={`${rootCls}-ticket-box`}>
      <span className="approval-button">
        {baseInfo?.applyStatus===0&&baseInfo?.createUser===userName&& <Spin spinning={loading}>
          <Space>
         
          <Button type="primary" ghost onClick={()=>{
          onAuditApply(3)
          }}>撤销</Button>
        

          </Space>
          </Spin>}

        </span> 

      </div>

        {!(baseInfo?.applyStatus!==0&&auditLogs?.length===0)&&
        <>
         <div style={{padding:30}}>
      <Steps direction="vertical" current={StatusMapping[status] || -1} size="small" >
        {/* <Step title="开始" /> */}

       
        {auditGroups?.length>0&&<Step title="一级审批" icon={StatusFirstMappingIcon[status]|| <CheckCircleTwoTone/> } 
           description={<p> 
             <p>
               审批人:
                {auditGroups[0]?.auditGroups?.join(',') || ''}
             </p> 
             <>
            
          {status==="first_0"&&auditGroups[0]?.auditGroups?.includes(userName)&& <Space>
          <Button loading={loading} type="primary" onClick={()=>{
            onAuditApply(1)
            }}>通过</Button>
            <Button loading={loading} type="primary" danger onClick={()=>{
          onAuditApply(2)
          }}>拒绝</Button>
          </Space>}   
               
             </>
           </p>} />}
            {auditGroups?.length>1&&<Step title="二级审批" icon={StatusSecondMappingIcon[status]|| <DingdingOutlined  style={{color:"gray"}}/> }  
           description={<p>
             <p>审批人:{auditGroups[1]?.auditGroups?.join(',') || ''}</p>
             {status==="second_0" &&auditGroups[1]?.auditGroups?.includes(userName)&&
              <Space>
              <Button loading={loading} type="primary" onClick={()=>{
             onAuditApply(1)
             }}>通过</Button>
             <Button type="primary" loading={loading} danger onClick={()=>{
           onAuditApply(2)
           }}>拒绝</Button>
                
              </Space>
              }
            
           </p>
         }/>}
         </Steps>
        </div>
         <div className="approval-log" >
          <p><h3>审批日志</h3></p>
          <Table columns={columns} bordered dataSource={auditLogs} loading={infoLoading} 
           pagination={{
            // current: taskTablePageInfo.pageIndex,
            // total: total,
            // pageSize: pageSize,
            showSizeChanger: true,
            showTotal: () => `总共 ${auditLogs?.length} 条数据`,
          }} />

         </div>

        </>}
        

      </div>
    </Drawer>
  );
};

export default DetailDrawer;
