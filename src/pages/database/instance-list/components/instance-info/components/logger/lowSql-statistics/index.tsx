import React, { useMemo, useState,useContext,useEffect} from 'react';
import {Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { Button, Space, Input, Table, Radio, DatePicker, Tooltip,Select } from 'antd';
import {useGetSlowLogList} from '../hook'
import  DetailContext  from '../../../context';
import {lowSqlStatisticsColumns} from '../schema'
import { useGetSchemaList } from '../../../../../../account-manage/hook';
import moment from 'moment';
const { RangePicker } = DatePicker;
export const START_TIME_ENUMS = [
    {
        label: '近15分',
        value: 15 * 60 ,
      },
      {
        label: '半小时',
        value: 30 * 60 ,
      },
      {
        label: '半小时',
        value: 60 * 60 ,
      },

    {
      label: '近1天',
      value: 24 * 60 * 60 ,
    },
  
  
  ];
export default function LowSqlStatistics(){
    const [timeRange, setTimeRange] = useState<any>([]);
    const [value, setValue] = useState<number|undefined>(15 * 60 );
    const [type,setType]=useState<string>("time-recent")
    const {clusterId,clusterRole,instanceId,envCode=""} =useContext(DetailContext);
    const [tableLoading, dataSource, pageInfo,setPageInfo, getSlowLogList] = useGetSlowLogList()
    const [database,setDatabase]=useState<string>("")
    const [loading, schemaOptions, getSchemaList] = useGetSchemaList();
    const columns = useMemo(() => {
      return lowSqlStatisticsColumns() as any;
    }, []);
    const getDataSource=(params:{
      start?:string,
      end?:string,
      pageSize?:number,
      pageIndex?:number,
      database?:string
    })=>{
      const now=Date.parse(new Date())/1000;
      let start = Number((now - value));
      let end = Number(now)
      let startTime=type==="time-recent"?start+"": moment(timeRange[0]).unix() + '';
      let endTime=type==="time-recent"?end+"": moment(timeRange[1]).unix() + '';
      let curPageSize=params?.pageSize?params?.pageSize:pageInfo?.pageSize
      let curPageIndex=params?.pageIndex?params?.pageIndex:pageInfo?.pageIndex
      getSlowLogList({
        ...params,
        envCode,
        instanceId,
        database:params?.database?params?.database:database,
        start: params?.start?params?.start:startTime,
        end:params?.end?params?.end:endTime,
        pageIndex:curPageIndex,
        pageSize:curPageSize
      });


    }

    
    const onTimeChange = (value: any) => {
        setTimeRange(value);
        setType("time-range")
        setValue(undefined)
        getDataSource({
          start: value && value[0] ? moment(value[0]).unix() + '' : undefined,
          end: value && value[1] ? moment(value[1]).unix() + '' : undefined,
          pageSize:pageInfo?.pageSize,
          pageIndex:pageInfo?.pageIndex,
        })
       
      };
      const onChange = (e: number) => {
        setTimeRange([])
        setType("time-recent")
        setValue(e)
        const now=Date.parse(new Date())/1000;
        let start = Number((now - e));
        let end = Number(now)
        getDataSource({
          start: start + "",
          end: end + "",
         
        })
      
      }
      const pageSizeClick=(pagination: any)=>{
        setPageInfo({
            pageIndex:pagination.current
          })
      
          let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
          };
         
          getDataSource({...obj})
        
     }
     useEffect(()=>{ 
       if(clusterId){
        getSchemaList({clusterId})

       }
        
      return()=>{
        setType("time-recent")
      }
       },[clusterId])
     useEffect(()=>{
     
        // const now = new Date().getTime();
        const now=Date.parse(new Date())/1000;
        let start = Number((now - 15 * 60 ));
        let end = Number(now)
        getDataSource({
          start: start + "",
          end: end + "",
        })

     },[])
     
    return(
        <div>
           <div className="table-caption">
        <div className="caption-left">
         
         数据库：<Select  showSearch allowClear style={{width:220}} loading={loading}  placeholder="请选择数据库" value={database} options={schemaOptions} onChange={(value)=>{
           setDatabase(value)
           getDataSource({
            database:value
          })

         }}/>
        </div>
        <div className="caption-right">
          <Space>
            <Radio.Group optionType="button" buttonStyle="solid" options={START_TIME_ENUMS} value={value} onChange={(e) => { onChange(e.target.value) }} />
            <RangePicker onChange={onTimeChange}
              value={timeRange}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss" />
            {/* <Button type="primary">查看</Button> */}
          </Space>
        </div>
        

      </div>
        <div>
            <Table dataSource={dataSource} 
             loading={tableLoading} 
             columns={columns}
             expandable={{
              expandedRowRender: record => <p style={{ margin: 4 }}>{record?.sample}</p>,
             
            }}
             pagination={{
                current: pageInfo?.pageIndex,
                total:pageInfo?.total,
                pageSize:pageInfo?.pageSize,
                showSizeChanger: true,
                pageSizeOptions:[30,50,100],
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
        </div>
    )

}