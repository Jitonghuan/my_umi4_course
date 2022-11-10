import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { Table, Space, Form, Select, Input, Button, Spin, Empty, Tag, Badge } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { START_TIME_ENUMS } from './schema';
import { history, useLocation } from 'umi';
import moment from 'moment';
import { RedoOutlined} from '@ant-design/icons';
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
  const [currentTableData,setCurrentTableData]= useState<any>([]);

  // pod ip
  const [curtIP, setCurtIp] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(5 * 60 * 1000);
  useEffect(() => {
    queryEnvs()
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
 
  // 查询应用列表
  const queryApps = (params: {
    envCode: string;
    startTime: number
  }) => {
    setAppLoading(true)
    const now = new Date().getTime();
    queryAppList({
      envCode: params?.envCode,
      start: Number((now - params?.startTime) / 1000) + "",
      end: Number((now) / 1000) + "",
    }).then((resp) => {
      setAppOptions(resp);
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
      }
      queryCountOverview({
        start: moment(new Date(Number((now - curStart)))).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(new Date(Number((now)))).format('YYYY-MM-DD HH:mm:ss'),
        appId: curAppId,
        envCode: curEnv,
        deployName: curDeployName
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
    deployName: string
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
    }
    if (type === "rt") {
      setIsRTHovering(true)

    }
    if (type === "fail") {
      setIsFailHovering(true)

    }

  };

  const handleMouseLeave = (type: string) => {
    if (type === "count") {
      setIsCountHovering(false);
    }
    if (type === "rt") {
      setIsRTHovering(false)

    }
    if (type === "fail") {
      setIsFailHovering(false)

    }
  };

  const leftContent = useMemo(() => {
    return (
      <>
        <div className="left-content-title">

          <span>
            <QuestionCircleOutlined style={{ color: "#1E90FF", }} />实例
                    </span>
          <div>
            <div
              className="title-hover"
            >

              <div className="title-hover"
                onMouseEnter={() => { handleMouseEnter("count") }}
                onMouseLeave={() => { handleMouseLeave("count") }}><span >请求数</span></div></div>/
              <div className="title-hover" onMouseEnter={() => { handleMouseEnter("rt") }}
              onMouseLeave={() => { handleMouseLeave("rt") }}><span >RT</span></div>/
              <div className="title-hover" onMouseEnter={() => { handleMouseEnter("fail") }}
              onMouseLeave={() => { handleMouseLeave("fail") }}><span   >失败数</span></div>
          </div>

        </div>
        <div className="left-content-detail">
          <Spin spinning={loading}>
            
            <p className="left-content-detail-title">
              <span className="title-code">{appCode}</span>
              <span>
                <span className={isCountHovering ? "count-hovering" : "not-hover"}> {countOverView?.totalCounts || 0}</span>/
                    <span className={isRTHovering ? "rt-hovering" : "not-hover"}>{Number(countOverView?.avgRequestTime||0).toFixed(2) || 0}ms</span>/
                    <span className={isFailHovering ? "fail-hovering" : "not-hover"}>{countOverView?.totalFailures || 0}</span>

              </span>
            </p>
            {nodeDataSource?.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"暂无数据"} />}
            {nodeDataSource?.length > 0 && nodeDataSource?.map((element: any) => {
              const nowData = countOverView?.instanceCallInfos?.filter((item: any) => item?.instanceIp === element?.hostIP)
              const instanceRt =Number( nowData?.instanceRt||0).toFixed(2);
              const requestCounts = nowData?.requestCounts;
              const requestFailures = nowData?.requestFailures
              return (
                <ul>
                  <li className="left-content-detail-info">
                    <span><span style={{ paddingRight: 8 }}>{element?.health === 0 ? <Badge status="error" /> : <Badge status="success" />}</span><span className="title-ip" onClick={()=>{
                        setCurtIp(element?.hostIP);
                        setHostName(element?.hostName);
                        setCurrentTableData(element)
                    }}>{element?.hostIP}</span></span>
                    <span>
                      <span className={isCountHovering ? "count-hovering" : "not-hover"}> {requestCounts || 0}</span>/
                      <span className={isRTHovering ? "rt-hovering" : "not-hover"}>{instanceRt || 0}ms</span>/
                      <span className={isFailHovering ? "fail-hovering" : "not-hover"}>{requestFailures || 0}</span>

                    </span>
                  </li>
                </ul>
              )

            })}

          </Spin>
        </div>
      </>
    )
  }, [nodeDataSource, loading, countOverView, isCountHovering, isFailHovering, isRTHovering,appCode])
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
    currentTableData
  ])





  return (
    <PageContainer className="traffic-detail-page">
      <FilterCard className="traffic-detail-page-header">
        <div className="traffic-detail-filter">
          <Form form={formInstance} layout="inline" className="monitor-filter-form" >

            <Form.Item label="选择环境" name="envCode">
              <Select showSearch options={envOptions} onChange={(envCode) => {
                queryApps({
                  envCode,
                  startTime: startTime
                })
                getNodeDataSource({
                  envCode
                })

              }} loading={envLoading} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="选择应用" name="appCode">
              <Select showSearch options={appOptions} onChange={(appCode, option: any) => {
                setCurAppID(option?.appId)
                setAppCode(appCode)
                getNodeDataSource({
                  appCode,
                  deployName:option?.deployName
                })
                setDeployName(option?.deployName)
              }} loading={appLoading} style={{ width: 200 }} />
            </Form.Item>
          </Form>

          <span>选择时间：<Select
            style={{ width: 150 }}
            value={startTime}
            onChange={(value) => {
              setStartTime(value);
             
              queryApps({
                envCode: formInstance.getFieldsValue()?.envCode,
                startTime: value
              })
              getNodeDataSource({
                start:value
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
        appId: curAppID||curRecord?.appId,
        appCode: formInstance?.getFieldsValue()?.appCode,
        startTime:startTime,
        hostIP: curtIP,
        hostName: hostName,
        currentTableData:currentTableData,
        deployName:deployName

      }}>
        <ContentCard className="traffic-detail-page-content">
          <LightDragable
            showIcon={true}
            leftContent={leftContent}
            rightContent={
              rightContent
          }
            initWidth={200}
            least={20}
            isSonPage={true}
          />
        </ContentCard>
      </DetailContext.Provider>
    </PageContainer>
  );
}
