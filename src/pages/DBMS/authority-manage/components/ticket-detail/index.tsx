// 数据管理-工单详情
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/09/8 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, Select, Steps, Card ,Tag,Descriptions,Space} from 'antd';
import {SendOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons'
import './index.less'


export interface CreateArticleProps {
  mode?: EditorMode;
  curRecord?: any;
  onClose: () => any;
  onSave: () => any;
}
const { Step } = Steps;
export default function CreateArticle(props: CreateArticleProps) {
  const { mode, curRecord, onClose, onSave } = props;
 
  useEffect(() => {
    if (mode === 'HIDE' || !curRecord) return;
   
    return () => {
     
    };
  }, [mode]);
  
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
          <Card style={{ width: "90%" }} >
              <Descriptions column={2} size="small" >
                    <Descriptions.Item label="工单号">000007</Descriptions.Item>
                    
                    <Descriptions.Item label="工单类型"><Tag>权限申请</Tag></Descriptions.Item>
                   
                    <Descriptions.Item  label="工单状态"><Tag>审批中</Tag> </Descriptions.Item>
                    <Descriptions.Item label=""><Tag color="volcano">撤销工单</Tag></Descriptions.Item>
                    
             </Descriptions>
          </Card>
          <Card style={{ width: "90%",marginTop:16 }} >
              <Descriptions column={2} size="small" >
                    <Descriptions.Item label="环境">dev</Descriptions.Item>
                    
                    <Descriptions.Item label="实例"><Tag>hbos-dev</Tag></Descriptions.Item>
                    <Descriptions.Item label="对象类型">表权限</Descriptions.Item>
                    
                    <Descriptions.Item label="有效期">一个月</Descriptions.Item>
                    <Descriptions.Item label="库表对象" span={2}>hbos_otc</Descriptions.Item>
                    
                  
                   
                    <Descriptions.Item span={2} label="授权功能">查询｜变更</Descriptions.Item>
                    <Descriptions.Item span={2} label="理由">00007</Descriptions.Item>
                    
             </Descriptions>
          </Card>
          <Card style={{ width: "90%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">进行中</span></span>}>
          <Steps direction="vertical" current={1} size="small">
            <Step title="提交" icon={<StarOutlined />} description="提交时间" />
           <Step title="库Owner" icon={<DingdingOutlined />} description="当前审批人" />
           <Step title="完成" icon={<CheckCircleTwoTone />} description={<Space><Button type="primary" size="small">同意</Button> <Button danger size="small">拒绝</Button></Space>} />
         </Steps>


          </Card>



      </Drawer>
  );
}
