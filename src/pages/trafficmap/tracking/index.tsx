import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import ResizablePro from '@/components/resiable-pro';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import LeftList from './components/left-list';
import RrightTrace from './components/right-trace';
import { Form, Select, Button, DatePicker, message, Switch, Divider, Input, Spin, Empty } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { getApplicationList, getInstance, getTrace, getTraceInfo } from '../service';
const { RangePicker } = DatePicker;
import { useEnvOptions } from '../hooks';
import './index.less';

const mockData = [
  {
    traceId: 'hahah',
    spanId: 1,
    parentSpanId: 0,
    endpointName: 'homepage-level1',
    startTime: '2022-5-12 23:12:12',
    durations: '890',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'lalla',
    spanId: 2,
    parentSpanId: 1,
    endpointName: 'homepage-level2',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'xixix',
    spanId: 3,
    parentSpanId: 1,
    endpointName: 'homepage-level2',
    startTime: '2022-5-12 23:12:12',
    durations: '200',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'memme',
    spanId: 4,
    parentSpanId: 1,
    endpointName: 'homepage-level2',
    startTime: '2022-5-12 23:12:12',
    durations: '300',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'hhah',
    spanId: 5,
    parentSpanId: 2,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '400',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'sopring',
    spanId: 6,
    parentSpanId: 2,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '500',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: '1weljfdf',
    spanId: 7,
    parentSpanId: 2,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '234',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'asfv',
    spanId: 8,
    parentSpanId: 3,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '23',
    icon: <CaretUpOutlined />,
  },
  {
    traceId: 'lgsd',
    spanId: 9,
    parentSpanId: 3,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: 'glnb',
    spanId: 10,
    parentSpanId: 4,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '672',
  },
  {
    traceId: 'lfsd',
    spanId: 11,
    parentSpanId: 4,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '235',
  },
  {
    traceId: '1sfsdf',
    spanId: 12,
    parentSpanId: 4,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '234',
  },
  {
    traceId: '1fasdf',
    spanId: 13,
    parentSpanId: 5,
    endpointName: 'homepage-level4',
    startTime: '2022-5-12 23:12:12',
    durations: '672',
    icon: <CaretUpOutlined />,
  },
];
export default function Tracking() {
  // const [envOptions, setEnvOptions] = useState([]);
  const [listData, setListData] = useState([]); //左侧list数据
  const [rightData, setRightData] = useState<any>([]); //右侧渲染图的数据
  const [form] = Form.useForm();
  const [selectEnv, setSelectEnv] = useState('');
  const [appID, setAppID] = useState('');
  const [selectTime, setSelectTime] = useState<moment.Moment[]>();
  const [applicationList, setApplicationList] = useState([]);
  const [instanceList, setInstanceList] = useState([]);
  const [envOptions]: any[][] = useEnvOptions();
  const [expand, setIsExpand] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [spinning, setSpinning] = useState<boolean>(false);

  const btnMessageList = [
    { expand: true, label: '收起更多', icon: <CaretUpOutlined /> },
    { expand: false, label: '更多查询', icon: <CaretDownOutlined /> },
  ];

  const btnMessage: any = useMemo(() => btnMessageList.find((item: any) => item.expand === expand), [expand]);

  useEffect(() => {
    setSelectEnv(envOptions[0]?.value);
  }, [envOptions]);

  useEffect(() => {
    queryTraceList({ pageIndex: 1, pageSize: 20 });
  }, [selectTime, selectEnv]);

  useEffect(() => {
    // getTraceInfo({traceID:currentItem?.traceID}).then((res)=>{
    // })
    setRightData(listToTree(mockData));
  }, [currentItem]);

  useEffect(() => {
    if (selectEnv) {
      try {
        getApplicationList({ envCode: selectEnv }).then((res) => {
          if (res) {
            const data = res?.data?.map((item: any) => ({ ...item, value: item.key }));
            setApplicationList(data);
          }
        });
      } catch (error) {
        setApplicationList([]);
      }
    }
  }, [selectEnv]);

  useEffect(() => {
    if (appID) {
      try {
        getInstance({ envCode: selectEnv, appID }).then((res) => {
          if (res) {
            const data = res?.data?.map((item: any) => ({ ...item, value: item.key }));
            setInstanceList(data);
          }
        });
      } catch (error) {
        setInstanceList([]);
      }
    }
  }, [appID]);

  // 获取左侧list数据
  const queryTraceList = (params: any) => {
    setSpinning(true);
    const values = form.getFieldsValue();
    getTrace({ ...params, ...values, envCode: selectEnv })
      .then((res) => {
        if (res) {
          setListData(res?.data?.traces);
        }
      })
      .finally(() => {
        setSpinning(false);
      });
  };

  const leftItemChange = (value: any) => {
    setCurrentItem(value);
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

  const timeChange = () => {};
  return (
    <PageContainer>
      <ContentCard className="trace-detail-page" style={{ height: '100%' }}>
        <div className="detail-top">
          <div>
            选择环境：
            <Select
              options={envOptions}
              value={selectEnv}
              onChange={(env, option: any) => {
                setSelectEnv(env);
              }}
              showSearch
              style={{ width: 140 }}
            />
          </div>
          <div>
            时间范围：
            <RangePicker
              showTime
              value={selectTime as any}
              onChange={(v: any) => {
                setSelectTime(v);
              }}
            />
          </div>
        </div>
        <Divider />
        <div style={{ marginBottom: '20px' }}>
          <Form
            layout="inline"
            form={form}
            onFinish={(values: any) => {
              queryTraceList({
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              form.resetFields();
              // queryNgData({
              //   pageIndex: 1,
              //   pageSize: 20,
              // });
            }}
          >
            {expand && (
              <Form.Item label="应用" name="application">
                <Select
                  value={appID}
                  options={applicationList}
                  onChange={(value) => {
                    setAppID(value);
                  }}
                  showSearch
                  style={{ width: 160 }}
                />
              </Form.Item>
            )}
            {expand && (
              <Form.Item label="实例" name="instanceCode">
                <Select
                  options={instanceList}
                  // onChange={(value) => {
                  //   console.log
                  //   // setInstanceList(value);
                  // }}
                  showSearch
                  style={{ width: 160 }}
                />
              </Form.Item>
            )}
            {expand && (
              <Form.Item label="端点：" name="endpoint">
                <Input placeholder="请输入端点信息" style={{ width: 160 }}></Input>
              </Form.Item>
            )}
            <Form.Item label="traceID：" name="traceID">
              <Input placeholder="请输入traceID" style={{ width: 180 }}></Input>
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
              <span style={{ marginLeft: '3px' }}>{btnMessage?.icon}</span>
            </Button>
          </Form>
        </div>

        {/* 右边详情展示部分 */}
        <div className="detail-main">
          {/* <Spin spinning={spinning} > */}

          <ResizablePro
            leftComp={<LeftList listData={listData} changeItem={leftItemChange} />}
            rightComp={
              listData.length !== 0 ? (
                <RrightTrace item={currentItem} data={rightData} />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', overflow: 'hidden' }} />
              )
            }
            leftWidth={400}
          ></ResizablePro>
          {/* </Spin> */}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
