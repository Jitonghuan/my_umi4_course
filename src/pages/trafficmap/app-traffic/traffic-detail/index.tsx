import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { Space, Form, Select, Tooltip, Button, Spin, Empty, Badge, message, DatePicker } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { START_TIME_ENUMS, selectOption } from './schema';
import { history, useLocation } from 'umi';
import moment from 'moment';
import { RedoOutlined } from '@ant-design/icons';
import LightDragable from "@/components/light-dragable";
import ListDetail from './components/list-detail';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { queryAppList, queryEnvList, queryNodeList, getCountOverview ,queryTrafficList} from './hook';
import DetailContext from './context';
import './index.less';
import { throttle } from 'lodash';
const { RangePicker } = DatePicker;
interface nodeDataSourceItems{
  start?: number, 
  end?: number,
  envCode?: string, 
  appCode?: string, 
  appId?: string, 
  deployName?: string, 
  selectTimeType?: string,
  ip?:string;
   hostName?:string 
}

export default function TrafficDetail() {

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
  const [podIps, setPodIps] = useState<any>([])
  // pod ip
  const [curtIP, setCurtIp] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(5 * 60 * 1000);
  const [endTime, setEndTime] = useState<number>();
  const [count, setCount] = useState<number>(0);
  const [selectTimeType, setSelectTimeType] = useState<string>('lastTime');
  const [rangTime, setRangeTime] = useState<any>([]);
  const [nowTab,setNowTab]=useState<string>("")
  const getNowTab=(tab:string)=>{
    setNowTab(tab)

  }
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
      getNodeDataSource({
        appId: curRecord?.appId
      })
    }
  }, [])
  const [empty, setEmpty] = useState<boolean>(false)
  // 查询应用列表
  const queryApps = (params: {
    envCode: string;
    startTime: number;
    endTime?: number;
    selectTimeType?: string;
  }) => {
    setAppLoading(true)
    const now = new Date().getTime();
    const type = params?.selectTimeType || selectTimeType;
    const startTimestamp = type === 'lastTime' ? Number((now - params?.startTime) / 1000) + "" : (params?.startTime || startTime) + '';
    const endTimestamp = type === 'lastTime' ? Number((now ) / 1000) + "" : (params.endTime || endTime) + '';
    queryAppList({
      envCode: params?.envCode,
      start: startTimestamp,
      end: endTimestamp,
      isPreciseApp:true,
      keyWord:formInstance?.getFieldValue("appCode")
      
    }).then(() => {
      queryAppList({
        envCode: params?.envCode,
        start: startTimestamp,
        end: endTimestamp,
        needMetric: true,
        isPreciseApp:true,
        keyWord:formInstance?.getFieldValue("appCode")
      }).then((resp) => {
        setAppOptions(resp);
        const appIndex = resp.findIndex((item: any) => item.value == curRecord?.appCode);
        if (appIndex === -1) {
          setEmpty(true)
        }
        if (appIndex !== -1) {
          setEmpty(false)
        }

      })

    }).finally(() => {
      setAppLoading(false)
    })
  }
  const queryEnvs = () => {
    setEnvLoading(true)
    queryEnvList(curRecord?.appCode||"").then((resp) => {
      let options:any=[];
      (resp||[])?.map((ele:any)=>{
        if(!ele?.value?.toLowerCase()?.includes("clusterb")){
         options.push(ele)
        }
      })
      setEnvOptions(options)
    }).finally(() => {
      setEnvLoading(false)
    })
  }
  //获取左侧数据
  const getNodeDataSource = (params?:nodeDataSourceItems) => {
    setLoading(true)
    params = params || {}
    params.start = params?.start || startTime;
    params.end = params?.end || endTime;
    const { start, end } = params;
    const now = new Date().getTime();
    const type = params?.selectTimeType || selectTimeType;
    const startTimestamp: any = type === 'lastTime' ? Number((now - start) / 1000) + "" : start;
    const endTimestamp: any = type === 'lastTime' ? Number((now ) / 1000) + "" : end;
    let curEnv = params?.envCode ? params?.envCode : formInstance.getFieldsValue()?.envCode
    let curApp = params?.appCode ? params?.appCode : formInstance.getFieldsValue()?.appCode
    let curAppId = params?.appId ? params?.appId : curAppID
    let curDeployName = params?.deployName ? params?.deployName : deployName
    queryNodeList({
      //@ts-ignore
      start: startTimestamp,
      end: endTimestamp,
      appCode: curApp,
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
      setNodeDataSource(res)
      setCurrentTableData(res[0])
      if (curAppId !== "") {
        queryCountOverview({
          start: moment(new Date(Number(startTimestamp) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(new Date(Number(endTimestamp) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
          appId: curAppId,
          envCode: curEnv,
          deployName: curDeployName,
          podIps

        })

      } else {
        message.warning("调用信息为空，请刷新重试!")
      }

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

  const getClickData=(params?:nodeDataSourceItems)=>{
    const now = new Date().getTime();
    const type = params?.selectTimeType || selectTimeType;
    const startTimestamp: any = type === 'lastTime' ? Number((now - startTime) / 1000) + "" : startTime;
    const endTimestamp: any = type === 'lastTime' ? Number((now ) / 1000) + "" : endTime;
    let curEnv = formInstance.getFieldsValue()?.envCode
      queryTrafficList({
        envCode: curEnv,
        start: startTimestamp,
        end: endTimestamp,
        needMetric: true,
        isPreciseApp:true,
        keyWord:formInstance?.getFieldValue("appCode"),
        ip:params?.ip,
        hostName:params?.hostName
      }).then((resp) => {
        setCurrentTableData(resp[0])
       
      })



  }

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
                }
                else {
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
            {nodeDataSource?.length > 0 &&nowTab!=="call" && nodeDataSource?.map((element: any, index: number) => {
              const nowData = countOverView?.instanceCallInfos?.filter((item: any) => item?.instanceIp === element?.hostIP)

              const instanceRt = nowData?.length > 0 ? Number(nowData[0]?.instanceRt || 0).toFixed(2) : "0";
              const requestCounts = nowData?.length > 0 ? nowData[0]?.requestCounts : "0";
              const requestFailures = nowData?.length > 0 ? nowData[0]?.requestFailures : "0"
              return (
                <ul>
                  <li className={`left-content-detail-info ${index === isClick ? "is-click" : "not-click"}`}>
                    <span><span style={{ paddingRight: 8 }}>{element?.health === 0 ? <Badge status="error" /> : <Badge status="success" />}</span>
                    <span className={`title-ip`} onClick={() => {
                      setIsClick(index)
                      setCurtIp(element?.hostIP);
                      setHostName(element?.hostName);
                      getClickData({
                      selectTimeType: selectTimeType,
                       ip:element?.hostIP,
                       hostName:element?.hostName

                      })
                      // setCurrentTableData(element)
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
  }, [nodeDataSource, loading, countOverView,nowTab, isCountHovering, isFailHovering, isRTHovering, appCode, isClick, empty])
  const rightContent = useMemo(() => {
    return (
      <>
        <ListDetail  getNowTab={(tab:string)=>{getNowTab(tab)}}/>

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



  const timeTypeChange = (v: string) => {
    setCurtIp("");
    setHostName("");
    setCurrentTableData({});
    setSelectTimeType(v);
    let start, end;
    if (v === 'lastTime') {
      start = 6 * 60 * 1000;
      end = 0;
      setStartTime(start);
      setEndTime(end);
    } else {
      let startRange = moment().subtract(6, 'minutes');
      let endRange = moment().subtract(1, 'minutes');
      setRangeTime([moment(startRange, 'YYYY-MM-dd HH:mm:ss'), moment(endRange, 'YYYY-MM-dd HH:mm:ss')]);
      start = startRange.unix();
      end = endRange.unix();
      setStartTime(start)
      setEndTime(end)
    }
    queryApps({
      envCode: formInstance.getFieldsValue()?.envCode,
      startTime: start,
      endTime: end,
      selectTimeType: v,
    })
    getNodeDataSource({ start: start, selectTimeType: v, end: end })
  }

  // 选择的时间发生改变
  const timeChange = (startValue: any, endValue: any) => {
    setCurtIp("");
    setHostName("");
    setCurrentTableData({});
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
    queryApps({
      envCode: formInstance.getFieldsValue()?.envCode,
      startTime: start,
      endTime: end
    })
    getNodeDataSource({ start, end })
  }


  // 时间组件 只能选择当前时间往前的时间 且当前这一分钟不可选
  const disabledDate = (current: any) => {
    return  current < moment().subtract(7, 'days').endOf('day') || current > moment().subtract(0, 'days').endOf('day')
  }

  function range(start: any, end: any) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledTime: any = (current: any, partial: any) => {
    const runStartTime= moment().subtract( 7,'days',).format('YYYY-MM-DD HH:mm:ss');
    const runEndTime=moment().format('YYYY-MM-DD HH:mm:ss')
    const startHours = Number(moment(runStartTime).hours());
    const endHours = Number(moment(runEndTime).hours());
    const startMinutes = Number(moment(runStartTime).minutes());
    const endMinutes = Number(moment(runEndTime).minutes());
    const startSeconds = Number(moment(runStartTime).seconds());
    const endSeconds = Number(moment(runEndTime).seconds());
    if (current) {
      const startDate = moment(runStartTime).endOf("days").date();
      const endDate = moment(runEndTime).endOf("days").date();
      if (current.date() === startDate) {
        return {
          disabledHours: () => range(0, startHours),
          disabledMinutes: () => range(0, startMinutes),
          disabledSeconds: () => range(0, startSeconds),
        }
      }

      if (current.date() === endDate) {
        return {
          disabledHours: () => range( endHours+1,24),
          disabledMinutes: () => range(endMinutes,60),
          disabledSeconds: () => range(endSeconds+1,60),
        }
      }
    }
  }

  const refresh = useCallback((throttle((id, cur, Options, paramsCount) => {
    if (id === "") {
      const nowAppId: any = Options?.filter((item: any) => item?.value === cur?.appCode)
      getNodeDataSource({
        appId: nowAppId?.length > 0 ? nowAppId[0]?.appId : "",
        deployName: nowAppId?.length > 0 ? nowAppId[0]?.deployName : ""
      })
      setCurAppID(nowAppId?.length > 0 ? nowAppId[0]?.appId : "")
      setCount(paramsCount + 1)
      setDeployName(nowAppId?.length > 0 ? nowAppId[0]?.deployName : "")
    } else {
      getNodeDataSource()
      setCount(paramsCount + 1)
    }
  }, 3000, { trailing: false })), [])

  return (
    <PageContainer className="traffic-detail-page">
      <FilterCard className="traffic-detail-page-header">
        <div className="traffic-detail-filter">
          <Form form={formInstance} layout="inline" className="monitor-filter-form" >

            <Form.Item label="选择环境" name="envCode">
              <Select showSearch options={envOptions}
                 optionFilterProp="label"
                 filterOption={(input, option) => {
                   //@ts-ignore
                   return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                 }}
               onChange={(envCode) => {
                setCurtIp("");
                setHostName("");
                setCurrentTableData({})
                queryApps({
                  envCode,
                  startTime: startTime,
                })
                getNodeDataSource({
                  envCode,
                })
              }}
                loading={envLoading}
                style={{ width: 180 }} />
            </Form.Item>
            <Form.Item label="选择应用" name="appCode">
              <Select showSearch options={appOptions} onChange={(appCode, option: any) => {
                setCurtIp("");
                setHostName("");
                setCurrentTableData({})
                setIsClick(appCode)
                setCurAppID(option?.appId)
                setAppCode(appCode)
                setDeployName(option?.deployName)
                getNodeDataSource({
                  appCode,
                  deployName: option?.deployName,
                  appId: option?.appId,

                })

              }} loading={appLoading} style={{ width: 180 }} />
            </Form.Item>
          </Form>

          <span style={{ textAlign: "right" }}>
            <Tooltip title="基于数据统计的准确性，这里的统计时间会取当前时间的前一分钟为基值。" placement="top">
              <QuestionCircleOutlined style={{ marginRight: 4 }} />
            </Tooltip>
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
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                style={{ width: 340 }}
                onChange={(v: any, b: any) => { setRangeTime(v); timeChange(b[0], b[1]) }}
                showTime={{
                  // hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            }
            <Space style={{ marginLeft: 8, marginTop: 2 }}>
              <Button type="primary" size='small' icon={<RedoOutlined />} onClick={() => { refresh(curAppID, curRecord, appOptions, count) }}>刷新</Button>
              <span><Button type="primary" size='small' ghost onClick={() => {
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
        appCode: formInstance?.getFieldsValue()?.appCode || curRecord?.appCode,
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
          {empty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`该环境下不存在${appCode || curRecord?.appCode}应用`} /> : <LightDragable
            showIcon={true}
            leftContent={leftContent}
            rightContent={
              rightContent
            }
            initWidth={329}
            least={20}
            isSonPage={true}
            closeTag={nowTab==="call"}
           
          />}

        </ContentCard>
      </DetailContext.Provider>
    </PageContainer>
  );
}
