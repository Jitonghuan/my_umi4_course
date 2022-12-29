import React, { useMemo, useState,} from 'react';
import {Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { Button, Space, Input, Table, Radio, DatePicker, Card,Select,Form,InputNumber } from 'antd';
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
  const options=[{
      label:'开启',
      value:"open"
  },{
    label:'关闭',
    value:"close"

  }
]
export default function LowSqlStatistics(){
    const [timeRange, setTimeRange] = useState<any>([]);
    const [value, setValue] = useState<number | undefined>()
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
           <Card title="慢日志配置" style={{ width: '100%',padding:16 }} extra={<Space>
            <Button type="primary">提交</Button>
            <Button >取消</Button>
           </Space>} >
               <Form layout="inline">
                   <Form.Item name="">
                       <Radio.Group options={options} />
                   </Form.Item>
                   <Form.Item label="保留时间">
                    <InputNumber  min={0} addonAfter="天"/>
                   </Form.Item>


               </Form>
    
           </Card>
        </div>
    )

}