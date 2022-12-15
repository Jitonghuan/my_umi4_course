import React, { useState, useEffect, useMemo} from 'react';
import { Tabs, Form, Select, Input, Button, Radio, Segmented, Table,Drawer,Space,Spin,message,Divider } from 'antd';
import { createDiffTableColumns } from './schema'
import ShuttleFrame from '@/components/shuttle-frame';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import { getRequest } from '@/utils/request';
import { history } from 'umi';
import * as APIS from '../../../common-service';
import AceEditor from '@/components/ace-editor';
import DateSelector from '@/components/date-selector';
import { useEnvList, querySqlResultInfo, useInstanceList, useQueryDatabasesOptions, useQueryTableFieldsOptions, queryTables } from '../../../common-hook'
import { useCompareSyncInfo, createSync,diffTableParams,createItems } from './hook'
import './index.less';
export const options = [
    { label: '是', value: true },
    { label: '否', value: false },

];
export const appMicroFeTypeOptions: any[] = [
    { label: '所有表', value: true },
    { label: '部分表', value: false },
];
const rootCls = 'struct-apply-page';
export default function StructApply() {
    const [targetSource, setTargetSource] = useState<any>([]);
    const [form] = Form.useForm()
    const [sqlForm] = Form.useForm()
    const [subForm] =Form.useForm()
    const [showSql, setShowSql] = useState<boolean>(false)
    const [startTime, setStartTime] = useState<string | null>('')
    const [endTime, setEndTime] = useState<string | null>('')
    const [activeTab, setActiveTab] = useState<string | number>('createTables');
    const [createTablesData, setCreateTablesData] = useState<any>([])
    const [modifyTablesData, setModifyTablesData] = useState<any>([])
    const [submitId,setSubmitId]=useState<number|undefined>()
    const [submitLoading,setSubmitLoading]= useState<boolean>(false)
    const [tablesOptionsLoading, setTablesOptionsLoading] = useState<boolean>(false);
    const [tablesSource, setTablesSource] = useState<any>([]);
    const [envOptionLoading, envOptions, queryEnvList] = useEnvList();
    const [instanceLoading, instanceOptions, getInstanceList] = useInstanceList();
    const [databasesOptionsLoading, databasesOptions, queryDatabases,] = useQueryDatabasesOptions()
    const [chooseTable,setChooseTable]=useState<boolean>(true)
    const [toInstanceLoading,setToInstanceLoading]=useState<boolean>(false)
    const [toDbLoading,setToDbLoading]=useState<boolean>(false)
    const [toInstanceId,setToInstanceId]=useState<any>([]);
    const [toDbcodeOption,setToDbcodeOption]=useState<any>([]);
    const [toDbCode,setToDbCode]=useState<string>('')
    const [allSql,setAllSql]=useState<string>('')
    const [diffLoading,setDiffLoading]=useState<boolean>(false)

     
    useEffect(() => {
        queryEnvList()
    
    
      }, [])
    const getDiffInfo=()=>{
        setDiffLoading(true)
        const payloads:diffTableParams= form.getFieldsValue()
        useCompareSyncInfo({...payloads,comparedTables:targetSource}).then((res)=>{
            setModifyTablesData(res?.syncTableInfoList?.modifyTables)
            setCreateTablesData(res?.syncTableInfoList?.createTables)
            setSubmitId(res?.id)
            let modifAllSqlContent=""
            let createAllSqlContent=""
            if(res?.syncTableInfoList?.modifyTables?.length>0){
                let sqlArry:any=[]
                res?.syncTableInfoList?.modifyTables?.map((item:any)=>{
                    sqlArry.push(item?.syncSQLContent)

                })
                modifAllSqlContent=sqlArry?.join('; \n \n \n \n')

            }
            if(res?.syncTableInfoList?.createTables?.length>0){
                let sqlArry:any=[]
                res?.syncTableInfoList?.createTables?.map((item:any)=>{
                    sqlArry.push(item?.syncSQLContent)

                })
                createAllSqlContent=sqlArry?.join('; \n \n \n \n')
            }
           

            setAllSql(`${createAllSqlContent} ${createAllSqlContent?";":""} \n \n ${modifAllSqlContent}`)

        }).finally(()=>{
            setDiffLoading(false)
        })
    }
    const getToInstanceList = async (envCode:string) => {
        setToInstanceLoading(true);
        await getRequest(APIS.getInstanceList, { data: {envCode} })
          .then((result) => {
            if (result?.success) {
              let dataSource = result.data?.dataSource;
              let dataArry: any = [];
              dataSource?.map((item: any) => {
                dataArry.push({
                 label:item?.InstanceName,
                 value:item?.InstanceId
                });
              });
             
              setToInstanceId(dataArry);
             
            }
          
          })
          .finally(() => {
            setToInstanceLoading(false);
          });
      };

      const queryToDatabases = async (params:{instanceId:number,}) => {
        setToDbLoading(true);
        await getRequest(APIS.queryDatabasesApi, { data: params})
          .then((result) => {
            if (result?.success) {
              let dataSource = result.data?.dbCodes;
              let dataArry: any = [];
              dataSource?.map((item: any) => {
                dataArry.push({
                 label:item,
                 value:item,
                 title: item,
                 key:item
                });
              });
             
              setToDbcodeOption(dataArry);
             
            }
          
          })
          .finally(() => {
            setToDbLoading(false);
          });
      };
    const columns = useMemo(() => {
        return createDiffTableColumns({
            onDetail: (record, index) => {
                setShowSql(true);
                sqlForm.setFieldsValue({
                  showSql: record?.syncSQLContent?.replace(/\\n/g, '<br/>')
                })
            }

        }) as any;
    }, []);
    const changeInfoOption = (value: string | number) => {
        setActiveTab(value);
    };
    const handleSubmit=async()=>{
        const payloads:createItems=await form.validateFields()
        const params=subForm.getFieldsValue()
        if(!startTime||!endTime) {
            message.warning("请选择时间！")
            return
        }
        setSubmitLoading(true)
        createSync({id:submitId,runStartTime:startTime||"",runEndTime:endTime||"",title:params?.title,remark:params?.remark,allowTiming:params?.allowTiming}).then((res)=>{

            if(res?.success){
                history.push({
                    pathname: "/matrix/DBMS/data-change",
    
                  })

            }
          
        }).finally(()=>{
            setSubmitLoading(false)
        })
    }


    // useEffect(()=>{
    //     const allValues=form.getFieldsValue()
    //     if(allValues?.fromEnvCode&&allValues?.fromInstanceId&&allValues?.fromDbCode&&allValues?.toEnvCode&&allValues?.toInstanceId&&toDbCode&&targetSource.length>0){
       
    //         getDiffInfo()
    //     }

    // },[ form.getFieldsValue()?.fromEnvCode,
    //     form.getFieldsValue()?.fromInstanceId,
    //     form.getFieldsValue()?.fromDbCode,
    //     form.getFieldsValue()?.toEnvCode,
    //     form.getFieldValue('toInstanceId'),
    //   //  form.getFieldValue("toDbCode"),
    //     toDbCode,
    //     JSON.stringify(targetSource)


    // ])
    const onValuesChange=(changedValues:any, allValues:any)=>{
        

        if(changedValues?.fromEnvCode){
            getInstanceList(changedValues?.fromEnvCode)
            form.setFieldsValue({
                fromInstanceId:"",
                fromDbCode:""

            })
            setTablesSource([])

        }
        if(changedValues?.toEnvCode){
            getToInstanceList(changedValues?.toEnvCode)
            form.setFieldsValue({
                toInstanceId:"",
                toDbCode:""

            })
            setToDbCode("")
        }
        if(changedValues?.fromInstanceId){
            queryDatabases({instanceId:changedValues?.fromInstanceId})
            form.setFieldsValue({
              
                fromDbCode:""

            })
            setTablesSource([])
        }
        if(changedValues?.toInstanceId){
            queryToDatabases({instanceId:changedValues?.toInstanceId})
            form.setFieldsValue({
              
                toDbCode:""

            })
            setToDbCode("")
        }
        if(changedValues?.fromDbCode){
            queryTablesOptions({dbCode:changedValues?.fromDbCode,instanceId:allValues?.fromInstanceId})
            setTablesSource([])
        }


    }

  const queryTablesOptions = (params: { dbCode: string, instanceId: number }) => {
    setTablesOptionsLoading(true)
    queryTables(params).then((res: any) => {
      setTablesSource(res)
    }).finally(() => {
      setTablesOptionsLoading(false)
    })
  }

    return (
        <PageContainer>
            <ContentCard className={rootCls}>
                <div className={`${rootCls}-title`}>
                    <h3>结构同步工单</h3>

                        <Spin spinning={submitLoading}>
                        <Space>
                           
                         
                          <Button type="primary"  onClick={()=>{
                                history.push({
                                    pathname: "/matrix/DBMS/data-change",
                    
                                  })
                          }}>返回</Button>

                        </Space>

                        </Spin>
                   

                   
                   

                </div>
                <div className={`${rootCls}-content-wrapper`}>
                    <div className={`${rootCls}-content`}>
                        <Form labelCol={{ flex: '90px' }} form={form} labelWrap onValuesChange={onValuesChange}>
                          
                            {/* <Form.Item label="来源库"> */}
                            <div className="select-db-action">
                                <div className="db-wrapper">
                                    <div className={`form-header`}>来源库</div>
                                    <Form.Item label="环境" name="fromEnvCode" rules={[{ required: true, message: '请填写' }]}>
                                        <Select style={{ width: 220 }} allowClear showSearch loading={envOptionLoading}   options={envOptions}/>

                                    </Form.Item>
                                    <Form.Item label="实例" name="fromInstanceId" rules={[{ required: true, message: '请填写' }]}>
                                        <Select style={{ width: 220 }} options={instanceOptions} showSearch loading={instanceLoading}/>

                                    </Form.Item>
                                    <Form.Item label="库" name="fromDbCode" rules={[{ required: true, message: '请填写' }]}>
                                        <Select style={{ width: 220 }} options={databasesOptions} showSearch loading={databasesOptionsLoading} />

                                    </Form.Item>

                                </div>
                                {/* <Divider type="vertical"/> */}
                                <div className="db-wrapper">
                                    <div className={`form-header`}>目标库</div>
                                    <Form.Item label="环境" name="toEnvCode" rules={[{ required: true, message: '请填写' }]}>
                                        <Select style={{ width: 220 }} options={envOptions} loading={envOptionLoading} />

                                    </Form.Item>
                                    <Form.Item label="实例" name="toInstanceId" rules={[{ required: true, message: '请填写' }]}>
                                        <Select style={{ width: 220 }} options={toInstanceId} loading={toInstanceLoading} />

                                    </Form.Item>
                                    <Form.Item label="库" name="toDbCode" rules={[{ required: true, message: '请填写' }]}>
                                        <Select style={{ width: 220 }} options={toDbcodeOption} showSearch allowClear  value={toDbCode} onChange={(dbCode:string)=>{setToDbCode(dbCode)}}  loading={toDbLoading}/>
                                    </Form.Item>

                                </div>


                            </div>
                            <Form.Item label="对比的表" name="isAllTable" rules={[{ required: true, message: '请填写' }]} initialValue={true}>
                                <Radio.Group options={appMicroFeTypeOptions} defaultValue={true} onChange={(e)=>{
                                    setChooseTable(e.target.value)
                                    

                                }} />
                            </Form.Item>

                            { chooseTable===false&&
                            <Spin spinning={tablesOptionsLoading}>
                                 <Form.Item  style={{marginLeft:80}}>
                                    <ShuttleFrame
                                        showSearch
                                        title={["可选项", "已选择"]}
                                        canAddSource={tablesSource}
                                        alreadyAddTargets={[]}
                                        onOk={(targetSource: any) => { setTargetSource(targetSource); }}
                                        limit={20} />

                                </Form.Item>

                            </Spin>
                               

                            }
                            <Form.Item style={{marginLeft:90}}>
                                <Button type="primary" 
                                disabled={
                                    !form.getFieldsValue()?.fromEnvCode || !form.getFieldsValue()?.fromInstanceId|| !form.getFieldsValue()?.fromDbCode|| !form.getFieldsValue()?.toEnvCode|| !form.getFieldsValue()?.toInstanceId||!toDbCode||!chooseTable&& targetSource.length<1
                                }
                                 onClick={getDiffInfo} loading={diffLoading}>开始对比</Button>
                            </Form.Item>

                          
                           
                        </Form>
                    </div>

                    <div className={`${rootCls}-table`}>
                        <div>
                            <Segmented onChange={changeInfoOption} value={activeTab} options={[

                                { label: '新建的表', value: 'createTables', },

                                { label: '修改的表', value: 'modifyTables', },

                            ]} />
                            <Table 
                            columns={columns} 
                            loading={diffLoading}
                             dataSource={activeTab === "createTables" ? createTablesData : modifyTablesData}
                             pagination={{
                                // current: taskTablePageInfo.pageIndex,
                               
                                showSizeChanger: true,
                                showTotal: () => `总共 ${activeTab === "createTables" ? createTablesData?.length : modifyTablesData?.length} 条数据`,
                              }}
                              />

                        </div>
                        <div className="view-all-sql">
                            <Button type="primary" onClick={()=>{
                                 setShowSql(true);
                                 sqlForm.setFieldsValue({
                                    showSql:allSql
                                //    showSql: record?.syncSQLContent?.replace(/\\n/g, '<br/>')
                                 })
                            }}>查看完整SQL</Button>
                        </div>
                        <Divider/>
                        {(createTablesData?.length>0||modifyTablesData?.length>0)&&  <div>
                            <Form form={subForm} labelCol={{ flex: '130px' }}>
                            <Form.Item label="标题" name="title" rules={[{ required: true, message: '请填写' }]}>
                                <Input style={{ width: 300 }} />
                            </Form.Item>
                            <Form.Item name="remark" label="理由" rules={[{ required: true, message: '请填写' }]}>
                                <Input style={{ width: 300 }} />
                            </Form.Item>
                            <Form.Item label="执行时间" className="nesting-form-item">
                                <DateSelector getDateValue={(params: { startTime: string, endTime: string }) => {
                                    setStartTime(params?.startTime)
                                    setEndTime(params?.endTime)

                                }} />
                            </Form.Item>
                            <Form.Item name="allowTiming" label="是否允许定时执行" rules={[{ required: true, message: '请填写' }]}>
                                <Radio.Group options={options} />
                            </Form.Item>
                            <Form.Item style={{marginLeft:140}}>
                            <Button type="primary" disabled={(!createTablesData?.length&&!modifyTablesData?.length)||(createTablesData?.length<1&&modifyTablesData?.length<1)}  onClick={handleSubmit}>提交</Button>
                            </Form.Item>

                            </Form>
                      
                        </div>}
                      


                    </div>

                </div>


            </ContentCard>
            <Drawer title="sql详情" visible={showSql} footer={false} width={"70%"} onClose={() => { setShowSql(false) }} destroyOnClose>
        <Form form={sqlForm} preserve={false}>
          <Form.Item name="showSql">
            <AceEditor mode="sql" height={900} readOnly={true} />
          </Form.Item>


        </Form>


      </Drawer>

        </PageContainer>
    )
}