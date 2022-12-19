import React, { useState,useCallback,useEffect} from 'react';
import {Form,Select,Steps, Space,Checkbox,DatePicker} from 'antd';
import { ScheduleOutlined, } from '@ant-design/icons';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import moment from "moment";
import {START_TIME_ENUMS} from './schema';
import './index.less'
const { RangePicker } = DatePicker;
interface ReciverProps{
    getDateValue:(obj:{startTime:string,endTime:string})=>void;

}

export default function DateSelector(props:ReciverProps){
    const {getDateValue}=props
    const [type, setType] = useState<string>("time-interval");
    const [startTime, setStartTime] = useState<string | null>(null)
    const [endTime, setEndTime] = useState<string | null>(null)
    const [form] = Form.useForm();
    const onClear = () => {
        setStartTime(null)
        setEndTime(null)
        getDateValue({
            startTime:'',
            endTime:''
          })
    
    
      }
      const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      };
    
      const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
        return current && current < moment().subtract(1, 'days').endOf('day')
      };
    
      const disabledDateTime = (current:any) => {
      const now = new Date().getTime();
      const curHours= Number(moment(now).hours());
      const curMinutes = Number(moment(now).minutes());
      const curSeconds = Number(moment(now).seconds());
      if(current){
        const curDate = moment(now).endOf("days").date();
             if (current.date() === curDate) {
            return {
              disabledHours: () => range(0, curHours),
              disabledMinutes: () =>  current.hours() === curHours?range(0, curMinutes+1):[],
              disabledSeconds: () => current.minutes() === curMinutes?range(0, curSeconds):[],
            //  disabledSeconds:()=>[]
            }
          }
    
      }
      
      };
      const selectTimeInterval = (timeValue: number|string) => {

        const now = new Date().getTime();
        if(typeof timeValue==="string" &&timeValue==="today"){
          let start = moment(Number(now )).format("YYYY-MM-DD HH:mm:ss");
          let end =moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
          setStartTime(start) 
          setEndTime(end)
          getDateValue({
            startTime:start,
            endTime:end
          })
    
    
    
        }else if(typeof timeValue==="number"){
          let end =moment(Number((now + timeValue))).format("YYYY-MM-DD HH:mm:ss") ;
          let start = moment(Number(now )).format("YYYY-MM-DD HH:mm:ss");
          setStartTime(start) 
          setEndTime(end)
          getDateValue({
            startTime:start,
            endTime:end
          })
    
    
    
        }
      
       
       
       
      }
        //选择时间间隔
  const selectTime = (time: any, timeString: any) => {
    let start=moment(timeString[0]).add(2, "minutes").format("YYYY-MM-DD HH:mm:ss")
    let end=moment(timeString[1]).add(2, "minutes").format("YYYY-MM-DD HH:mm:ss")
     if (start !== 'NaN' && end !== 'NaN') {
       setStartTime(start);
       setEndTime(end);
       getDateValue({
        startTime:start,
        endTime:end
      })


     }
   }
    
    return(
        <div>
            <Form form={form} className="change-apply-form" >
            <Space style={{ height: 20 }}>
              {type === "time-interval" ? (<Form.Item name="versionRangeOne" rules={[{ required: true, message: '请选择' }]}  >
                <Select options={START_TIME_ENUMS} allowClear showSearch onChange={selectTimeInterval} onClear={onClear}  style={{ width: 220 }} />
              </Form.Item>) :<RangePicker   
               onChange={(v: any, b: any) => selectTime(v, b)}
               showNow={false}
               disabledDate={disabledDate}
               //@ts-ignore
               disabledTime={disabledDateTime}
               format="YYYY-MM-DD HH:mm:ss" showTime />}

               {type === "time-interval" ? (
                  <Form.Item>
                    <ScheduleOutlined style={{ marginLeft: '5px', fontSize: 18, }} onClick={() => {
                       setType("time-ranger")
                     
                      setEndTime(null)
                      setStartTime(null)
                      getDateValue({
                        startTime:'',
                        endTime:''
                      })
                
                
                      form.setFieldsValue({
                      
                        versionRangeOne: null
                      })
                     

                    }} />
                  </Form.Item>

                ) : (
                  <Form.Item>
                    <ScheduleOutlined style={{ marginLeft: '5px', fontSize: 18 }} onClick={() => {
                    
                      setType("time-interval")
                      setEndTime(null)
                      setStartTime(null)
                      getDateValue({
                        startTime:'',
                        endTime:''
                      })
                
                
                     form.setFieldsValue({
                     
                       versionRangeOne:null
                      })
                    }} />
                  </Form.Item>
                )}


            </Space>

            </Form>
            
        </div>
    )
}