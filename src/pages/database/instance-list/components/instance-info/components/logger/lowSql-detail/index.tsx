import React, { useMemo, useState,} from 'react';
import {Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { Button, Space, Input, Table, Radio, DatePicker, Tooltip,Select } from 'antd';
import {useGetSlowLogDetail} from '../hook'
import moment from 'moment';
const { RangePicker } = DatePicker;
export const START_TIME_ENUMS = [
    {
        label: '近15分',
        value: 15 * 60 * 1000,
      },
      {
        label: '半小时',
        value: 30 * 60 * 1000,
      },
      {
        label: '半小时',
        value: 60 * 60 * 1000,
      },

    {
      label: '近1天',
      value: 24 * 60 * 60 * 1000,
    },
  
  
  ];
export default function LowSqlStatistics(){
    const [timeRange, setTimeRange] = useState<any>([]);
    const [value, setValue] = useState<number | undefined>()
    const [tableLoading, dataSource, pageInfo,setPageInfo, getSlowLogDetail] = useGetSlowLogDetail()
    const onTimeChange = (value: any) => {
        setTimeRange(value);
        setValue(undefined)
        // getDataSource({
    
        //   startTime: value && value[0] ? moment(value[0]).unix() + '' : undefined,
        //   stopTime: value && value[1] ? moment(value[1]).unix() + '' : undefined,
        // });
      };
      const onChange = (e: number) => {
        setTimeRange([])
        setValue(e)
        const now = new Date().getTime();
        let start = Number((now - e));
        let end = Number(now)
        // getDataSource({
        //   startTime: start + "",
        //   stopTime: end + ""
        // })
    
      }
    return(
        <div>
                 <div className="table-caption">
        <div className="caption-left">
         
         数据库：<Select  style={{width:220}} placeholder="请选择数据库"/>
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
            <Table />
        </div>
        </div>
    )

}