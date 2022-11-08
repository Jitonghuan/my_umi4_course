import React, { useMemo, useState,useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Table, Space, Form,Select,Input } from 'antd';
import { createTableColumns } from './schema';
import { FilterCard,ContentCard } from '@/components/vc-page-content';
import {queryEnvList} from './hook';
import {history } from 'umi'
import './index.less'

export default function AppTrafficList() {
  const [form] = Form.useForm();
  const [envOptions,setEnvOptions] = useState([]);
  const [curEnv,setCurEnv]=useState<any>({});
  const [curEnvCode,setCurEnvCode]=useState<string>("");
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [envOptionsLoading, setEnvOptionsLoading] = useState<boolean>(false);
  useEffect(()=>{
    getEnvOptions()
  },[])
  const getEnvOptions=()=>{
    setEnvOptionsLoading(true)
    queryEnvList().then((res)=>{
        setEnvOptions(res)
        setCurEnv(res[0])
        setCurEnvCode(res[0]?.value)
    }).finally(()=>{
        setEnvOptionsLoading(false)
    })
  }
  const columns = useMemo(() => {
    return createTableColumns({
      onView: (record, index) => {
       history.push({
        pathname:'./traffic-detail'
       })
      },
      onAlertConfig: (record, index) => {
        setcurRecord(record);
        setMode('EDIT');
      },
    }) as any;
  }, []);


  return (
    <PageContainer className="app-traffic-page">
        <FilterCard className="app-traffic-page-header">
            <div className="app-traffic-filter">
                <span>环境：<Select style={{width:220}} loading={envOptionsLoading} options={envOptions} allowClear value={curEnvCode} showSearch onChange={(envCode,option:any)=>{
                    setCurEnvCode(envCode)
                    setCurEnv(option)
                }}/></span>
                <span className="app-traffic-filter-center">{curEnv?.label}</span>
                <span>查询：<Input style={{width:280}} placeholder="请输入内容按回车键查询"/></span>
            </div>

        </FilterCard>
        <ContentCard>
            <Table  columns={columns}    scroll={{ x: '100%' }}  dataSource={[
                {
                    "id": 1,
                    "appName": "测试应用",
                    "appCode": "dubbo-consumer",
                    "disk":"10.10.129.18",
                    cpu:"80%"
                }
            ]}/>


        </ContentCard>
        
   

    </PageContainer>
  );
}
