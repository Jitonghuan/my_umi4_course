import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Empty,Form,Spin,Tag } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import {diffConfig,useNacosNamespaceList,useNacosDataIdList,syncConfig} from './hooks';
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
import {syncOptions} from './type';
import { history,useLocation } from 'umi';
import AceDiff from '@/components/ace-diff';
import './index.less'
export default function NacosSync(){
    const [nacosForm]=Form.useForm()
    let location:any = useLocation();
    const diffInfo = location.state?.diffInfo;
    const entryType=location.state?.type;
    const [loading, setLoading] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);
    const [curSyncType,setCurSyncType]=useState<string>("single")
    const [envCode,setEnvCode]=useState<string>("")
    const [editValue, setEditValue] = useState<string>();
    const [configDiffInfo,setConfigDiffInfo]=useState<any>({})
    const [namespaceDiffInfo,setNamespaceDiffInfo]=useState<any>({})
    const [namespaceLoading,namespaceOptions,queryNacosNamespaceList]=useNacosNamespaceList();
    const [dataIdloading, dataIdOptions, queryNacosDataIdList]=useNacosDataIdList()
    const [change,setChange]=useState<boolean>(false)
    const [firstDataId,setFirstDataId]=useState<string>("")
    const [firstNamespace,setFirstNamespace]=useState<string>("")
    const [isSame,setIsSame]=useState<boolean>(false)

    
    
    const getEnvCode=()=>{
        setLoading(true)
        queryCommonEnvCode().then((res:any)=>{
          if(res?.success){
            setEnvCode(res?.data)
            let curEnvCode=res?.data
            if(curEnvCode){
              queryNacosNamespaceList(curEnvCode)
              
            }
            // if(curEnvCode&&entryType==="isConfDiff"){
            //   startDiffConfig(curEnvCode)
            // }
            
          }else{
            setEnvCode("")
          }
    
        }).finally(()=>{
            setLoading(false)
        })
      }
    const handleSyncClick=useCallback(()=>{
      Modal.confirm({
        title: '确认同步？',
        content: '',
        onOk: async () => {
          try {
            setPending(true);
           
            if (envCode) {
              const params=nacosForm.getFieldsValue() 
              syncConfig({
                envCode,
                ...params
              }).then((res)=>{
                if(res?.success){
                  Modal.success({
                    content: '同步已完成，请确认同步后的配置信息及服务状态！',
                  });
                }
              })
            }
          } finally {
            setPending(false);
          }
        },
      });
      


    },[envCode])
    const startDiffConfig=(curEnvCode?:string)=>{
      setLoading(true);
      setIsSame(false)
      try{
        const params=nacosForm.getFieldsValue()  
        let envCodeParam=curEnvCode||envCode 
        diffConfig({
            envCode:envCodeParam,
            ...params
        }).then((result)=>{
            if (result?.success && !result?.data) {
                message.info('配置一致，无需同步');
                return;
              }
            if(result?.success&&Object.keys(result?.data)?.length>0){
              if(curSyncType==="single"){
                if(result?.data?.clusterA==="AB集群配置一致"){
                  setIsSame(true)
                }
                setConfigDiffInfo(result?.data)
              }
              if(curSyncType==="namespace"){
                setNamespaceDiffInfo(result?.data)
              }
              setCompleted(true);
              setChange(false)
            }
  
        }).finally(()=>{
          setLoading(false);
        })

      }finally{
        //setLoading(false);
      }
     

    }

    useEffect(()=>{
      if(entryType&&entryType==="isConfDiff"&& Object.keys(diffInfo)?.length>0){
        nacosForm.setFieldsValue({
          type:diffInfo?.type,
          dataId:diffInfo?.dataId,
          namespace:diffInfo?.namespace
      })
      startDiffConfig(diffInfo?.envCode)
      setFirstDataId(diffInfo?.dataId)
      setFirstNamespace(diffInfo?.namespace)
      // queryNacosDataIdList({
      //   envCode:,
      //   namespace:diffInfo?.namespace
      // })
     
      }else{
        nacosForm.setFieldsValue({
          type:"single"
      })

      }
       
        getEnvCode()
    },[])
    useEffect(()=>{
      if(namespaceOptions.length>0){
        try {
          nacosForm.setFieldsValue({
            namespace:firstNamespace?firstNamespace: namespaceOptions[1]?.value
        })
        queryNacosDataIdList({
          envCode,
          namespace:firstNamespace?firstNamespace: namespaceOptions[1]?.value
        })
        } catch (error) {    
        }

      }else{
        nacosForm.setFieldsValue({
          namespace:""
      }) 
      }

    },[namespaceOptions])
    useEffect(()=>{
      if(dataIdOptions.length>0){
        try {
          nacosForm.setFieldsValue({
            dataId:firstDataId?firstDataId:dataIdOptions[0]?.value
        }) 
      
        } catch (error) {    
        }

      }else{
        nacosForm.setFieldsValue({
          dataId:""
      }) 
      }


    },[dataIdOptions])
    const renderChangeInfo=(data:any[])=>{
      return(<span>
        { (data||[])?.join(",")}
      </span>)
    }

    return(
        <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
              <Form form={nacosForm} layout="inline">
                  <Form.Item label="同步类型" name="type" tooltip={<p>
                    单配置项同步: 对某个命名空间下的单个不一致配置项进行同步，B集群Data ID不存在时自动创建。
                    <br/>命名空间同步: 同步该命名空间下的所有配置项，B集群命名该命名空间不存在时自动创建。
                  </p>}>
                      <Select style={{width:200}} options={syncOptions} showSearch onChange={(value:string)=>{
                     setCurSyncType(value)
                     setChange(true)
                     setNamespaceDiffInfo({})
                     setConfigDiffInfo({})


                      }} />

                  </Form.Item>
                  <Form.Item label="命名空间" name="namespace">
                  <Select style={{width:200}} options={namespaceOptions} showSearch loading={namespaceLoading} onChange={(value:string)=>{
                     setChange(true)
                     setNamespaceDiffInfo({})
                     setConfigDiffInfo({})
                     setFirstDataId("")
                     setFirstNamespace("")
                    if(curSyncType==="single"){
                      queryNacosDataIdList({
                        envCode,
                        namespace:value
                      })

                    }
                   
                  }} />
                  </Form.Item>
                  {curSyncType==="single"&&   <Form.Item label="Data ID" name="dataId">
                  <Select  style={{width:200}} showSearch options={dataIdOptions} onChange={()=>{
                     setChange(true)
                     setNamespaceDiffInfo({})
                     setConfigDiffInfo({})
                     setFirstDataId("")
                  }} loading={dataIdloading} />
                  </Form.Item>}
                


              </Form>
           
          </div>
          <div className="caption-right">
            <Button type="primary" ghost disabled={!envCode|| loading || pending} onClick={()=>{startDiffConfig()}}>
              开始比对配置
            </Button>
            <Button
              type="primary"
              disabled={isSame|| change || !envCode || loading || pending ||!completed}
              onClick={handleSyncClick}
            >
              开始同步
            </Button>
          </div>
        </div>
       
     
        {(Object.keys(configDiffInfo)?.length>0&&curSyncType==="single"&&!isSame)? <div>
           <Spin spinning={loading}>
           <div className="diff-config-header" >
            <span style={{width:"46vw"}}>A集群配置信息</span>
            <span>B集群配置信息</span>
           </div>
           <AceDiff  
              originValue={configDiffInfo?.clusterA}
              mode={'yaml'}
              readOnly
              height="600px"
              value={configDiffInfo?.clusterB}
              onChange={(n) => setEditValue(n)}/>
           </Spin>
          

        </div>: (Object.keys(namespaceDiffInfo)?.length>0&&curSyncType==="namespace")?<div>
          {/* //namespaceDiffInfo */}
          <Spin spinning={loading}>
          <div className="diff-config-header" >
            <span>比对信息</span>
        </div>
            <div style={{height:600}}>
              <p><span><Tag color="green">A集群发生的变更</Tag>：</span>{(namespaceDiffInfo?.clusterAUpdate&&namespaceDiffInfo?.clusterAUpdate?.length>0)?renderChangeInfo(namespaceDiffInfo?.clusterAUpdate):""}</p>
              <p><span><Tag color="pink">B集群对于A集群多的配置</Tag>：</span>{
              
              (namespaceDiffInfo?.clusterBAdded&&namespaceDiffInfo?.clusterBAdded?.length>0)?renderChangeInfo(namespaceDiffInfo?.clusterBAdded):""
              }</p>

              <p><span><Tag color="purple">B集群对于A集群少的配置</Tag>：</span>{
             
              (namespaceDiffInfo?.clusterBDeleted&&namespaceDiffInfo?.clusterBDeleted?.length>0)?renderChangeInfo(namespaceDiffInfo?.clusterBDeleted):""
              }</p>

            </div>
            

          </Spin>

        </div>:<>
        <div className="diff-config-header" >
            <span style={{width:"46vw"}}>A集群配置信息</span>
            <span>B集群配置信息</span>
        </div>
        
        <Empty
             image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
             imageStyle={{
              height: 60,
              }}
             description={""}
               >
          {isSame?"A、B集群配置信息一致！": loading ? '加载中...' : completed ? '暂无数据' : <a onClick={()=>{startDiffConfig()}}>点击开始进行配置比对</a>}
         </Empty></> }
       
      </ContentCard>
    )
}