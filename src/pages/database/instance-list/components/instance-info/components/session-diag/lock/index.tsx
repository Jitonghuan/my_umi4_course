import React, { useMemo, useEffect, useState,useContext } from 'react';
import { Button, Space, Input,Table,Radio ,DatePicker,Tooltip} from 'antd';
import VCCardLayout from '@cffe/vc-b-card-layout';
import {getLockSession} from '../manage/hook'
import  DetailContext  from '../../../context'
import './index.less';
const rootCls = 'Lock-analyze-compo';
const options=[
    {label:"近1天",value:"1days"},
    {label:"近3天",value:"3days"},
    {label:"近1周",value:"7days"},
]
const { RangePicker } = DatePicker;
export default function LockAnalyze(){
    const {clusterId,clusterRole,instanceId} =useContext(DetailContext);
    const [dataSource,setDataSource]=useState<any>([])
    const [loading,setLoading]=useState<boolean>(false)
    useEffect(()=>{
        if(!instanceId) return
        if(instanceId){
            getDataSource()
        }
    },[])
    const getDataSource=()=>{
        setLoading(true)
        setDataSource([])
        getLockSession(instanceId).then((res)=>{
            if(res?.success){
                setDataSource(res?.data||[])
            }

        }).finally(()=>{
            setLoading(false)
        })
    }
    return (
        <div>
              <div className="table-caption">
                    <div className="caption-left">
                        <Button type="primary">刷新</Button>
                    </div>
                    <div className="caption-right">
                       <Space>
                           <Radio.Group optionType="button" buttonStyle="solid" options={options} />
                           <RangePicker />
                           <Button type="primary">查看</Button>
                       </Space>
                    </div>
                    
                </div>
                <div>
                        <Table dataSource={dataSource} bordered
                        loading={loading}
                        scroll={{x:'100%'}}
                        locale={{
                            emptyText: (
                              <div className="custom-table-holder">
                                {loading ?  '加载中……': dataSource?.length<1 ? '没有数据' :" "
                            })
                              </div>
                            ),
                          }}
                        >
                        {dataSource?.length > 0 && (
                                Object.keys(dataSource[0])?.map((item: any) => {
                                    return (
                                        <Table.Column title={item}  dataIndex={item} key={item} ellipsis={true}  render={(value) => (
                                            <Tooltip placement="topLeft" title={value}>
                                              {value}
                                            </Tooltip>
                                          )} />
                                    )
                                })

                            )}
                        </Table>
                    </div>

            
        </div>
    )
}