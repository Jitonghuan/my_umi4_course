import React, { useMemo, useState, useEffect,  } from 'react';
import PageContainer from '@/components/page-container';
import { Space, Form, Select, Tooltip, Button, Spin, Empty,Badge } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { START_TIME_ENUMS } from './schema';
import { history, useLocation } from 'umi';
import moment from 'moment';
import { RedoOutlined } from '@ant-design/icons';
import LightDragable from "@/components/light-dragable";
import ListDetail from './components/list-detail';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { queryAppList, queryEnvList, queryNodeList, getCountOverview } from './hook';
import DetailContext from './context';
import './index.less'
export default function TrafficDetail() {
  const now = new Date().getTime();
  let location = useLocation();
  const curRecord: any = location.state || {};
  const [formInstance] = Form.useForm();
  const [appOptions, setAppOptions] = useState([]);
  const [envOptions, setEnvOptions] = useState([]);
  const [appLoading, setAppLoading] = useState<boolean>(false)
  const [envLoading, setEnvLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [curAppID, setCurAppID] = useState<string>(curRecord?.appId)
  const [deployName, setDeployName] = useState<string>(curRecord?.deployName)
  const [appCode, setAppCode] = useState<string>(curRecord?.appCode)
  const [isCountHovering, setIsCountHovering] = useState(false);
  const [isRTHovering, setIsRTHovering] = useState(false);
  const [isFailHovering, setIsFailHovering] = useState(false);
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const [countOverView, setCountOverView] = useState<any>({});
  const [currentTableData, setCurrentTableData] = useState<any>([]);
  const [isClick, setIsClick] = useState<string | number>()
  const [podIps,setPodIps]=useState<any>([])

  // pod ip
  const [curtIP, setCurtIp] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(5 * 60 * 1000);
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    queryEnvs()
    return () => {
      setCount(0)
      setEmpty(false)
    }
  }, [])

  useEffect(() => {
    //if(!curRecord?.appId) return
    if (curRecord?.appCode && curRecord?.envCode) {
      formInstance.setFieldsValue({
        appCode: curRecord?.appCode,
        envCode: curRecord?.envCode,
      });
      setCurAppID(curRecord?.appId)
      queryApps({
        envCode: curRecord?.envCode,
        startTime: startTime
      })

      if (curRecord?.appId !== "") {
        getNodeDataSource()
      }

    }
  }, [])
