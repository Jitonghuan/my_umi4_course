import { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import moment from 'moment';
import ResizablePro from '@/components/resiable-pro';
import { ContentCard, } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import LeftList from './components/left-list';
import { history, useLocation } from 'umi';
import RrightTrace from './components/right-trace';
import { Form, Select, Button, DatePicker, Divider, Input, Empty } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { getApplicationList, getInstance, getTrace, getEnvs, getTraceInfo } from '../service';
import { leftItem } from './type';
const { RangePicker } = DatePicker;
import './index.less';

const START_TIME_ENUMS = [
  {
    label: '最近15分钟',
    value: 15 * 60 * 1000,
  },
  {
    label: '最近30分钟',
    value: 30 * 60 * 1000,
  },
  {
    label: '最近1小时',
    value: 60 * 60 * 1000,
  },
  {
    label: '最近1天',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: '最近一周',
    value: 24 * 60 * 60 * 1000 * 7,
  },
  {
    label: '最近一月',
    value: 24 * 60 * 60 * 1000 * 30,
  },
];

export default function Tracking() {
  let location: any = useLocation();
  const infoRecord: any = location.state || {};
  const [listData, setListData] = useState<leftItem[]>(); //左侧list数据
  const [rightData, setRightData] = useState<any>([]); //右侧渲染图的数据
  const [form] = Form.useForm();
  const [selectEnv, setSelectEnv] = useState<string>('');
  const [appID, setAppID] = useState('');
  const [selectTime, setSelectTime] = useState<any>({
    start: moment().subtract(15, 'minute'),
    end: moment(),
  });
  const [applicationList, setApplicationList] = useState([]);
  const [instanceList, setInstanceList] = useState([]);
  const [envOptions, setEnvOptions] = useState<any>([]);
  const [expand, setIsExpand] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false); //左侧列表的loading
  const [rightLoading, setRightLoading] = useState<boolean>(false); //右侧的loading
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [timeOption, setTimeOption] = useState<number>(Number(15 * 60 * 1000));
  const [noiseList, setNoiseList] = useState<any>([]);
  const [first, setFirst] = useState<boolean>(true);

  const btnMessageList = [
    { expand: true, label: '收起更多', icon: <CaretUpOutlined /> },
    { expand: false, label: '更多查询', icon: <CaretDownOutlined /> },
  ];

  const btnMessage: any = useMemo(() => btnMessageList.find((item: any) => item.expand === expand), [expand]);

  // 降噪数据前端过滤处理
  const filterData = useMemo(() => {
    const copyData = JSON.parse(JSON.stringify(rightData));
    // 忽略处理
    const ignoreList = noiseList
      .filter((item: any) => item.noiseReductionMeasure === 'ignore')
      .map((item: any) => item.noiseReductionComponent);
    const filterIgnore = (arr: any, ignoreOptions: any) => {
      if (!ignoreOptions.length) return arr;
      return arr.filter((e: any) => {
        if (e?.children?.length) {
          e.children = filterIgnore(e.children, ignoreOptions);
        }
        return !ignoreOptions.includes(e.component);
      });
    };
    // 合并处理
    const mergeList = noiseList
      .filter((item: any) => item.noiseReductionMeasure === 'merge')
      .map((item: any) => item.noiseReductionComponent);
    const handleMerge = (arr: any, mergeOptions: any) => {
      if (!mergeOptions) return arr;
      return arr.reduce((res: any, current: any) => {
        if (current?.children?.length) {
          current.children = handleMerge(current.children, mergeList);
        }
        if (mergeList.includes(current?.component) && res?.length !== 0) {
          const preData = res[res.length - 1];
          if (current?.component === preData?.component) {
            if (!preData.isMerged) {
              preData.isMerged = true;
              preData.endpointName = preData.component + ' [merge span]';
              preData.children = [];
            }
            preData.durations = preData.durations + current.durations;
            preData.selfDurations = preData.selfDurations + current.selfDurations;
            preData.endTime = current.endTime;
            return res;
          }
        }
        return res.concat(current);
      }, []);
    };
    // 先处理完忽略 再处理合并
    return handleMerge(filterIgnore(copyData, ignoreList), mergeList);
  }, [rightData, noiseList]);
  useLayoutEffect(() => {
    if (infoRecord?.entry === "logSearch") {
      setIsExpand(true)

    }
  }, [infoRecord?.entry])
  //获取环境列表
  useEffect(() => {
    getEnvs().then((res: any) => {
      if (res && res.success) {
        const data = res?.data?.envs.map((item: any) => ({ label: item.envName, value: item.envCode }));
        setEnvOptions(data);
      }
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ traceState: 'ALL' });
  }, []);

  useEffect(() => {

    if (infoRecord?.entry === "logSearch") {
      setSelectEnv(infoRecord?.envCode)

    } else if (envOptions.length !== 0 && infoRecord?.entry !== "logSearch") {
      setSelectEnv(envOptions[0]?.value);
    }
  }, [envOptions]);


  useEffect(() => {
    if (selectEnv) {
      form.resetFields();
      setFirst(true);
      setApplicationList([]);
      // queryTraceList({ pageIndex: 1, pageSize: 20 });
      setInstanceList([]);
      getAppList();
    }
  }, [selectEnv]);

  useEffect(() => {
    if (!first && infoRecord?.entry !== "logSearch") {

      queryTraceList({ pageIndex: 1, pageSize: 20, });
    }

  }, [selectTime]);


  useEffect(() => {
    if (selectEnv && appID) {
      form.setFieldsValue({ instanceCode: '' });
      getIns();
    }
  }, [selectEnv, appID]);



  useEffect(() => {
    if (infoRecord?.entry && infoRecord?.entry === "logSearch") {
      form.setFieldsValue({
        traceID: infoRecord?.traceId,
        endpoint: infoRecord?.endpoint,
        // appID:infoRecord?.appCode||""
      })
      if (infoRecord?.appId) {
        form.setFieldsValue({

          appID: infoRecord?.appId || ""
        })
      }

      setSelectTime({
        start: moment(infoRecord?.startTime * 1000)
        , end: moment(infoRecord?.endTime * 1000)
      });

    }
  }, [infoRecord?.traceId, infoRecord?.entry, infoRecord?.startTime, infoRecord?.endTime, expand])
  useEffect(() => {
    if (selectEnv && selectTime && infoRecord?.entry === "logSearch" && first) {


      queryTraceList({ pageIndex: 1, pageSize: 20 });

    }

  }, [selectEnv, selectTime,])

  // 获取右侧图的数据
  useEffect(() => {
    if (currentItem && currentItem?.traceIds && currentItem?.traceIds?.length !== 0) {
      queryTreeData();
    }
  }, [currentItem]);

  // 降噪下拉框发生改变时
  const noiseChange = (value: number[], options: any) => {
    const selectOptions = options.filter((item: any) => value.includes(item.id));
    setNoiseList(selectOptions);
  };

  // 获取localStore中存储的降噪id
  const getNoiseIds = () => {
    const storeIdList = JSON.parse(localStorage.getItem('trace_noise_list') || '[]');
    return storeIdList.map((item: any) => item.value);
  };

  //获取应用
  const getAppList = () => {
    const start = moment(selectTime.start).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(selectTime.end).format('YYYY-MM-DD HH:mm:ss');
    getApplicationList({ envCode: selectEnv, start, end })
      .then((res: any) => {
        if (res && res.success) {
          const data = res?.data?.map((item: any) => ({ ...item, value: item.key }));
          setApplicationList(data);
        }
      })
      .catch(() => setApplicationList([]));
  };

  // 获取实例
  const getIns = () => {
    const start = moment(selectTime.start).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(selectTime.end).format('YYYY-MM-DD HH:mm:ss');
    getInstance({ envCode: selectEnv, appID: appID, start, end })
      .then((res: any) => {
        if (res && res.success) {
          const data = res?.data?.map((item: any) => ({ ...item, value: item.key }));
          setInstanceList(data);
        }
      })
      .catch(() => {
        setInstanceList([]);
      });
  };

  // 获取左侧list数据
  const queryTraceList = (params: any) => {
    setFirst(false);

    setLoading(true);
    setCurrentItem({});
    // setListData([]);
    setRightLoading(true);
    const values = form.getFieldsValue();

    const start = moment(selectTime.start).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(selectTime.end).format('YYYY-MM-DD HH:mm:ss');
    getTrace({ ...values, ...params, end, start, envCode: selectEnv || infoRecord?.envCode, noiseReductionIDs: getNoiseIds() })
      .then((res: any) => {
        if (res) {
          setListData(res?.data?.dataSource);
          setTotal(res?.data?.pageInfo?.total);
          if (res?.data?.dataSource?.length === 0 || !res?.success) {
            setRightData([]);
            setRightLoading(false);
          }
        }
      })
      .catch((e) => {
        setRightLoading(false);
      })
      .finally(() => {
        setLoading(false);

        // setRightLoading(false)
      });
  };

  // 获取右侧数据
  const queryTreeData = () => {
    if (!currentItem?.traceIds || !currentItem?.traceIds[0]) return;
    setRightLoading(true);
    getTraceInfo({ traceID: currentItem?.traceIds[0], envCode: selectEnv })
      .then((res: any) => {
        if (res?.success && res?.data) {
          const max = parseInt(res?.data?.endTime) - parseInt(res?.data?.startTime);
          const handleData = (data: any) => {
            if (!data) {
              return;
            }
            if (data?.children && data?.children?.length !== 0) {
              data.children.map((e: any) => handleData(e));
            } else {
              data.children = [];
            }
            data.key = data.id;
            data.allDurations = max; //该条链路总执行时间
            data.durations = parseInt(data.endTime) - parseInt(data.startTime); //执行时间
            const self = data.durations - data.children.reduce((p: number, c: any) => p + c.durations, 0);
            data.selfDurations = self < 0 ? 0 : self; //自身执行时间
            return data;
          };
          const rightData = handleData(res?.data);
          setRightData([rightData]);
        }
      })
      .finally(() => {
        setRightLoading(false);
      });
  };

  const leftItemChange = (value: leftItem) => {
    setCurrentItem(value);
  };

  const timeOptionChange = (value: number) => {
    setTimeOption(value);
    const now = new Date().getTime();
    const start = moment(Number(now - value));
    const end = moment(now);
    setSelectTime({ start, end });
  };
  // 处理数据 将list转化成tree格式
  function listToTree(list: any) {
    var map: any = {};
    var node = null;
    var roots = [];
    for (let i = 0; i < list.length; i++) {
      map[list[i].spanId] = i; // 初始化map
      list[i].key = list[i].spanId;
      list[i].children = undefined;
    }
    for (let j = 0; j < list.length; j++) {
      node = list[j];
      if (node.parentSpanId !== 0) {
        list[map[node.parentSpanId]].children = list[map[node.parentSpanId]].children || []; // 初始化children
        list[map[node.parentSpanId]]?.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  return (
    <PageContainer className="tracking-container">
      <ContentCard className="trace-detail-page" style={{ height: '100%' }}>
        <div className="detail-top">
          <div>
            选择环境：
            <Select
              options={envOptions}
              value={selectEnv}
              onChange={(env) => {
                setSelectEnv(env);
              }}
              showSearch
              style={{ width: 200 }}
            />
          </div>
          <div>
            时间范围：
            <RangePicker
              showTime
              allowClear={false}
              onChange={(v: any, time: any) => {
                setSelectTime({ start: time[0], end: time[1] });
              }}
              value={[moment(selectTime.start), moment(selectTime.end)]}
              format="YYYY-MM-DD HH:mm:ss"
            // defaultValue={[moment(moment().subtract(15, 'minute')), moment()]}
            />
            <Select value={timeOption} onChange={timeOptionChange} style={{ width: 140 }}>
              {START_TIME_ENUMS.map((time) => (
                <Select.Option key={time.value} value={time.value}>
                  {time.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Divider style={{ marginTop: 2, marginBottom: 0 }} />
        <div className="search-form" style={{ marginBottom: '6px' }}>
          <Form
            layout="inline"
            form={form}
            onFinish={() => {
              queryTraceList({
                pageIndex: 1,
                pageSize: 20,
              });
              if (infoRecord?.entry === "logSearch") {
                history.replace({
                  pathname: "/matrix/trafficmap/tracking",

                }, {})

              }
            }}
            onReset={() => {
              form.resetFields();
              setCurrentItem({});
              if (infoRecord?.entry === "logSearch") {
                history.replace({
                  pathname: "/matrix/trafficmap/tracking",

                }, {})

              }
              queryTraceList({
                pageIndex: 1,
                pageSize: 20,
              });
            }}
          >
            {expand && (
              <Form.Item label="应用" name="appID">
                <Select
                  value={appID}
                  options={applicationList}
                  onChange={(value) => {
                    setAppID(value);
                  }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => {
                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                  style={{ width: 160 }}
                />
              </Form.Item>
            )}
            {expand && (
              <Form.Item label="实例" name="instanceCode">
                <Select
                  options={instanceList}
                  showSearch
                  allowClear
                  style={{ width: 150 }}
                  optionFilterProp="label"
                  filterOption={(input, option) => {
                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                />
              </Form.Item>
            )}
            {expand && (
              <Form.Item label="状态：" name="traceState">
                <Select style={{ width: 100 }}>
                  <Select.Option value={'ALL'}>全部</Select.Option>
                  <Select.Option value={'SUCCESS'}>成功</Select.Option>
                  <Select.Option value={'ERROR'}>失败</Select.Option>
                </Select>
              </Form.Item>
            )}
            {expand && (
              <Form.Item label="端点：" name="endpoint">
                <Input placeholder="请输入端点信息" style={{ width: 140 }}></Input>
              </Form.Item>
            )}
            <Form.Item label="traceID：" name="traceID">
              <Input placeholder="请输入traceID" style={{ width: 300 }}></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
                重置
              </Button>
            </Form.Item>
            <Button
              type="link"
              onClick={() => {
                setIsExpand(!expand);
              }}
            >
              {btnMessage?.label}
              <span style={{ marginLeft: '3px', marginTop: 5 }}>{btnMessage?.icon}</span>
            </Button>
          </Form>
        </div>

        <div className="detail-main">
          {first ? (
            <div className="empty-holder">请点击查询进行搜索</div>
          ) : (
            <ResizablePro
              leftComp={
                <LeftList
                  listData={listData || []}
                  total={total}
                  loading={loading}
                  changeItem={leftItemChange}
                  pageChange={queryTraceList}
                />
              }
              rightComp={
                filterData?.length !== 0 || rightLoading ? (
                  <RrightTrace
                    item={currentItem || {}}
                    data={filterData}
                    envCode={selectEnv}
                    selectTime={selectTime}
                    noiseChange={noiseChange}
                    loading={rightLoading}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', overflow: 'hidden' }} />
                )
              }
              isShowExpandIcon
              defaultClose
              leftWidth={240}
            ></ResizablePro>
          )}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
