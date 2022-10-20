import React, { useState, useEffect, useMemo, useRef, } from 'react';
import { Tabs, Form, Space, Select, message, Collapse, Spin, Input } from 'antd';
import { BarsOutlined, ReloadOutlined, InsertRowAboveOutlined, PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import LightDragable from "@/components/light-dragable";
import QueryResult from "./components/query-result";
import SqlConsole from "./components/sql-console";
import { useEnvList, querySqlResultInfo, useInstanceList, useQueryDatabasesOptions, useQueryTableFieldsOptions, queryTables } from '../common-hook'
import './index.less';
const { Panel } = Collapse;
export default function ResizeLayout() {
  const sqlConsoleRef = useRef<any>(null);
  const queryResultRef = useRef<any>(null);
  const formRef = useRef<any>(null)
  const [form] = Form.useForm();
  const addQueryResult = () => queryResultRef?.current?.addQueryResult();
  const addSqlConsole = () => sqlConsoleRef?.current?.addSqlConsole;
  const action = (value: boolean) => queryResultRef?.current?.action(value);
  const queryResultItems = queryResultRef?.current?.queryResultItems;
  const sqlConsoleItems = sqlConsoleRef?.current?.sqlConsoleItems;
  const queryResultActiveKey = queryResultRef?.current?.queryResultActiveKey;
  const sqlConsoleActiveKey = sqlConsoleRef?.current?.sqlConsoleActiveKey;
  const [envOptionLoading, envOptions, queryEnvList] = useEnvList();
  const [instanceLoading, instanceOptions, getInstanceList] = useInstanceList();
  const [databasesOptionsLoading, databasesOptions, queryDatabases, setSource] = useQueryDatabasesOptions()
  const [fieldsLoading, tableFields, tableFieldsOptions, queryTableFields, setOptions] = useQueryTableFieldsOptions();
  const [initSqlValue, setInitSqlValue] = useState<string>("")
  const [implementDisabled, setImplementDisabled] = useState<boolean>(true);
  const [firstInitSqlValue, setFirstInitSqlValue] = useState<string>("")
  const [tablesOptionsLoading, setTablesOptionsLoading] = useState<boolean>(false);
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);
  const [sqlResult, setSqlResult] = useState<any>("");
  const [addCount, setAddCount] = useState<number>(0);
  const [tableCode, setTableCode] = useState<string>("");
  const [originData, setOriginData] = useState<any>([]);
  const [activePanel, setActivePanel] = useState<string | undefined>(undefined);
  const [tablesSource, setTablesSource] = useState<any>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [costTime, setCostTime] = useState<string>("");

  const queryTablesOptions = (params: { dbCode: string, instanceId: number }) => {
    setTablesOptionsLoading(true)
    queryTables(params).then((res: any) => {
      setTablesSource(res)
      if (res?.length > 0) {
        let data = res?.map((item: any) => ({
          ...item
        }))
        setOriginData(data)
      } else {
        setOriginData([])
      }

    }).then(() => {
      action(false)
    }).finally(() => {
      action(false)
      setTablesOptionsLoading(false)
    })
  }
  //sql console 页面的新增按钮方法
  const onAdd = () => {
    const values = form?.getFieldsValue();
    let initsql = "select * from user limit 10"
    if (tableCode) {
      initsql = `select * from ${tableCode} limit 10`
      setImplementDisabled(false)
    } else if (!tableCode) {
      setImplementDisabled(true)
    }
    addSqlConsole
    setInitSqlValue(initsql)
    setAddCount(count => count + 1)
  }
  //查询sql结果
  const querySqlResult = (params: { sqlContent: string, sqlType: string }) => {
    const values = form?.getFieldsValue();
    if (!values?.instanceId || !values?.dbCode || !tableCode || !params?.sqlContent) {
      message.warning("请先进行信息填写并且输入sql语句再查询！")
      return
    }
    setSqlLoading(true)
    setImplementDisabled(true)
    querySqlResultInfo({ ...params, ...values, tableCode }).then((res) => {
      if (res?.success) {
        const dataSource = res?.data?.result || "";
        const costTime = res?.data?.costTime || ""
        //判断 queryResultItems sqlConsoleItems
        


        setSqlResult(dataSource)
        setImplementDisabled(false)
        setCostTime(costTime)
        setErrorMsg("")
        //addQueryResult()
      }
      if (res?.errorMsg) {
        setErrorMsg(res?.errorMsg)
        setCostTime("")
        //addQueryResult()
        setImplementDisabled(true)
      
      }
    }).finally(() => {
      setSqlLoading(false)
    })
  }
  useEffect(() => {
    queryEnvList()


  }, [])
  const onFilterChange = (e: any) => {
    if (!e) {

      setTablesSource(originData)
    } else {

      const newKeys = tablesSource?.map((item: any) => {
        if (item.value.indexOf(e) > -1) {
          return ({
            ...item
          });
        }
        return null;
      }).filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
      setTablesSource(newKeys)

    }

  };
  const reset = () => {
    setTablesSource(originData)
  }

  /* ----表展示----- */
  const tabelMap = () => {
    return (
      <Collapse
        accordion
        bordered={false}
        activeKey={activePanel}
        // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} 
        expandIcon={({ isActive }) => isActive ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
        className="site-collapse-custom-collapse"
        onChange={(value: any) => {
          if (value) {
            setTableCode(value)
            setActivePanel(value)
            const values = form?.getFieldsValue();
            setOptions([])
            // setSource([])
            queryTableFields({ ...values, tableCode: value })
            setFirstInitSqlValue(`select * from ${value} limit 10`)
            if (!values?.instanceId || !values?.dbCode || !value) {
              setImplementDisabled(true)
            } else if (values?.instanceId && values?.dbCode && value) {
              setImplementDisabled(false)
            }
          } else {
            setActivePanel('')
          }
        }}
      >
        {tablesSource?.map((item: any) => {
          return (
            <Panel
              header={<span><InsertRowAboveOutlined />&nbsp;{item?.value}</span>}
              key={item?.value}
              className="site-collapse-custom-panel"
            >
              <Spin spinning={fieldsLoading}>
                {tableFieldsOptions?.length > 0 && <p className="site-collapse-custom-panel-content"> {tableFilesMap()}</p>}
              </Spin>
            </Panel>
          )
        })}
      </Collapse>
    )
  }


  //表字段渲染
  const tableFilesMap = () => {
    return (tableFieldsOptions?.length > 0 ?
      tableFieldsOptions?.map((item: string) => {
        return (
          <li className="schema-li-map" style={{ listStyle: "none" }}><Space>
            <BarsOutlined onDoubleClick={() => {
              //  const table=form?.getFieldValue("tableCode")
              let initsql = `select ${item || "*"} from ${tableCode} limit 10`
              addSqlConsole
              setInitSqlValue(initsql)
            }
            } style={{ color: "#6495ED", fontSize: 16, cursor: "pointer" }} /><span>{item}</span></Space></li>
        )
      }) : <span className="schema-li-map">该表下未查询到字段</span>
    )
  }
  const copyAdd = (sqlContent: string, tableCode?: string) => {

    let initsql = sqlContent || "select * from user limit 10"
    addSqlConsole
    setInitSqlValue(initsql)
    setImplementDisabled(false)
    const dbCode = form?.getFieldsValue()?.dbCode
    getInstanceList(form?.getFieldsValue()?.envCode)
    queryTablesOptions({ dbCode, instanceId: form?.getFieldsValue()?.instanceId })
    //tableCode
    setActivePanel(tableCode)
    setTableCode(tableCode)
    queryDatabases({ instanceId: form?.getFieldsValue()?.instanceId })


  }

  const leftContent = useMemo(() => {
    return (
      <>
        <div className="left-content-title">选择查询对象</div>
        <div className="left-content-form">
          <Form layout="vertical" form={form} ref={formRef}>
            <Form.Item name="envCode" label="环境：" rules={[{ required: true, message: '请填写' }]}>
              <Select placeholder="选择环境" allowClear showSearch loading={envOptionLoading} options={envOptions} onChange={(value) => {
                form?.setFieldsValue({
                  instanceId: "",
                  dbCode: "",
                  searchFileds: ""
                  // tableCode:""
                })
                getInstanceList(value)
                setTableCode("")
                setImplementDisabled(false)
                setTablesSource([])
                setOptions([])
                setSource([])
                setActivePanel("")
              }} />
            </Form.Item>
            <Form.Item name="instanceId" label="实例：" rules={[{ required: true, message: '请填写' }]}>
              <Select placeholder="选择实例" options={instanceOptions} showSearch loading={instanceLoading} onChange={(instanceId) => {
                form?.setFieldsValue({
                  dbCode: "",
                  searchFileds: ""
                  // tableCode:""
                })
                setTableCode("")
                setActivePanel("")
                setTablesSource([])
                queryDatabases({ instanceId })
                setOptions([])
                setSource([])
                setImplementDisabled(false)

              }} />
            </Form.Item>
            <Form.Item name="dbCode" label="库：" rules={[{ required: true, message: '请填写' }]}>
              <Select placeholder="选择库" options={databasesOptions} showSearch loading={databasesOptionsLoading} onChange={(dbCode) => {
                queryTablesOptions({ dbCode, instanceId: form?.getFieldsValue()?.instanceId })
                form?.setFieldsValue({

                  searchFileds: ""
                })
                setTableCode("")
                setActivePanel("")
                setOptions([])
                // setSource([])
                setTablesSource([])
                setImplementDisabled(false)
              }} />
            </Form.Item>
            <Space style={{ marginBottom: 0, width: '100%', marginTop: 10 }}>
              <Form.Item name="searchFileds" >
                <Input.Search placeholder="支持模糊搜索表名" style={{ width: '100%' }} allowClear onSearch={onFilterChange} ></Input.Search>
              </Form.Item>
              <Form.Item>
                <span className="rest-btn" onClick={reset}><ReloadOutlined style={{ fontSize: 16, fontWeight: "bold", color: "#2487eb", cursor: "pointer" }} /></span>
              </Form.Item>
            </Space>
            <p style={{ marginTop: 8, width: "100%", marginBottom: 0 }}>
              <li style={{ width: "100%", listStyleType: "disc", color: "rgb(39,93,124)", whiteSpace: "break-spaces" }}>查询结果行数限制见权限管理，会选择查询涉及表的最小limit值</li>
            </p>
            <Form.Item name="tableCode" style={{ marginTop: 0, height: '100%', paddingBottom: 18 }}>
              <Spin spinning={tablesOptionsLoading}>
                {tabelMap()}
              </Spin>
              {/* <Select  placeholder="选择表" options={tablesOptions} allowClear showSearch loading={tablesOptionsLoading} onChange={(table)=>{
            const values=form?.getFieldsValue();
            setOptions([])
            queryTableFields({...values})
            setFirstInitSqlValue(`select * from ${table} limit 10`)
            // setInitSqlValue(`select * from ${table} limit 10`)
            if(!values?.instanceId||!values?.dbCode||!values?.tableCode){
              setImplementDisabled(true)
            }else if(values?.instanceId&&values?.dbCode&&values?.tableCode){
              setImplementDisabled(false)
            }
            
            } } /> */}
            </Form.Item>
          </Form>
        </div>
      </>
    )
  }, [
    queryResultItems,
    implementDisabled,
    activePanel,
    sqlConsoleItems,
    databasesOptions,
    fieldsLoading,
    tablesSource,
    tablesOptionsLoading,
    instanceLoading,
    databasesOptionsLoading,
    envOptionLoading,
    queryResultActiveKey,
    sqlConsoleActiveKey,
    envOptions,
    instanceOptions,
    databasesOptions,
    tablesSource,
    tableFieldsOptions,
    initSqlValue,
    firstInitSqlValue,
    errorMsg,
    costTime,
    sqlLoading])

  const rightContent = useMemo(() => {
    return (
      <>
        <div className="container-top">
          <SqlConsole
            ref={sqlConsoleRef}
            tableFields={tableFields}
            querySqlResult={(params: { sqlContent: string, sqlType: string }) => querySqlResult(params)}
            sqlLoading={sqlLoading}
            firstInitSqlValue={firstInitSqlValue}
            initSqlValue={initSqlValue}
            onAdd={onAdd}
            addCount={addCount}
            implementDisabled={implementDisabled} />

        </div>
        <div className="container-bottom">

          <QueryResult
            ref={queryResultRef}
            sqlResult={sqlResult}
            sqlLoading={sqlLoading}
            formRef={formRef}
            queryTableFields={queryTableFields}
            errorMsg={errorMsg}
            costTime={costTime}
            copyAdd={(sqlContent: string, tableCode?: string) => copyAdd(sqlContent, tableCode)}
          />
        </div>
      </>
    )
  }, [
    queryResultItems,
    errorMsg,
    costTime,
    sqlConsoleItems,
    implementDisabled,
    queryResultActiveKey,
    sqlConsoleActiveKey,
    tableFields,
    sqlResult,
    sqlLoading,
    initSqlValue,
    firstInitSqlValue,
    implementDisabled,
    databasesOptions,
    addCount]);

  return (
    <LightDragable
      showIcon={true}
      leftContent={leftContent}
      rightContent={rightContent}
      initWidth={150}
      least={20}
    />
  );
}
