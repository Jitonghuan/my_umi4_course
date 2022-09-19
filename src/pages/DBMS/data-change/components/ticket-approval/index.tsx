/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:51
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 01:18:24
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/ticket-approval/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// export default function TicketApproval(){
//     return(<>
//     </>)
// }

import { Card,Descriptions,Space ,Tag,Button,Input,Steps} from 'antd';
import React,{useMemo} from 'react';
import {SendOutlined,DingdingOutlined,CheckCircleTwoTone,StarOutlined} from '@ant-design/icons';
const { Step } = Steps;
export default function TicketApproval(){
   
    return(<>
    <Descriptions  size="small" bordered>
    <Descriptions.Item label="工单号">Zhou Maomao</Descriptions.Item>
    <Descriptions.Item label="工单类型">数据变更</Descriptions.Item>
    <Descriptions.Item label="工单状态">审批中</Descriptions.Item>
  </Descriptions>
 
  <Descriptions>
  <Descriptions.Item label="环境">Zhou Maomao</Descriptions.Item>
  <Descriptions.Item label="实例">1810000000</Descriptions.Item>
  <Descriptions.Item label="变更库">Hangzhou, Zhejiang</Descriptions.Item>
  <Descriptions.Item label="执行方式">定时执行</Descriptions.Item>
  <Descriptions.Item label="上线理由">订正数据</Descriptions.Item>
  <Descriptions.Item label="变更sql"><Input></Input></Descriptions.Item>
  <Descriptions.Item label="sql检测结果">影响行数：10000</Descriptions.Item>
  <Descriptions.Item label="sql审核">通过</Descriptions.Item>
  <Descriptions.Item label="风险项">修改列类型 int改为varchar</Descriptions.Item>

  </Descriptions>
  <Card style={{ width: "90%" ,marginTop:16 }} title={<span>审批进度：<span className="processing-title">进行中</span></span>}>
          <Steps direction="vertical" current={1} size="small">
            <Step title="提交" icon={<StarOutlined />} description="提交时间" />
           <Step title="库Owner" icon={<DingdingOutlined />} description="当前审批人" />
           <Step title="完成" icon={<CheckCircleTwoTone />} description={<Space><Button type="primary" size="small">同意</Button> <Button danger size="small">拒绝</Button></Space>} />
         </Steps>


          </Card>
    </>)
}