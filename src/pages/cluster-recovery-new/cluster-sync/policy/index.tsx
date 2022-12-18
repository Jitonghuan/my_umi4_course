import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Empty,Form,Card,Divider,Table,Space ,Popconfirm} from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import AddModal from './add-modal';
import {getSyncStrategyList,useDeleteSyncStrategy} from './hooks';
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
// import {syncOptions} from './type'
import AceDiff from '@/components/ace-diff';
import * as APIS from '../../service';
// import {data} from './mock';
import './index.less'
export default function SyncPolicy(){
    const [loading, setLoading] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);
    const [curSyncType,setCurSyncType]=useState<string>("single")
    const [envCode,setEnvCode]=useState<string>("")
    const [appFilterTableSource,setAppFilterTableSource]=useState<any>([])
    const [nacosNsTableSource,setNacosNsTableSource]=useState<any>([])
    const [nacosConfTableSource,setNacosConfTableSource]=useState<any>([])
    const [jvmParamTableSource,setJvmParamTableSource]=useState<any>([])
    const [type,setType]=useState<string>("")
    const [visible,setVisible]=useState<boolean>(false)
    const [delLoading, deleteSyncStrategy]=useDeleteSyncStrategy()
    const [curRecord,setCurRecord]=useState<any>({})
   
    useEffect(()=>{
        getEnvCode()

    },[])
    const getEnvCode=()=>{
     
        queryCommonEnvCode().then((res:any)=>{
          if(res?.success){
            setEnvCode(res?.data)
            let curEnvCode=res?.data
            if(curEnvCode){
                queryListData(curEnvCode)
            }
            
          }else{
            setEnvCode("")
          }
    
        })
      }
    const queryListData=(envCode:string)=>{
        setLoading(true)
        getSyncStrategyList(envCode).then((res)=>{
            if(res?.success){
                let data=res?.data;
                let appFilterData:any=[];
                let nacosNsData:any=[];
                let nacosConfData:any=[];
                let jvmParamData:any=[];



                data?.map((item:any)=>{
                    if(item?.configType==="appFilter"){
                        appFilterData.push(item)
                    }
                    if(item?.configType==="nacosNs"){
                        nacosNsData.push(item)
                    }
                    if(item?.configType==="nacosConf"){
                        nacosConfData.push({
                            clusterA:item?.configInfo?.clusterA,
                            clusterB:item?.configInfo?.clusterB,
                            description:item?.description

                        })
                    }
                    if(item?.configType==="jvmParam"){
                        jvmParamData.push({
                            clusterA:item?.configInfo?.clusterA,
                            clusterB:item?.configInfo?.clusterB,
                            description:item?.description

                        })
                    }


                })
                setAppFilterTableSource(appFilterData)
                setNacosNsTableSource(nacosNsData)
                setNacosConfTableSource(nacosConfData)
                setJvmParamTableSource(jvmParamData)


            }

        }).finally(()=>{
            setLoading(false)
        })
    }
    return(
        <>
        <AddModal type={type}  envCode={envCode} visible={visible} curRecord={curRecord} onSave={()=>{
            queryListData(envCode)
            setVisible(false)
        }} onClose={()=>{ setVisible(false)} }/>

        <ContentCard>

             <Card size="small" title={<><span>过滤应用</span><span className="title-tooltip">{`A->B:以下应用不会被同步!`}</span></>} extra={<a style={{fontSize:16}} onClick={()=>{
                 setType("app")
                 setVisible(true)
             }}>新增过滤应用</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%" }}>
                <p>
                    <Table  loading={loading} dataSource={appFilterTableSource}>
                    <Table.Column title="应用" dataIndex="configInfo" width={340} ellipsis />
                    <Table.Column title="操作" dataIndex="action" width={140} render={(_,record:any)=>  <Popconfirm
            title="确认删除?"
            onConfirm={() => {
                deleteSyncStrategy({id:record?.id}).then(()=>{
                    queryListData(envCode)
                })
            }}
          >
            <a>删除</a>
          </Popconfirm>} />
                    </Table>
                </p>
               
             </Card>
             <Card size="small" title= {<><span>Nacos命名空间</span><span className="title-tooltip">{`A->B:以下命名空间下的配置将会被同步!`}</span></>} extra={<a style={{fontSize:16}} onClick={()=>{
                 setType("namespace")
                 setVisible(true)
             }}>新增命名空间</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%" }}>
                <p>
                    <Table loading={loading} dataSource={nacosNsTableSource}>
                    <Table.Column title="命名空间" dataIndex="configInfo" width={340} ellipsis />
                    <Table.Column title="操作" dataIndex="action" width={140} render={(_,record:any)=> <Popconfirm
            title="确认删除?"
            onConfirm={() => {
                deleteSyncStrategy({id:record?.id}).then(()=>{
                    queryListData(envCode)
                })
            }}
          >
            <a>删除</a>
          </Popconfirm>} />
                    </Table>
                </p>
               
             </Card>
             <Divider />
             <Card size="small" title= {<><span>配置项</span><span className="title-tooltip">{`A->B:以下Nacos配置项不会被替换!`}</span></>} extra={<a style={{fontSize:16}} onClick={()=>{
                 setType("config")
                 setVisible(true)
                 setCurRecord({})
             }}>新增配置项</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%" }}>
                <p>
                    <Table loading={loading} dataSource={nacosConfTableSource}>
                    <Table.Column title="A集群配置项" dataIndex="clusterA" width={340} ellipsis />
                    <Table.Column title="B集群配置项" dataIndex="clusterB" width={340} ellipsis />
                    <Table.Column title="配置说明" dataIndex="description" width={340} ellipsis />
                    <Table.Column title="操作" dataIndex="action" width={140} render={(_,record:any)=><Space> <a onClick={()=>{
                        setVisible(true)
                        setType("edit-config")
                        setCurRecord(record)
                       
                    }}>编辑</a> <Popconfirm
            title="确认删除?"
            onConfirm={() => {
                deleteSyncStrategy({id:record?.id}).then(()=>{
                    queryListData(envCode)
                })
            }}
          >
            <a>删除</a>
          </Popconfirm></Space>} />
                    </Table>
                </p>
             </Card>
             <Card size="small" title={<><span>配置项</span><span className="title-tooltip">{`A->B:以下JVM配置项不会被替换!`}</span></>} extra={<a style={{fontSize:16}} onClick={()=>{
                 setType("jvm")
                 setVisible(true)
                 setCurRecord({})
             }}>新增JVM参数</a>} headStyle={{background:"#d4e6f7"}} style={{ width: "100%"}}>
                <p>
                    <Table  loading={loading} dataSource={jvmParamTableSource}>
                    <Table.Column title="A集群JVM参数" dataIndex="clusterA" width={340} ellipsis />
                    <Table.Column title="B集群JVM参数" dataIndex="clusterB" width={340} ellipsis />
                    <Table.Column title="配置说明" dataIndex="description" width={340} ellipsis />
                    <Table.Column title="操作" dataIndex="action" width={140} render={(_,record:any)=><Space> <a onClick={()=>{
                        setType("edit-jvm")
                        setVisible(true)
                        setCurRecord(record)
                       
                    }}>编辑</a> <Popconfirm
            title="确认删除?"
            onConfirm={() => {
                deleteSyncStrategy({id:record?.id}).then(()=>{
                    queryListData(envCode)
                })
            }}
          >
            <a>删除</a>
          </Popconfirm></Space>} />
                    </Table>
                </p>
             </Card>

        </ContentCard>

     </>

    )
}