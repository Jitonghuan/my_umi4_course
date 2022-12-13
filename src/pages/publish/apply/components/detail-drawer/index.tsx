import React, { useState, useCallback, useEffect } from 'react';
import { Drawer, Form, Spin, Input, Steps, Card ,Tag,Descriptions,Space,Modal,Table,Empty,Row, Col, Select, Divider,} from 'antd';
import {CloseCircleOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined,LoadingOutlined} from '@ant-design/icons'
import { DEPLOY_TYPE_MAP, APP_TYPE_MAP, AppType } from '../../const';
import { createApplyDetailSchemaColumns } from '../../schema';
import { getApplyRelInfoReq } from '@/pages/publish/service';
import { getEnvName } from '@/utils';
import moment from 'moment';

export interface IPorps {
  id: string;
  visible: boolean;
  categoryData: any[];
  businessDataList: any[];
  envsUrlList: any[];
  onClose: () => void;
}

const rootCls = 'apply-detail-drawer';
const { Step } = Steps;
const StatusMapping: Record<string, number> = {
  wait:1,
  pass:2,
  reject:2,
  abort:2
};

const DetailDrawer = (props: IPorps) => {
  const { id, visible, onClose, categoryData, businessDataList, envsUrlList } = props;
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [plans, setPlans] = useState<any[]>([]);
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
      getApplyRelInfoReq({ id }).then((data) => {
        const { base = {}, plans = [] } = data;
        setBaseInfo(base);
        setPlans(plans);
      });
    }
  }, [id, visible]);

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
      <Card size="small" style={{ width: "90%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">{auditStatusDesc}</span></span>}>
          <Spin spinning={false}>
          <Steps direction="vertical" current={StatusMapping[status] || -1} size="small" >
           <Step title="提交" icon={<StarOutlined />} description={`提交时间:${info?.startTime}`} />
           <Step title="库Owner" icon={<DingdingOutlined />} 
           description={`审批人:
           ${ ''}
         `} />
           {/* LoadingOutlined */}
           <Step title={info?.currentStatusDesc} icon={info?.currentStatus==="abort"?<CloseCircleOutlined style={{color:"red"}} />:
              info?.currentStatus==="autoReviewWrong"?<CloseCircleOutlined style={{color:"red"}}/>:
              info?.currentStatus==="exception"?<CloseCircleOutlined style={{color:"red"}} />:  info?.currentStatus==="reject"?<CloseCircleOutlined style={{color:"red"}} />:
              status==="wait"?<LoadingOutlined style={{color:"#2db7f5"}} />:
              <CheckCircleTwoTone />} 
              description={
             <Spin spinning={false}>
             {status==="wait"&&owner?.join(',')?.includes(userName)?(
                <Space> 
                <Tag color="geekblue" onClick={()=>{
              
             }}>同意</Tag> 
             <Tag color="volcano" onClick={()=>{}}>拒绝</Tag>   
             </Space>):null}
            
          

             </Spin>
          } />
         </Steps>


          </Spin>
        

          </Card>


      </div>
    </Drawer>
  );
};

export default DetailDrawer;
