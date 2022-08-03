import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tooltip, Input } from 'antd';
import Header from '../header';
import { now } from '../../const';
import moment from 'moment';
import './index.less';
import { getErrorApiList, getSlowApiList } from '../../server';
import APIError from './components/api-error';
import SlowApiRequest from './components/slow-api-request';
import SuccessRate from './components/success-rate';

const { TabPane } = Tabs;

interface IProps {
  timeList: any;
  appGroup: string;
  envCode: string;
  feEnv: string;
}

const BasicApi = ({ appGroup, envCode, feEnv, timeList }: IProps) => {
  const [active, setActive] = useState('1');

  // 失败
  const [errorTotal, setErrorTotal] = useState<number>(0);
  const [errorData, setErrorData] = useState<any[]>([]);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);

  // 超时
  const [timeOutTotal, setTimeOutTotal] = useState<number>(0);
  const [timeOutData, setTimeOutData] = useState<any[]>([]);
  const [timeOutLoading, setTimeOutLoading] = useState<boolean>(false);

  function getParam(extra = {}) {
    let param: any = {
      feEnv,
      envCode,
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
      ...extra,
    };
    if (appGroup) {
      param = {
        ...param,
        appGroup,
      };
    }
    return param;
  }

  async function onSearchError() {
    if (errorLoading) {
      return;
    }
    setErrorLoading(true);
    const res = await getErrorApiList(getParam());
    setErrorData(res?.data || []);
    setErrorTotal(res?.data?.length || 0);
    setErrorLoading(false);
  }

  async function onSearchTimeOut() {
    if (timeOutLoading) {
      return;
    }
    setTimeOutLoading(true);
    const res = await getSlowApiList(getParam());
    setTimeOutData(res?.data || []);
    setTimeOutTotal(res?.data?.length || 0);
    setTimeOutLoading(false);
  }

  useEffect(() => {
    changeTabs();
  }, [timeList, appGroup, feEnv]);

  const changeTabs = (tabKey?: string) => {
    const key = tabKey || active;
    switch (key) {
      case '2':
        void onSearchTimeOut();
      default:
        return;
    }
  };

  return (
    <div className="basic-api-wrapper">
      <Tabs
        activeKey={active}
        onChange={(val) => {
          setActive(val);
          changeTabs(val);
        }}
        destroyInactiveTabPane
      >
        <TabPane tab="API失败接口" key="1">
          <div>
            <div className="api-type-title">异常列表</div>
            <APIError type="serverError" getParam={getParam} timeList={timeList} appGroup={appGroup} feEnv={feEnv} />
          </div>
          <div>
            <div className="api-type-title">业务报错</div>
            <APIError type="bizError" getParam={getParam} timeList={timeList} appGroup={appGroup} feEnv={feEnv} />
          </div>
        </TabPane>
        <TabPane tab="慢接口列表" key="2">
          <SlowApiRequest dataSource={timeOutData} loading={timeOutLoading} pageTotal={timeOutTotal} />
        </TabPane>
        <TabPane tab="接口成功率" key="3">
          <SuccessRate getParam={getParam} timeList={timeList} appGroup={appGroup} feEnv={feEnv} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BasicApi;
