import React, { useMemo, useEffect, useState,useContext } from 'react';
import { Button, Space, Input,Table,Spin,Statistic,message,Select,Popconfirm } from 'antd';
import  DetailContext  from '../../../context'
import VCCardLayout from '@cffe/vc-b-card-layout';
import { useGetSnapshot,sessionKill } from "./hook";
import { createTableColumns,createUserTableColumns,createDbTableColumns,createOriginTableColumns } from "./schema";
import { layoutGrid,infoLayoutGrid } from "./type";
import { debounce } from 'lodash';
import SqlLimit from './sql-limit-modal'

import './index.less';
const rootCls = 'session-manage-compo';

export default function SessionManage() {
    const {clusterId,clusterRole,instanceId} =useContext(DetailContext);
    const [snapshotLoading, snapshotInfo, getSnapshot]=useGetSnapshot()
    const [rowSelected, setRowSelected] = useState<any>([])
    const [killLoading,setKillLoading]=useState<boolean>(false)
    const [visible,setVisible]=useState<boolean>(false)
    const [mode,setMode]=useState<EditorMode>("HIDE")
    const [originData,setOriginData]= useState<any>([])
    useEffect(()=>{
        if (!instanceId) return
       
        getSnapshot({instanceId})
        

    },[instanceId])
    useEffect(()=>{
        if(snapshotInfo?.sessionList?.length){
            let data=JSON.parse(JSON.stringify(snapshotInfo?.sessionList))
            setOriginData(data)

        }

    },[snapshotInfo?.sessionList?.length])
    const columns = useMemo(() => {
        return createTableColumns() as any;
      }, []);
     
      const userColumns = useMemo(() => {
        return createUserTableColumns() as any;
      }, []);
      const dbColumns = useMemo(() => {
        return createDbTableColumns() as any;
      }, []);
      const originColumns = useMemo(() => {
        return createOriginTableColumns() as any;
      }, []);
      const rowSelection = {
        // defaultSelectedRowKeys: defaultRow,
        selectedRowKeys:rowSelected,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setRowSelected(selectedRowKeys)
           
        },

    };

    const onSessionKill=()=>{
        setKillLoading(true)
        sessionKill({
            instanceId,
            sessionId:rowSelected
        }).then((res)=>{
            if(res?.success){
                message.success("结束会话成功!")
                getSnapshot({instanceId})
            }

        }).finally(()=>{
            setKillLoading(false)
        })
    }
    
    const filter = debounce((value) => onSearch(value), 500)
    const onSearch=(value:string)=>{
       let data:any=[]
       if(!value){
        setOriginData(snapshotInfo?.sessionList)
       }
       if(value){
        (snapshotInfo?.sessionList||[])?.map((ele:any)=>{
            if(ele?.user?.indexOf(value)>-1){
                data.push(ele)
            }
            if(ele?.host?.indexOf(value)>-1){
                data.push(ele)
            }
            if(ele?.db?.indexOf(value)>-1){
                data.push(ele)
            }
            if(ele?.command?.indexOf(value)>-1){
                data.push(ele)
            }
            if(ele?.state?.indexOf(value)>-1){
                data.push(ele)
            }
            if(ele?.sql?.indexOf(value)>-1){
                data.push(ele)
            }
        })

        const dataSource=[...new Set(data)]
        setOriginData(dataSource)


       }
      
       
     

        //setOriginData

    }
    const querySearch=(value:string)=>{
        let data:any=[]
        if(value==="all"){
            setOriginData(snapshotInfo?.sessionList)
        }
        if(value==="active"){
            (snapshotInfo?.sessionList||[])?.map((ele:any)=>{
                if(ele?.trxRunTime&&ele?.trxRunTime!==0){
                    data.push(ele)
                }
            })
            setOriginData(data)
        }
        if(value==="error"){
            (snapshotInfo?.sessionList||[])?.map((ele:any)=>{
                if(ele?.trxRunTime>120){
                    data.push(ele)
                }
            })
            setOriginData(data)

        }

    }

    return (
        <div className={rootCls}>
            <SqlLimit mode={mode} 
            instanceId={instanceId}
            onClose={()=>{setMode("HIDE")}}
            onSave={()=>{setMode("HIDE");  getSnapshot({instanceId})}}
             />
            <div>
                <div className="table-caption">
                    <div className="caption-left">
                        <h3 className={`${rootCls}__title`}>实时会话</h3>
                    </div>
                    <div className="caption-right">
                        <Button type="primary" onClick={()=>{
                              getSnapshot({instanceId})
                        }}>刷新</Button>
                    </div>

                </div>
                <Spin spinning={snapshotLoading}>
                <VCCardLayout  grid={infoLayoutGrid}>
                <Statistic  title="异常会话" value={snapshotInfo?.wrongSessions||0}  valueStyle={{ color: '#cf1322' }} />
                <Statistic title="活跃会话" value={snapshotInfo?.actionSessions||0}  valueStyle={{ color: '#3f8600' }} />
                <Statistic title="会话总数" value={snapshotInfo?.sessionTotal||0}  />
                {/* <Statistic title="限流任务" value={snapshotInfo?.wrongSessions||0}  /> */}
                <Statistic title="连接使用率/最大连接数" value={snapshotInfo?.connectUsage||0} suffix={`/ ${snapshotInfo?.maxConnect||0}`}   />
                    
                    {/* <div className="session-card"></div>
                    <div className="session-card"></div>
                    <div className="session-card"></div>
                    <div className="session-card"></div>
                    <div className="session-card"></div> */}

                </VCCardLayout>

                </Spin>
                
            </div>

            <div className="sql-limiting">
                <div className="table-caption">
                    <div className="caption-left">
                        <Space>
                            <Button type="primary" onClick={()=>{
                                setMode("ADD")
                            }}>SQL限流</Button>
                            <Select placeholder="活跃会话"  defaultValue={'all'} style={{ width: 200 }} onChange={querySearch} options={[{
                                label:"全部会话",
                                value:"all"

                            },{
                                label:"活跃会话",
                                value:"active"
                            },{
                                label:"异常会话",
                                value:"error"
                            }]} />
                            <Input placeholder="搜索会话" style={{ width: 280 }} onKeyUp={(e)=>{
                              
                              filter(e.target.value)

                            }}  />
                        </Space>

                    </div>
                    <div className="caption-right">
                    <Popconfirm
                    title="确认结束会话吗?"
                    onConfirm={onSessionKill}
                      >
            <Button type="primary" loading={killLoading} >结束选中会话</Button>
          </Popconfirm>
                       
                    </div>
                </div>
               
                <Table 
                columns={columns} 
                // key='index'
                rowKey="id"
                // rowKey
                scroll={{x:"100%"}}
                dataSource={originData||[]}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                pagination={{
                   
                    showTotal: (total) => `总共 ${snapshotInfo?.sessionList?.length} 条数据`,
                    showSizeChanger: true,
                    // size: 'small',
                    // defaultPageSize: 20,
                  }}
                 />
            </div>
           
           
            <div className="sql-statistics">
            <h3 className={`${rootCls}__title`}>会话统计</h3>
            <VCCardLayout grid={layoutGrid} className="session-manage-content">
                <Table 
                title={()=><span className="table-title">按用户统计</span>} 
                dataSource={snapshotInfo?.statByUser||[]}
                columns={userColumns}
                />
                <Table title={()=><span className="table-title">按访问来源统计</span>} columns={originColumns} dataSource={snapshotInfo?.statByHost||[]}/>
                <Table title={()=><span className="table-title">按数据库统计</span>} columns={dbColumns} dataSource={snapshotInfo?.statByDB||[]}/>
            </VCCardLayout>

            </div>
        </div>
    )
}