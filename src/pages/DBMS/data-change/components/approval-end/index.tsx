/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:42
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 01:13:53
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/approval-end/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card,Descriptions,Space ,Tag,Table,Input,Button,Popconfirm} from 'antd';
import React,{useMemo} from 'react';
import PageContainer from '@/components/page-container';
import {createTableColumns} from './schema';
import './index.less'
export default function ApprovalEnd(){
    const columns = useMemo(() => {
       
        return createTableColumns(
            {onDetail: (record: any, index: number) => {
             
              },
             } ) as any;
      }, []);
    return(<PageContainer className="approval-end">
       {/* ------------------------------- */}
    <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>工单号:</span><span>0007</span></Space></span>
      <span><Space><span>工单类型:</span><span>数据变更</span></Space></span>
      <span><Space><span>工单状态:</span><span><Tag color="processing">审批中</Tag></span></Space></span>

      </span>
      <span className="ticket-detail-title-right">
       <Space>
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
  <div className="ticket-detail-title">
      <span className="ticket-detail-title-left">
      <span><Space><span>审批进度:</span><Tag color="green">已完成</Tag></Space></span>
     
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