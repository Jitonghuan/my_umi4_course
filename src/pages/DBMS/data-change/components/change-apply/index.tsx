import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Tabs, Form, Select, message, DatePicker, Input, Divider, Space, Radio } from 'antd';
import { InfoCircleOutlined, } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { getRequest} from '@/utils/request';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import { ScheduleOutlined, } from '@ant-design/icons';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { START_TIME_ENUMS, options,sqlWfTypeOptions } from "./schema"
import {queryTableFieldsApi} from '../../../common-service'
import { useEnvList, useInstanceList, useQueryDatabasesOptions, useQueryTableFieldsOptions, useQueryTablesOptions } from '../../../common-hook'
import RightContent from "./_components/right-content"
import { createSql } from './hook';
import { history } from 'umi';
import './index.less'
import moment from "moment";
const { RangePicker } = DatePicker;
interface querySqlItems {
  sqlContent?: string;
  dbCode?: string;
  tableCode?: string;
  title?: string;
  // sqlWfType?:string;
  envCode?: string;
  instanceId?: number;
  runStartTime?: string;
  runEndTime?: string;
  runMode?: string;


}
export default function ResizeLayout() {
  const [type, setType] = useState<string>("time-interval");
  const [startTime, setStartTime] = useState<string | null>(null)
  const [endTime, setEndTime] = useState<string | null>(null)
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState(false);
  const [envOptionLoading, envOptions, queryEnvList] = useEnvList();
  const formRef = useRef<any>(null)
  const [instanceLoading, instanceOptions, getInstanceList] = useInstanceList();
  const [databasesOptionsLoading, databasesOptions, queryDatabases, setSource] = useQueryDatabasesOptions()
  const [tablesOptionsLoading, tablesOptions, queryTables, setTablesSource] = useQueryTablesOptions();
  //const [loading, tableFields, tableFieldsOptions, queryTableFields] = useQueryTableFieldsOptions();
  // const [start, setStart] = useState<string>("")
  // const [end, setEnd] = useState<string>("")
  const [fields,setFields]=useState<any>([])

  const queryTableFields = async (params:{dbCode:string,tableCode:string}) => {
   
    await getRequest(queryTableFieldsApi, { data: params})
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data?.fields||[];
          let dataObject: any = {};
          dataSource?.map((item: any) => {
            dataObject[item]=item
          });
          tablesOptions?.map((ele:any)=>{
            dataObject[ele?.value]=ele?.value
          })
          setFields(dataObject); 
        }
      })
  }
  
  //选择时间间隔
  const selectTime = (time: any, timeString: any) => {
   let start=moment(timeString[0]).add(2, "minutes").format("YYYY-MM-DD HH:mm:ss")
   let end=moment(timeString[1]).add(2, "minutes").format("YYYY-MM-DD HH:mm:ss")
    // setStart(start)
    // setEnd(end)
    if (start !== 'NaN' && end !== 'NaN') {
      setStartTime(start);
      setEndTime(end);
    }
  }

  const selectTimeInterval = (timeValue: number|string) => {

    const now = new Date().getTime();
    if(typeof timeValue==="string" &&timeValue==="today"){
      let start = moment(Number(now )).format("YYYY-MM-DD HH:mm:ss");
      let end =moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      setStartTime(start) 
      setEndTime(end)



    }else if(typeof timeValue==="number"){
      let end =moment(Number((now + timeValue))).format("YYYY-MM-DD HH:mm:ss") ;
      let start = moment(Number(now )).format("YYYY-MM-DD HH:mm:ss");
      setStartTime(start) 
      setEndTime(end)

    }
  
   
   
   
  }



  useEffect(() => {
    queryEnvList()
    // getInstanceList()
    return () => {
      setEndTime("")
      setType("time-interval")
    }

  }, [])
  const onClear = () => {
    setStartTime(null)
    setEndTime(null)
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
  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };
  
  const createSqlApply = useCallback(async (params: querySqlItems) => {
   
    const createItems = form?.getFieldsValue()
    if (!endTime || !startTime || !createItems?.title || !createItems?.instanceId || !createItems?.dbCode || !params?.sqlContent) {
      message.warning("请先进行信息填写且输入sql语句再提交变更！")
      return

    }
    setSqlLoading(true)
    await createSql({
      ...params,
      ...createItems,
      runEndTime: endTime,
      runStartTime: startTime,
      allowTiming:value
    }).then((res) => {
      if (res?.success) {
        message.success("提交成功！")
        history.push({
          pathname: "/matrix/DBMS/data-change"
        })

      } else {
        return
      }

    }).finally(() => {
      setSqlLoading(false)
    })
  }, [startTime,endTime,value])

  const leftContent = useMemo(() => {
    return (
      <div className="change-apply-form">
        <Form layout="vertical" form={form} ref={formRef}  >
          <Form.Item name="title" label="标题：" rules={[{ required: true, message: '请填写' }]}>
            <Input placeholder="标题" />
          </Form.Item>
          <Form.Item name="sqlWfType" label="变更类型：" rules={[{ required: true, message: '请填写' }]}>
            <Select placeholder="选择变更类型" options={sqlWfTypeOptions}/>
          </Form.Item>
          {/* <Form.Item name="sqlWfType">
                <Select  placeholder="数据变更" options={sqlWfTypeOptions}/>
              </Form.Item> */}
          <Form.Item name="envCode" label="环境：" rules={[{ required: true, message: '请填写' }]}>
            <Select placeholder="选择环境" allowClear showSearch loading={envOptionLoading} options={envOptions} onChange={(value) => {
              getInstanceList(value)
              form?.setFieldsValue({
                instanceId: "",
                dbCode: "",
                tableCode: ""
              })
            }} />
          </Form.Item>
          <Form.Item name="instanceId" label="实例：" rules={[{ required: true, message: '请填写' }]}>
            <Select placeholder="选择实例" 
             options={instanceOptions} allowClear showSearch loading={instanceLoading} onChange={(instanceId) => {
              queryDatabases({ instanceId })
              form?.setFieldsValue({
                dbCode: "",
                tableCode: ""
              })


            }}
            filterOption={(input, option) => {
              //@ts-ignore
              return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }} />
          </Form.Item>
          <Form.Item name="dbCode" label="库：" rules={[{ required: true, message: '请填写' }]}>
            <Select placeholder="选择库" 
            options={databasesOptions} allowClear showSearch loading={databasesOptionsLoading} onChange={(dbCode) => {
              queryTables({ dbCode, instanceId: form?.getFieldsValue()?.instanceId })
              form?.setFieldsValue({
                tableCode: ""
              })
            }} />
          </Form.Item>
         
          <Form.Item name="tableCode" label="表：" >
            <Select placeholder="选择表" options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={() => {
              const values = form?.getFieldsValue();
              queryTableFields({ ...values })

            }} />
          </Form.Item>
          <Form.Item name="remark" label="理由：" >
            <Input placeholder="上线理由" />
          </Form.Item>
          {/* <Form.Item name="runMode">
              <Select  placeholder="执行方式" options={runModeOptions}/>
              </Form.Item> */}
          <Form.Item label="执行时间：" className="nesting-form-item">
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
                     form.setFieldsValue({
                     
                       versionRangeOne:null
                      })
                    }} />
                  </Form.Item>
                )}


            </Space>
           
          </Form.Item>
         
          <Form.Item name="allowTiming" label="是否允许定时执行:" rules={[{ required: true, message: '请填写' }]}>
            <Radio.Group options={options} onChange={onChange3} value={value} />
          </Form.Item>
        </Form>
        <Divider />
        <div className="info-alert">
          <p><InfoCircleOutlined style={{ color: "#6495ED", fontSize: 24 }} />&nbsp;<span style={{ color: "#6495ED", fontSize: 20 }}><b>说明</b></span></p>
          <p> 1.多条SQL, 请用英文分号隔开。</p>
          <p style={{ whiteSpace: "break-spaces" }}>2.请不要编写对数据库不友好的SQL，以免影响线上业务运行。</p>
          <p>3. 表结构变更和数据订尽量分别提工单。</p>
          {/* <p>4. <b>离线变更</b>指的是发布sql到不同外网的环境。</p>
               <p>5. <b>数据变更</b>指的是发布sql到当前环境</p> */}
        </div>
      </div>

    )
  }, [formRef, databasesOptions, tablesOptions, instanceOptions, envOptions, envOptionLoading, tablesOptionsLoading, databasesOptionsLoading, instanceLoading, startTime, endTime,type,value,])

  const rightContent = useMemo(() => {
    return (
      <>
        <RightContent tableFields={fields} createItems={form?.getFieldsValue()} createSql={(params: { sqlContent: string }) => createSqlApply(params)} sqlLoading={sqlLoading} />
      </>
    )
  }, [fields, formRef, form?.getFieldsValue(),sqlLoading]);

  return (
    <PageContainer>
      <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        initWidth={300}
        least={20}
        dataChangeinitWidth={330}
      />
    </PageContainer>


  );
}
