import React, { useMemo, useEffect, useState,useContext } from 'react';
import { Button, Space, Input,Table,Spin,Statistic,message } from 'antd';
import  DetailContext  from '../../../context'
import VCCardLayout from '@cffe/vc-b-card-layout';
import { useGetSnapshot,sessionKill } from "./hook";
import { createTableColumns,createUserTableColumns,createDbTableColumns,createOriginTableColumns } from "./schema";
import { layoutGrid,infoLayoutGrid } from "./type";
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
    useEffect(()=>{
        if (!instanceId) return
       
        getSnapshot({instanceId})
        

    },[instanceId])
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
                <Statistic  title="异常会话" value={snapshotInfo?.wrongSessions||0}  />
                <Statistic title="活跃会话" value={snapshotInfo?.actionSessions||0}  />
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
                            <Input placeholder="活跃会话" style={{ width: 240 }} />
                            <Input placeholder="搜索会话" style={{ width: 240 }} />
                        </Space>

                    </div>
                    <div className="caption-right">
                        <Button type="primary" loading={killLoading} onClick={onSessionKill}>结束选中会话</Button>
                    </div>

                </div>
                <Table 
                columns={columns} 
                key='id'
                scroll={{x:"100%"}}
                dataSource={snapshotInfo?.sessionList||[]}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
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