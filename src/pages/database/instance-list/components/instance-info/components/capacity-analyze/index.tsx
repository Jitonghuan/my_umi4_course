
import React, { useEffect, useState,useContext } from 'react';
import { Button,Table,Radio,Statistic } from 'antd';
import VCCardLayout from '@cffe/vc-b-card-layout';
import  DetailContext  from '../../context'
import {useGetCapacityStatistic} from './hook'
import {infoLayoutGrid} from './schema'
import './index.less';
const rootCls = 'capacity-analyze-compo';
export default function Capacity(){
    const [radioValue,setRadioValue]=useState<string>("database");
    const {clusterId,clusterRole,instanceId} =useContext(DetailContext);
    const [loading, info, getCapacityStatistic]=useGetCapacityStatistic()
    return (
        <div className={rootCls}>
            <div>
            <div className="table-caption">
            <div className="caption-left">
                  <h3 className={`${rootCls}__title`}>容量概况</h3>
            </div>
            <div className="caption-right">
                <Button type="primary">重新分析</Button>
            </div>

           

            </div>
            </div>
            <div>
            <VCCardLayout  grid={infoLayoutGrid}>
                <Statistic  title="异常表" value={info?.DiskCapacity||0}  valueStyle={{ color: '#cf1322' }} />
                <Statistic title="近一周日均增长" value={info?.AvgDailyIncreases||0}  valueStyle={{ color: '#3f8600' }} />
                <Statistic title="空间可用天数" value={info?.AvailableTime||0}  />
                {/* <Statistic title="限流任务" value={snapshotInfo?.wrongSessions||0}  /> */}
                <Statistic title="占用空间" value={info?.DiskUsed||0} suffix={`G`}   />
                  

                </VCCardLayout>
            </div>
          
            <div>
            <h3 className={`${rootCls}__title`}>异常表</h3>
            <Table/>
            </div>

            <div>
                <Radio.Group  optionType="button" buttonStyle="solid"  value={radioValue} onChange={(e)=>{
                    setRadioValue(e.target.value)

                }} options={[
                    {label:"库空间",value:"database"},
                    {label:"表空间",value:"table"},
                ]}  />
                <div>
                    <Table />
                </div>
            </div>
        </div>
    )
}