/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-18 21:43:42
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 01:13:53
 * @FilePath: /fe-matrix/src/pages/DBMS/data-change/components/approval-end/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card,Descriptions,Space ,Tag,Table,Input} from 'antd';
import React,{useMemo} from 'react';
import {createTableColumns} from './schema'
export default function ApprovalEnd(){
    const columns = useMemo(() => {
       
        return createTableColumns(
            {onDetail: (record: any, index: number) => {
             
              },
             } ) as any;
      }, []);
    return(<>
    <Descriptions  size="small" bordered>
    <Descriptions.Item label="工单号">Zhou Maomao</Descriptions.Item>
    <Descriptions.Item label="工单类型">1810000000</Descriptions.Item>
    <Descriptions.Item label="工单状态">Hangzhou, Zhejiang</Descriptions.Item>
  </Descriptions>
  <Descriptions  size="small" bordered>
    <Descriptions.Item label="审批进度">已完成</Descriptions.Item>
   
    
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
  <Card bordered>
      <div>
          <Space>
              <span>审批进度</span>
              <span>已完成</span>
             
          </Space>
     </div>
   
  </Card>
  <Card bordered>
      <div>
          <Space>
              <span>执行详情</span>
              <span><Tag>开始执行</Tag></span>
             
          </Space>
     </div>
     <Table columns={columns}/>
  </Card>
  <Descriptions  size="small" bordered>
    <Descriptions.Item label="工单结束"></Descriptions.Item>
   
    
  </Descriptions>
  <Card bordered>
      <div>
          <Space>
              <span>回滚<Tag>下载回滚SQL</Tag></span>
              <span></span>
              <span>离线发布<Tag>下载离线Sql包</Tag></span>
          </Space>
     </div>
     <Table columns={columns}/>
  </Card>
  <Descriptions  size="small" bordered>
    <Descriptions.Item label="回滚"></Descriptions.Item>
    <Descriptions.Item label="离线发布">1810000000</Descriptions.Item>
    
  </Descriptions>
    </>)
}