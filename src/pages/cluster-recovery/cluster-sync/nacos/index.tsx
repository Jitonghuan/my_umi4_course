import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Empty,Form } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import {diffConfig} from './hooks';
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
import {syncOptions} from './type'
import AceDiff from '@/components/ace-diff';
import * as APIS from '../../service';
import {data} from './mock';
import './index.less'
export default function NacosSync(){
    const [nacosForm]=Form.useForm()
    const [loading, setLoading] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);
    const [curSyncType,setCurSyncType]=useState<string>("single")
    const [envCode,setEnvCode]=useState<string>("")
    const [editValue, setEditValue] = useState<string>();
    
    const getDiffDataSource=()=>{
        setLoading(true)
        queryCommonEnvCode().then((res:any)=>{
          if(res?.success){
            setEnvCode(res?.data)
            let curEnvCode=res?.data
            if(curEnvCode){
               const params=nacosForm.getFieldsValue()
                diffConfig({
                    envCode:curEnvCode,
                    ...params
                }).then((result)=>{
                    if (result?.success && !result?.data) {
                        message.info('配置一致，无需同步');
                        return;
                      }
                    if(result?.success&&result?.data){


                    }

                })
            }
            
          }else{
            setEnvCode("")
          }
    
        }).finally(()=>{
            setLoading(false)
        })
      }
    const handleSyncClick=()=>{
        Modal.success({
            content: '同步已完成，请确认同步后的配置信息及服务状态！',
          });


    }
    const startDiffApp=()=>{

    }
    useEffect(()=>{
        nacosForm.setFieldsValue({
            type:"single"
        })
    },[])
    return(
        <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
              <Form form={nacosForm} layout="inline">
                  <Form.Item label="同步类型" name="type" tooltip={<p>
                    单配置项同步: 对某个命名空间下的单个不一致配置项进行同步，B集群Data ID不存在时自动创建。
                    <br/>命名空间同步: 同步该命名空间下的所有配置项，B集群命名该命名空间不存在时自动创建。
                  </p>}>
                      <Select style={{width:200}} options={syncOptions} onChange={(value:string)=>{
                     setCurSyncType(value)

                      }} />

                  </Form.Item>
                  <Form.Item label="命名空间" name="namespace">
                  <Select style={{width:200}}  />
                  </Form.Item>
                  {curSyncType==="single"&&   <Form.Item label="Data ID" name="dataId">
                  <Select  style={{width:200}} />
                  </Form.Item>}
                


              </Form>
           
          </div>
          <div className="caption-right">
            <Button type="primary" ghost disabled={false} onClick={startDiffApp}>
              开始比对配置
            </Button>
            <Button
              type="primary"
              disabled={false}
              onClick={handleSyncClick}
            >
              开始同步
            </Button>
          </div>
        </div>
        <div className="diff-config-header" >
            <span style={{width:"46vw"}}>A集群配置信息</span>
            <span>B集群配置信息</span>
        </div>
        <div>
        {/* <Empty
             image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
             imageStyle={{
              height: 60,
              }}
             description={
                <span>
               暂无对比信息
                </span>
                  }
               >
          {loading ? '加载中...' : completed ? '暂无数据' : <a onClick={startDiffApp}>点击开始进行配置比对</a>}
         </Empty> */}
        </div>
        {!loading && <div>
           
            <AceDiff  
              originValue={data?.clusterA}
              mode={'yaml'}
              readOnly
              height="600px"
              value={"apex00:\n  sso:\n    redis:\n"}
              onChange={(n) => setEditValue(n)}/>

        </div> }
       
      </ContentCard>
    )
}