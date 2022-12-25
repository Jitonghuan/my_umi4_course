import React, { useMemo, useState,useEffect } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { QuestionCircleOutlined,PlusSquareOutlined,MinusSquareOutlined } from "@ant-design/icons";
import { Space, Form, Button, Modal, Table, message,Tabs,InputNumber,Select,Alert,Radio,DatePicker } from 'antd';
import AceEditor from '@/components/ace-editor';
import {addSessionRateLimit,getSqlTemplate,useGetSessionRateLimitList,closeDownRateLimiter,updateRateLimiter,useGetRunSessionList} from '../hook'
import {createSqlTableColumns,createEndTableColumns} from '../schema'
import { history } from 'umi';
const { TabPane } = Tabs;
const tabs=[
    {
        label:"创建",
        value:"create"
    },
    {
        label:"运行",
        value:"run"   
    },
    {
        label:"已结束",
        value:"end"   

    }
]
const options = [
  { label: '关键字', value: 'Apple' },
  { label: 'sql指纹', value: 'Pear' },
 
];
const timeOptions=[
  {label:"近1小时",value:"1hour"},
  {label:"近12小时",value:"12hours"},
  {label:"近1天",value:"1days"},
  {label:"近2天",value:"2days"},
  {label:"近7天",value:"7days"},
]
interface Iprops{
    mode:EditorMode;
    onClose:()=>void;
    onSave:()=>void;
    instanceId:number;
 

}
const { RangePicker } = DatePicker;
export default function SQLLimit(props:Iprops) {
  const {mode,onClose,onSave,instanceId,} =props
  const [form] = Form.useForm();
  const [loading,setLoading]=useState<boolean>(false)
  const [tabActiveKey, setTabActiveKey] = useState<string>('create');
  const [tableLoading, endDataSource,endPageInfo, getSessionRateLimitList]=useGetSessionRateLimitList()
  const [runLoading, dataSource,pageInfo, getRunSessionList]=useGetRunSessionList()
  const [sql,setSql]= useState<string>('');
  const [disabled,setDisabled]=useState<boolean>(true)
  const [initData,setInitData]=useState<any>({})
  const [isUpdate,setIsUpdate]=useState<boolean>(false)
  const columns = useMemo(() => {
    return createSqlTableColumns({
      onClose:(record:any)=>{
        close(record?.id)
      },
      onUpdate:(record:any)=>{
        setIsUpdate(true)
        setInitData(record)
        setTabActiveKey('create')
        form.setFieldsValue({
          ...record
          })
      }
    }) as any;
  }, []);
  const endColumns= useMemo(() => {
    return createEndTableColumns() as any;
  }, []);
  useEffect(()=>{
    return()=>{
      setIsUpdate(false)
      form.resetFields()
      setSql("")
    }
  },[mode])

  const handleSubmit=async()=>{
    setLoading(true)
    const values=await form.validateFields()
    if(mode==="ADD"&&!isUpdate){
      addSessionRateLimit({
        ...values,
        instanceId,
        SqlTemplate:sql
      }).then((res)=>{
        if(res?.success){
          message.success('添加成功！')
          onSave()
  
        }
  
      }).finally(()=>{
        setLoading(false)
      })

    }
   
    if(isUpdate){
      updateRateLimiter({
        ...values,
        instanceId,
        SqlTemplate:sql,
        id:initData?.id
        

      }).then((result)=>{
      if(result?.success){
        message.success('修改成功！')
        
        setTabActiveKey('end')
      }

    }).finally(()=>{
      setLoading(false)
    })

    }

  }
  
  useEffect(()=>{
    if(tabActiveKey==="end"){
      getSessionRateLimitList({instanceId,runStatus:2})

    }
    if(tabActiveKey==="run"){
      getRunSessionList({instanceId,runStatus:1})
    }

  },[tabActiveKey])
  
  const close=(id:number)=>{
    closeDownRateLimiter(id).then((res)=>{
      if(res?.success){
        message.success("关闭成功！")
        getRunSessionList({instanceId,runStatus:1})
      }

    })
  }
  const getSql=()=>{
    const sql= form.getFieldsValue()?.sqlKeyWords
    setSql("")
    getSqlTemplate(sql).then((res)=>{
      
      if(res?.success){
        setSql(res?.data||"")
       

      }

    })
  }

  // useEffect(()=>{
  //   if(form.getFieldValue("sqlKeyWords")){
     
  //     setDisabled(false)
  //   }
  // },[form.getFieldValue("sqlKeyWords")])
  useEffect(()=>{

  },[mode])

  return (
   
    
      <Modal
        title={<span>SQL限流<QuestionCircleOutlined /></span>}
        width={980}
        visible={mode!=="HIDE"}
        onCancel={onClose}
        onOk={handleSubmit}
        confirmLoading={loading}
        footer={[
          <Button onClick={handleSubmit}>{isUpdate?"修改":"确认"}</Button>,
          <Button onClick={onClose}>取消</Button>,
        ]}
      >
          <Tabs   activeKey={tabActiveKey}
            onChange={(key) => {
              setTabActiveKey(key);
            }}>
                 {tabs?.map((item: any, index: number) => (
                <TabPane tab={item.label} key={item.value}></TabPane>
              ))}
              
          </Tabs>
      {tabActiveKey==="create"&&<Form labelCol={{ flex: '110px' }} form={form}>
          <Form.Item label="限流模式" name="limitMode" rules={[{ required: true, message: '这是必填项' }]}>
           <Radio.Group options={options}  disabled={isUpdate} />
          </Form.Item>
          <Form.Item label="SQL类型" name="sqlType"  rules={[{ required: true, message: '这是必填项' }]}>
            <Select style={{ width: 320 }} disabled={isUpdate}  />
          </Form.Item>
          <Form.Item label="最大并发度" name="maxiConcurrency" rules={[{ required: true, message: '这是必填项' }]} tooltip="">
         
            <InputNumber  />
        
          </Form.Item>
        <div style={{display:'flex'}}>
          <Form.Item label="限流时间"  style={{ width: '18%' }} name="limitTime" rules={[{required:true,message:'这是必填项'}]} >
          <InputNumber  />
          </Form.Item>
          <span style={{marginLeft:40,marginTop: 4,display:'inline-block'}}>
           <span>分钟</span> <span style={{color:'red'}}>(限流是应急措施，问题解决后，请及时关闭)</span>
          </span>

        </div>
    
        <div style={{display:'flex'}}>
          <Form.Item label="SQL关键字" name="sqlKeyWords" style={{ width: '88%' }} rules={[{required:true,message:'这是必填项'}]} >
         
            <AceEditor  height={200} mode="sql"  />
          </Form.Item>
          <div style={{marginTop:100}}>
            <Button type="primary" onClick={getSql} >关键字生成与校验</Button>
          </div>
          </div>
          <Form.Item  style={{marginLeft:108}}>
          <Alert message="限流关键词示例" type="info" 
           description={<><p>原始语句：SELECT * FROM test where name = 'das'</p>
           <p>关键词:SELECT~FROM~test~where~name (也可以带上具体参数，即增加"～das"）</p></>}
          showIcon />
          
          </Form.Item>
        </Form>}  
        {tabActiveKey==="run"&&<div>
          <div>
            <Button type="primary" onClick={()=>{
               getRunSessionList({instanceId,runStatus:1})
            }}>
              刷新
            </Button>
          </div>
         <Table columns={columns}  dataSource={dataSource||[]} loading={tableLoading}/>
          </div>}
        {tabActiveKey==="end"&&<div>
        <div>
          <div className="table-caption">
            <div className="caption-left">
            <Button type="primary" onClick={()=>{
               getSessionRateLimitList({instanceId,runStatus:2})
            }}>
              刷新
            </Button>
            </div>
            <div className="caption-right">
            <Space>
                           <Radio.Group optionType="button" buttonStyle="solid" options={timeOptions} />
                           <RangePicker />
                           <Button type="primary">查看</Button>
                       </Space>

            </div>

          </div>
          

           
          </div>
        <Table columns={endColumns}  dataSource={endDataSource} loading={tableLoading}/>
          </div>}
      </Modal>
   
  );
}
