import { useState, useEffect } from 'react';
import moment from 'moment';
import ResizablePro from '@/components/resiable-pro';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import LeftList from './components/left-list';
import RrightTrace from './components/right-trace';
import { Form, Select, Button, DatePicker, message, Switch, Divider, Input } from 'antd';
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
  const [listData, setListData] = useState(mockData);
  const [form] = Form.useForm();
  const [selectEnv, setSelectEnv] = useState('');
  const [appID, setAppID] = useState('');
  const [selectTime, setSelectTime] = useState(moment().subtract(2, 'minutes'));
  const [applicationList, setApplicationList] = useState([]);
  const [instanceList, setInstanceList] = useState([]);
  const [envOptions]: any[][] = useEnvOptions();

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
            onFinish={(values: any) => {}}
            onReset={() => {
              form.resetFields();
              // queryNgData({
              //   pageIndex: 1,
              //   pageSize: 20,
              // });
            }}
          >
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
            <Form.Item label="实例" name="ngInstName">
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
            <Form.Item label="端点：" name="">
              <Input placeholder="请输入端点信息" style={{ width: 160 }}></Input>
            </Form.Item>
            <Form.Item label="traceID：" name="">
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
          </Form>
        </div>

        {/* 右边详情展示部分 */}
        <div style={{ height: '100%' }} className="detail-main">
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
