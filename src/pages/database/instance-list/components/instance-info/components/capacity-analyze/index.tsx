
import React, { useEffect, useState,useContext,useMemo } from 'react';
import { Button,Table,Radio,Statistic,Spin } from 'antd';
import VCCardLayout from '@cffe/vc-b-card-layout';
import  DetailContext  from '../../context'
import {useGetCapacityStatistic,useGetAbnormalTableList,useGetTableSpaceList} from './hook'
import {infoLayoutGrid,createAbnormalTableColumns,createSpaceTableColumns} from './schema'
import './index.less';
const rootCls = 'capacity-analyze-compo';
export default function Capacity(){
    const [radioValue,setRadioValue]=useState<string>("table");
    const {clusterId,clusterRole,instanceId,envCode=""} =useContext(DetailContext);
    const [loading, info, getCapacityStatistic]=useGetCapacityStatistic();
    const [tableLoading, dataSource, pageInfo,setPageInfo, getAbnormalTableList] = useGetAbnormalTableList()
    const [spaceTableLoading, spaceDataSource, spacePageInfo,setSpacePageInfo, getTableSpaceList]=useGetTableSpaceList()
    useEffect(()=>{
        if(envCode&&instanceId){
            getCapacityStatistic({envCode,instanceId})
            getAbnormalTableList({envCode,instanceId})
            getTableSpaceList({envCode,instanceId})
        }

    },[])
    const abnormalColumns = useMemo(() => {
        return createAbnormalTableColumns() as any;
      }, []);
    const spaceColumns = useMemo(() => {
        return createSpaceTableColumns() as any;
      }, []);
     const pageSizeClick=(pagination: any)=>{
        setPageInfo({
            pageIndex:pagination.current
          })
      
          let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
          };
          getAbnormalTableList({envCode,instanceId,...obj})
        
     }
     const spaceTablePageSizeClick=(pagination: any)=>{
        setSpacePageInfo({
            pageIndex:pagination.current
          })
      
          let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
          };
          getTableSpaceList({envCode,instanceId,...obj})
        

    }
     const reload=()=>{
        getCapacityStatistic({envCode,instanceId})
        getAbnormalTableList({envCode,instanceId})
        getTableSpaceList({envCode,instanceId})
     }
    
    return (
        <div className={rootCls}>
            <div>
            <div className="table-caption">
            <div className="caption-left">
                  <h3 className={`${rootCls}__title`}>容量概况</h3>
            </div>
            <div className="caption-right">
                <Button type="primary" onClick={reload}>重新分析</Button>
            </div>

           

            </div>
            </div>
            <div>
            <Spin spinning={loading}>
            <VCCardLayout  grid={infoLayoutGrid}>
                <Statistic  title="异常表" value={dataSource?.length||0}  valueStyle={{ color: '#cf1322' }} />
                <Statistic title="近一周日均增长" value={info?.avgDailyIncreases||0}  valueStyle={{ color: '#3f8600' }} />
                <Statistic title="空间可用天数" value={info?.availableTime||0}  />
                <Statistic title="占用空间/总空间" value={`${info?.diskUsed||0} G`} suffix={`/ ${info?.diskCapacity||0} G`}   />
                </VCCardLayout>

            </Spin>
          
            </div>
          
            <div className="abnormal-table">
            <h3 className={`${rootCls}__title`}>异常表</h3>
            <Table columns={abnormalColumns} dataSource={dataSource}
            loading={tableLoading} 
             pagination={{
                current: pageInfo?.pageIndex,
                total:pageInfo?.total,
                pageSize:pageInfo?.pageSize,
                showSizeChanger: true,
                onShowSizeChange: (_, size) => {
                  setPageInfo({
                    pageSize:size,
                    pageIndex:1
                  })
                },
                showTotal: () => `总共 ${pageInfo?.total} 条数据`,
              }}
              onChange={pageSizeClick}
            
            />
            </div>

            <div className="space-table">
                <Radio.Group  optionType="button" buttonStyle="solid"  value={radioValue} onChange={(e)=>{
                    setRadioValue(e.target.value)

                }} options={[
                    // {label:"库空间",value:"database"},
                    {label:"表空间",value:"table"},
                ]}  />
                <div>
                    <Table 
                    columns={spaceColumns} 
                    dataSource={spaceDataSource} 
                    loading={spaceTableLoading}
                    pagination={{
                        current: spacePageInfo?.pageIndex,
                        total:spacePageInfo?.total,
                        pageSize:spacePageInfo?.pageSize,
                        showSizeChanger: true,
                        onShowSizeChange: (_, size) => {
                        
                          setSpacePageInfo({
                            pageSize:size,
                            pageIndex:1
                          })
                        },
                        showTotal: () => `总共 ${spacePageInfo?.total} 条数据`,
                      }}
                      onChange={spaceTablePageSizeClick}
                     />
                </div>
            </div>
        </div>
    )
}