const [empty,setEmpty]=useState<boolean>(false)
  // 查询应用列表
  const queryApps = (params: {
    envCode: string;
    startTime: number;
  }) => {
    setAppLoading(true)
    const now = new Date().getTime();
    queryAppList({
      envCode: params?.envCode,
      start: Number((now - params?.startTime) / 1000) + "",
      end: Number((now) / 1000) + "",
    }).then((resp) => {
      setAppOptions(resp);
      const appIndex = resp.findIndex((item:any) => item.value == curRecord?.appCode);
     if(appIndex === -1){
      setEmpty(true)
     }
     if(appIndex !== -1){
      setEmpty(false)
     }
    }).finally(() => {
      setAppLoading(false)
    })
  }
  const queryEnvs = () => {
    setEnvLoading(true)
    queryEnvList().then((resp) => {
      setEnvOptions(resp)
    }).finally(() => {
      setEnvLoading(false)
    })
  }
  //获取左侧数据
  const getNodeDataSource = (params?: { start?: number, envCode?: string, appCode?: string, appId?: string, deployName?: string }) => {
    setLoading(true)
    const now = new Date().getTime();
    let curStart: number = params?.start ? params?.start : startTime
    let curEnv = params?.envCode ? params?.envCode : formInstance.getFieldsValue()?.envCode
    let curApp = params?.appCode ? params?.appCode : formInstance.getFieldsValue()?.appCode
    let curAppId = params?.appId ? params?.appId : curAppID
    let curDeployName = params?.deployName ? params?.deployName : deployName
    queryNodeList({
      //@ts-ignore
      start: Number((now - curStart) / 1000),
      end: Number(now / 1000),
      appCode: curApp,
      envCode: curEnv,
    }).then((res: any) => {
      if (res[0]) {
        setCurtIp(res[0].hostIP);
        setHostName(res[0]?.hostName);
        setIsClick(curApp)
      }else{
        setCurtIp("");
        setHostName("");
        setIsClick(curApp)
      }
      let podIps = res?.map((ele: any) => (ele?.hostIP))
      setPodIps(podIps)
      queryCountOverview({
        start: moment(new Date(Number((now - curStart)))).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(new Date(Number((now)))).format('YYYY-MM-DD HH:mm:ss'),
        appId: curAppId,
        envCode: curEnv,
        deployName: curDeployName,
        podIps

      })

      setNodeDataSource(res)
      setCurrentTableData(res[0])
    }).finally(() => {
      setLoading(false)
    })
  }

  const queryCountOverview = (params: {
    start: string,
    end: string
    envCode: string,
    appId: string
    deployName: string,
    podIps: string[]

  }) => {
    getCountOverview({
      ...params
    }).then((res: any) => {
      setCountOverView(res)


    })

  }

  const handleMouseEnter = (type: string) => {
    if (type === "count") {
      setIsCountHovering(true);
      setIsRTHovering(false)
      setIsFailHovering(false)
    }
    if (type === "rt") {
      setIsRTHovering(true)
      setIsCountHovering(false);
      setIsFailHovering(false)
    }
    if (type === "fail") {
      setIsFailHovering(true)
      setIsRTHovering(false)
      setIsCountHovering(false);

    }

  };

  const handleMouseLeave = (type: string) => {
    if (type === "count") {
      setIsCountHovering(false);
      setIsRTHovering(true)
      setIsFailHovering(true)
    }
    if (type === "rt") {
      setIsRTHovering(false)
      setIsCountHovering(true)
      setIsFailHovering(true)

    }
    if (type === "fail") {
      setIsFailHovering(false)
      setIsRTHovering(true)
      setIsCountHovering(true)

    }
  };

  const leftContent = useMemo(() => {
    return (
      <>
        <div className="left-content-title">
          <span>
            实例<Tooltip title={"当前服务的请求总数/平均响应时间/失败请求数"}> <QuestionCircleOutlined style={{ color: "#1E90FF", fontSize: 14 }} /></Tooltip>
          </span>
          <div>

            <span className={isCountHovering ? "title-click" : "not-click"}
              onClick={() => {
                if (isCountHovering) {
                  handleMouseLeave("count")
                } else {
                  handleMouseEnter("count")
                }
              }}>请求数</span>/
            <span className={isRTHovering ? "title-click" : "not-click"}
              onClick={() => {
                if (isRTHovering) {
                  handleMouseLeave("rt")
                } else {
                  handleMouseEnter("rt")
                }
              }} >RT</span>/
             <span className={isFailHovering ? "title-click" : "not-click"}
              onClick={() => {
                if (isFailHovering) {
                  handleMouseLeave("fail")
                } else {
                  handleMouseEnter("fail")
                }
              }} >失败数</span>
          </div>

        </div>
        <div className="left-content-detail">
          <Spin spinning={loading}>

            <p className={`left-content-detail-title ${appCode === isClick ? "is-click" : "not-click"}`}>
              <span className={`title-code `} onClick={() => { setIsClick(appCode) }} >{appCode}</span>
              <span>
                <span className={isCountHovering ? "count-hovering" : "not-hover"} style={{ padding: 6, display: "inline-block" }}> {countOverView?.totalCounts || 0}</span>/
                    <span className={isRTHovering ? "rt-hovering" : "not-hover"} style={{ padding: 6, display: "inline-block" }}>{Number(countOverView?.avgRequestTime || 0).toFixed(2) || 0}ms</span>/
                    <span className={isFailHovering ? "fail-hovering" : "not-hover"} style={{ padding: 6, display: "inline-block" }}>{countOverView?.totalFailures || 0}</span>
              </span>
            </p>
            {nodeDataSource?.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"暂无数据"} />}
            {nodeDataSource?.length > 0 && nodeDataSource?.map((element: any, index: number) => {
              const nowData = countOverView?.instanceCallInfos?.filter((item: any) => item?.instanceIp === element?.hostIP)
            
              const instanceRt =nowData?.length>0? Number(nowData[0]?.instanceRt || 0).toFixed(2):"0";
              const requestCounts =nowData?.length>0? nowData[0]?.requestCounts:"0";
              const requestFailures =nowData?.length>0? nowData[0]?.requestFailures:"0"
              return (
                <ul>
                  <li className={`left-content-detail-info ${index === isClick ? "is-click" : "not-click"}`}>
                    <span><span style={{ paddingRight: 8 }}>{element?.health === 0 ? <Badge status="error" /> : <Badge status="success" />}</span><span className={`title-ip`} onClick={() => {
                      setIsClick(index)
                      setCurtIp(element?.hostIP);
                      setHostName(element?.hostName);
                      setCurrentTableData(element)
                    }}>{element?.hostIP}</span></span>
                    <span>
                      <span className={isCountHovering ? "count-hovering" : "not-hover"} > {requestCounts || 0}</span>/
                      <span className={isRTHovering ? "rt-hovering" : "not-hover"} >{instanceRt || 0}ms</span>/
                      <span className={isFailHovering ? "fail-hovering" : "not-hover"} >{requestFailures || 0}</span>

                    </span>
                  </li>
                </ul>
              )

            })}

          </Spin>
        </div>
      </>
    )
  }, [nodeDataSource, loading, countOverView, isCountHovering, isFailHovering, isRTHovering, appCode, isClick,empty])
  const rightContent = useMemo(() => {
    return (
      <>
        <ListDetail />

      </>
    )
  }, [
    curtIP,
    hostName,
    startTime,
    formInstance?.getFieldsValue()?.appCode,
    formInstance?.getFieldsValue()?.envCode,
    currentTableData,
    count,
    isClick,
    empty
  ])





  return (
    <PageContainer className="traffic-detail-page">
      <FilterCard className="traffic-detail-page-header">
        <div className="traffic-detail-filter">
          <Form form={formInstance} layout="inline" className="monitor-filter-form" >

            <Form.Item label="选择环境" name="envCode">
              <Select showSearch options={envOptions} onChange={(envCode) => {
                 setCurtIp("");
                 setHostName("");
                 setCurrentTableData({})
                queryApps({
                  envCode,
                  startTime: startTime,
                })
               
                  getNodeDataSource({
                    envCode
                  })
                // }
              
               

              }} loading={envLoading} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="选择应用" name="appCode">
              <Select showSearch options={appOptions} onChange={(appCode, option: any) => {
                 setCurtIp("");
                 setHostName("");
                 setCurrentTableData({})
                 setIsClick(appCode)
                setCurAppID(option?.appId)
                setAppCode(appCode)
                getNodeDataSource({
                  appCode,
                  deployName: option?.deployName
                })
                setDeployName(option?.deployName)
              }} loading={appLoading} style={{ width: 200 }} />
            </Form.Item>
          </Form>

          <span>选择时间：<Select
            style={{ width: 150 }}
            value={startTime}
            onChange={(value) => {
              setCurtIp("");
              setHostName("");
              setCurrentTableData({})
              setStartTime(value);

              queryApps({
                envCode: formInstance.getFieldsValue()?.envCode,
                startTime: value,
                
              })
              getNodeDataSource({
                start: value
              })
            }}
          >  <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
            {START_TIME_ENUMS.map((time) => (
              <Select.Option key={time.value} value={time.value}>
                {time.label}
              </Select.Option>
            ))}
          </Select>
            <Space style={{ marginLeft: 8, marginTop: 2 }}>
              <Button type="primary" icon={<RedoOutlined />} onClick={() => {
                getNodeDataSource()
                setCount(count => count + 1)
              }}>刷新</Button>
              <span><Button type="primary" ghost onClick={() => {
                history.push({
                  pathname: "/matrix/trafficmap/app-traffic"
                })
              }}>返回</Button></span>
            </Space>
          </span>
        </div>
      </FilterCard>
      <DetailContext.Provider value={{
        envCode: formInstance?.getFieldsValue()?.envCode,
        appId: curAppID || curRecord?.appId,
        appCode: formInstance?.getFieldsValue()?.appCode,
        startTime: startTime,
        hostIP: curtIP,
        hostName: hostName,
        currentTableData: currentTableData,
        deployName: deployName,
        count: count,
        isClick: isClick,
        podIps:podIps

      }}>
        <ContentCard className="traffic-detail-page-content">
          {empty?<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`该环境下不存在${appCode||curRecord?.appCode}应用`} />:   <LightDragable
            showIcon={true}
            leftContent={leftContent}
            rightContent={
              rightContent
            }
            initWidth={200}
            least={20}
            isSonPage={true}
          />}
       
        </ContentCard>
      </DetailContext.Provider>
    </PageContainer>
  );
}
