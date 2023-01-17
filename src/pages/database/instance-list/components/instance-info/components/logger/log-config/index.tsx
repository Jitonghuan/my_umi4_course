import React, { useMemo, useState,useContext,useEffect} from 'react';
import {Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { Button, Space, Input, Table, Radio, DatePicker, Card,message,Form,InputNumber } from 'antd';
import {useGetSlowLogConfig,updateSlowLogConfig} from '../hook'
import {buttonPession} from "@/pages/database/utils"
import  DetailContext  from '../../../context';


  const options=[{
      label:'开启',
      value:true
  },{
    label:'关闭',
    value:false

  }
]
export default function LowSqlStatistics(){
    const [form]=Form.useForm();
    const [timeRange, setTimeRange] = useState<any>([]);
    const [value, setValue] = useState<number | undefined>();
    const [loading, dataSource, getSlowLogConfig]=useGetSlowLogConfig()
    const {clusterId,clusterRole,instanceId,envCode=""} =useContext(DetailContext);
    const [ensureLoading,setEnsureLoading]=useState<boolean>(false)
    const update=()=>{
      setEnsureLoading(true)
      updateSlowLogConfig({
        instanceId,
        envCode,
        status:form.getFieldValue("status")
      }).then((res)=>{
        if(res?.success){
          
        message.success("修改成功！")
        }

      }).finally(()=>{
        setEnsureLoading(false)
      })
    }
    useEffect(()=>{
      if(instanceId&&envCode){
        getSlowLogConfig({
          instanceId,
          envCode
        })

      }
    },[])
    useEffect(()=>{
      if(Object.keys(dataSource)?.length>0){
        form.setFieldsValue({
          status:dataSource?.status
        })

      }
    },[
      Object.keys(dataSource)?.length
    ])
    
   
     
    return(
        <div>
           <Card title="慢日志配置" style={{ width: '100%',padding:16 }} extra={<Space>
           {buttonPession("matrix:1016:log-config-submit")&&<Button type="primary" onClick={update} loading={ensureLoading}>提交</Button>} 
            <Button onClick={()=>{
                form.setFieldsValue({
                  status:dataSource?.status
                })
            }}>取消</Button>
           </Space>} >
               <Form layout="inline" form={form}>
                   <Form.Item name="status">
                       <Radio.Group options={options} />
                   </Form.Item>
                   {/* <Form.Item label="保留时间">
                    <InputNumber  min={0} value={15} disabled={true} addonAfter="天"/>
                   </Form.Item> */}


               </Form>
    
           </Card>
        </div>
    )

}