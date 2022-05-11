import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import ResizablePro from '@/components/resiable-pro';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import LeftList from './components/left-list';
import RrightTrace from './components/right-trace';
import { Form, Select, Button, DatePicker, message, Switch, Divider, Input } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { getApplicationList, getInstance, getTrace } from '../service';
const { RangePicker } = DatePicker;
import { useEnvOptions } from '../hooks';
import './index.less';

const mockData = [
  {
    traceID: 'hbos-dtc1/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 1,
    duration: '91',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc2/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 2,
    duration: '92',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc3/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 3,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc4/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 4,
    duration: '97',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc5/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 5,
    duration: '98',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc6/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 6,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc7/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 7,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc8/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 8,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc9/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 9,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc10/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 10,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
  {
    traceID: 'hbos-dtc11/com.c2f.hbos.dtsfa.client.heacthoasdfjsdljfldsfldsjfld',
    id: 11,
    duration: '95',
    time: '2022-05-09 15:28:23',
  },
];
export default function Tracking() {
  // const [envOptions, setEnvOptions] = useState([]);
  const [listData, setListData] = useState([]);
  const [form] = Form.useForm();
  const [selectEnv, setSelectEnv] = useState('');
  const [appID, setAppID] = useState('');
  const [selectTime, setSelectTime] = useState(moment().subtract(2, 'minutes'));
  const [applicationList, setApplicationList] = useState([]);
  const [instanceList, setInstanceList] = useState([]);
  const [envOptions]: any[][] = useEnvOptions();
  const [loading, setLoading] = useState<boolean>(false);
  const [expand, setIsExpand] = useState<boolean>(false);

  const btnMessageList = [
    { expand: true, label: '收起更多', icon: <CaretUpOutlined /> },
    { expand: false, label: '更多查询', icon: <CaretDownOutlined /> },
  ];

  const btnMessage: any = useMemo(() => btnMessageList.find((item: any) => item.expand === expand), [expand]);

  useEffect(() => {
    setSelectEnv(envOptions[0]?.value);
  }, [envOptions]);

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

  const queryTraceList = (params: any) => {
    setLoading(true);
    getTrace({ ...params }).then((res) => {
      if (res) {
        setListData(res?.data?.traces);
      }
    });
  };

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
            <RangePicker showTime onChange={(v) => {}} />
          </div>
        </div>
        <Divider />
        <div style={{ marginBottom: '20px' }}>
          <Form
            layout="inline"
            form={form}
            onFinish={(values: any) => {
              queryTraceList({
                ...values,
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
          <ResizablePro
            leftComp={<LeftList listData={listData}></LeftList>}
            rightComp={<RrightTrace></RrightTrace>}
            leftWidth={400}
          ></ResizablePro>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
