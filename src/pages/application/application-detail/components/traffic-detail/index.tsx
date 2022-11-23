import React, { useMemo, useState, useEffect, useContext, useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { Space, Form, Select, Tooltip, Button, Spin, Empty, Badge, DatePicker } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { START_TIME_ENUMS, selectOption } from './schema';
import AppDetailContext from '@/pages/application/application-detail/context';
import moment from 'moment';
import { RedoOutlined } from '@ant-design/icons';
import LightDragable from "@/components/light-dragable";
import ListDetail from './components/list-detail';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { queryNodeList, getCountOverview, getListAppEnv, queryTrafficList } from './hook';
import DetailContext from './context';
const { RangePicker } = DatePicker;

import './index.less'
export default function TrafficDetail() {

  const [formInstance] = Form.useForm();
  const { appData } = useContext(AppDetailContext);
  const [envOptions, setEnvOptions] = useState([]);
  const [envLoading, setEnvLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [curAppID, setCurAppID] = useState<string>("")
  const [deployName, setDeployName] = useState<string>(appData?.deploymentName || "")
  const [appCode, setAppCode] = useState<string>(appData?.appCode || "")
  const [isCountHovering, setIsCountHovering] = useState(false);
  const [isRTHovering, setIsRTHovering] = useState(false);
  const [isFailHovering, setIsFailHovering] = useState(false);
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const [countOverView, setCountOverView] = useState<any>({});
  const [currentTableData, setCurrentTableData] = useState<any>([]);
  const [isClick, setIsClick] = useState<string | number>()
  const [empty, setEmpty] = useState<boolean>(false)
  const [podIps, setPodIps] = useState<any>([]);
  const [selectTimeType, setSelectTimeType] = useState<string>('lastTime');
  const [rangTime, setRangeTime] = useState<any>([]);
  const [endTime, setEndTime] = useState<number>();

  useEffect(() => {
    if (appData?.appCode) {
      setAppCode(appData?.appCode)
      setDeployName(appData?.deploymentName || "")
      getListAppEnvData()
    }
    return () => {
      setCount(0)
      setEmpty(false)
    }
  }, [appData?.appCode])
  const getListAppEnvData = () => {
    setEnvLoading(true)
    getListAppEnv({ appCode: appData?.appCode }).then((res) => {
      setEnvOptions(res)
      formInstance.setFieldsValue({
        envCode: res?.length > 0 ? res[0]?.value : ""
      })
      getAppId({ envCode: res?.length > 0 ? res[0]?.value : "", startTime })
    }).finally(() => {
      setEnvLoading(false)
    })
  }
  const getAppId = (params: { envCode: string, startTime: number }) => {
    const now = new Date().getTime();
    let start = 0, end = 0;
    if (selectTimeType === 'lastTime') {
      //@ts-ignore
      start = Number((now - startTime) / 1000);
      end = Number(now / 1000);
    } else {
      //@ts-ignore
      start = startTime;
      end = Number(endTime);
    }
    queryTrafficList(
      {
        envCode: params?.envCode,
        keyWord: appData?.appCode,
        start: start + '',
        end: end + '',
      }
    ).then(() => {
      queryTrafficList(
        {
          envCode: params?.envCode,
          keyWord: appData?.appCode,
          start: start + '',
          end: end + '',
          needMetric: true
        }
      ).then((resp) => {

        if (resp?.length > 0 && resp[0]?.appId) {
          setCurAppID(resp[0]?.appId)
          getNodeDataSource({
            appId: resp?.length > 0 ? resp[0]?.appId : "",
            appCode: appData?.appCode
          })

        } else {
          setCurAppID("")
          getNodeDataSource({
            appCode: appData?.appCode
          })
        }


      })


    })
  }

  // pod ip
  const [curtIP, setCurtIp] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(5 * 60 * 1000);
  const [count, setCount] = useState<number>(0)
  //获取左侧数据
  const getNodeDataSource = (params?: { start?: number, envCode?: string, appCode?: string, appId?: string, deployName?: string, end?: number, selectTimeType?: string }) => {
    setLoading(true)
    params = params || {}
    params.start = params?.start || startTime;
    params.end = params?.end || endTime;
    const { start, end } = params;
    const now = new Date().getTime();
    const type = params?.selectTimeType || selectTimeType;
    const startTimestamp: any = type === 'lastTime' ? Number((now - start) / 1000) + "" : start;
    const endTimestamp: any = type === 'lastTime' ? Number((now) / 1000) + "" : end;
    // let curStart: number = params?.start ? params?.start : startTime
    let curEnv = params?.envCode ? params?.envCode : formInstance.getFieldsValue()?.envCode
    let curApp = params?.appCode || appData?.appCode

    let curAppId = params?.appId ? params?.appId : curAppID

    let curDeployName = params?.deployName ? params?.deployName : deployName
    queryNodeList({
      //@ts-ignore
      start: startTimestamp,
      end: endTimestamp,
      appCode: curApp || "",
      envCode: curEnv,
    }).then((res: any) => {
      if (res[0]) {
        setCurtIp(res[0].hostIP);
        setHostName(res[0]?.hostName);
        setIsClick(curApp)
      } else {
        setCurtIp("");
        setHostName("");
        setIsClick(curApp)
      }
      let podIps = res?.map((ele: any) => (ele?.hostIP))
      setPodIps(podIps)
      if (curAppId) {
        queryCountOverview({
          start: moment(new Date(Number(startTimestamp) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(new Date(Number((endTimestamp)))).format('YYYY-MM-DD HH:mm:ss'),
          appId: curAppId,
          envCode: curEnv,
          deployName: curDeployName,
          podIps

        })


      }

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
      setIsRTHovering(false)
      setIsCountHovering(true);
      setIsFailHovering(false)
    }
    if (type === "rt") {
      setIsRTHovering(true)
      setIsCountHovering(false)
      setIsFailHovering(false)

    }
    if (type === "fail") {
      setIsFailHovering(true)
      setIsRTHovering(false)
      setIsCountHovering(false)

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

              const instanceRt = nowData?.length > 0 ? Number(nowData[0]?.instanceRt || 0).toFixed(2) : "0";
              const requestCounts = nowData?.length > 0 ? nowData[0]?.requestCounts : "0";
              const requestFailures = nowData?.length > 0 ? nowData[0]?.requestFailures : "0"
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
  }, [nodeDataSource, loading, countOverView, isCountHovering, isFailHovering, isRTHovering, appCode, isClick, empty, appData?.appCode, appData?.deploymentName])
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
    appData?.appCode,
    formInstance?.getFieldsValue()?.envCode,
    currentTableData,
    count,
    isClick,
    empty,
    appData?.appCode,
    appData?.deploymentName
  ])


  const getTime = useCallback((params?: { start: number }) => {
    const now = new Date().getTime();
    let curStart: number = params?.start ? params?.start : startTime
    let start = moment(new Date(Number((now - curStart)))).format('YYYY-MM-DD HH:mm:ss')
    let end = moment(new Date(Number((now)))).format('YYYY-MM-DD HH:mm:ss')

    return [start, end]
  }, [startTime])

  const timeTypeChange = (v: string) => {
    setCurtIp("");
    setHostName("");
    setCurrentTableData({})
    setSelectTimeType(v);
    let start, end;
    if (v === 'lastTime') {
      start = 5 * 60 * 1000;
      end = 0;
      setStartTime(start);
      setEndTime(end);
    } else {
      let startRange = moment().subtract(5, 'minutes');
      let endRange = moment();
      setRangeTime([moment(startRange, 'YYYY-MM-dd HH:mm:ss'), moment(endRange, 'YYYY-MM-dd HH:mm:ss')]);
      start = startRange.unix();
      end = endRange.unix();
      setStartTime(start)
      setEndTime(end)
    }
    getNodeDataSource({ start: start, selectTimeType: v, end: end })
  }

  // 选择的时间发生改变
  const timeChange = (startValue: any, endValue: any) => {
    setCurtIp("");
    setHostName("");
    setCurrentTableData({})
    let start = 0;
    let end = 0;
    if (selectTimeType === 'lastTime') {
      start = startValue;
      end = 0;
      setStartTime(startValue);
      setEndTime(0);
    } else {
      start = (new Date(startValue).getTime()) / 1000;
      end = (new Date(endValue).getTime()) / 1000;
      setStartTime(start);
      setEndTime(end);
    }
    getNodeDataSource({ start, end })
  }


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
                getNodeDataSource({
                  envCode,
                  appCode: appData?.appCode
                })



              }} loading={envLoading} style={{ width: 200 }} />
            </Form.Item>

          </Form>

          <span>
            {/* <span className="show-time" >
              <Tooltip title={`${getTime()?.[0]}-${getTime()?.[1]}`}>{getTime()?.[0]}-{getTime()?.[1]}</Tooltip>
            </span> */}
            选择时间：
            <Select options={selectOption} onChange={timeTypeChange} value={selectTimeType} size='small' />
            {selectTimeType === 'lastTime' ?
              <Select
                style={{ width: 150 }}
                value={startTime}
                onChange={(value) => {
                  timeChange(value, '')
                }}
              >
                <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select> :
              <RangePicker
                allowClear
                value={rangTime}
                style={{ width: 340 }}
                onChange={(v: any, b: any) => { setRangeTime(v); timeChange(b[0], b[1]) }}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            }
            <Space style={{ marginLeft: 8, marginTop: 2 }}>
              <Button type="primary" icon={<RedoOutlined />} onClick={() => {
                getNodeDataSource({
                  appCode: appData?.appCode
                })
                setCount(count => count + 1)
              }}>刷新</Button>

            </Space>
          </span>
        </div>
      </FilterCard>
      <DetailContext.Provider value={{
        envCode: formInstance?.getFieldsValue()?.envCode,
        appId: curAppID,
        appCode: appData?.appCode,
        startTime: startTime,
        hostIP: curtIP,
        hostName: hostName,
        currentTableData: currentTableData,
        deployName: deployName,
        count: count,
        isClick: isClick,
        podIps: podIps,
        endTime: endTime,
        selectTimeType: selectTimeType
      }}>
        <ContentCard className="traffic-detail-page-content">
          {empty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`该环境下不存在${appCode || appData?.appCode}应用`} /> : <LightDragable
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
