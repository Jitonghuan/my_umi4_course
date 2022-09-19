/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:51
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 01:18:24
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/ticket-approval/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Card,Descriptions,Space ,Tag,Button,Input,Steps,Popconfirm} from 'antd';
import React,{useMemo} from 'react';
import PageContainer from '@/components/page-container';
import {SendOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons';
import './index.less'
const { Step } = Steps;
export default function TicketApproval(){
   
    return(<PageContainer>
     {/* ------------------------------- */}
     <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>工单号:</span><span>0007</span></Space></span>
      <span><Space><span>工单类型:</span><span>数据变更</span></Space></span>
      <span><Space><span>工单状态:</span><span><Tag color="processing">审批中</Tag></span></Space></span>

      </span>
      <span className="ticket-detail-title-right">
       <Space>
       <Tag color="geekblue">复制工单</Tag>
         <Popconfirm  title="确认撤销该工单吗?"
            onConfirm={() => {
             
            }}>
         <Tag color="orange">撤销工单</Tag>
         </Popconfirm>
         
       </Space>
      </span>
      
    </div>
     {/* ------------------------------- */}
     <Descriptions 
    bordered 
    style={{marginBottom:12}}
    size="small"
    labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap',width: 100 }}
    contentStyle={{ color: '#000' }}
    column={2}
    >
  <Descriptions.Item label="环境">dev</Descriptions.Item>
  <Descriptions.Item label="实例">hbos-dev</Descriptions.Item>
  <Descriptions.Item label="变更库" span={2}>Hangzhou, Zhejiang</Descriptions.Item>
  <Descriptions.Item label="执行方式" span={2}>定时执行</Descriptions.Item>
  <Descriptions.Item label="上线理由" span={2}>订正数据</Descriptions.Item>
  <Descriptions.Item label="变更sql"span={2}><Input></Input></Descriptions.Item>
  <Descriptions.Item label="sql检测结果">影响行数：10000</Descriptions.Item>
  <Descriptions.Item label="sql审核">通过</Descriptions.Item>
  <Descriptions.Item label="风险项">修改列类型 int改为varchar</Descriptions.Item>

  </Descriptions>
    {/* ------------------------------- */}
  <Card style={{ width: "100%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">进行中</span></span>}>
          <Steps direction="vertical" current={1} size="small">
            <Step title="提交" icon={<StarOutlined />} description="提交时间" />
           <Step title="库Owner" icon={<DingdingOutlined />} description="当前审批人" />
           <Step title="完成" icon={<CheckCircleTwoTone />} description={<Space><Tag color="success">审批通过</Tag> </Space>} />
         </Steps>


          </Card>
    </PageContainer>)
}