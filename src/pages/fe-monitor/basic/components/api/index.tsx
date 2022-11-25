import React, { useState } from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import './index.less';
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

  return (
    <div className="basic-api-wrapper">
      <Tabs
        activeKey={active}
        onChange={(val) => {
          setActive(val);
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
          <SlowApiRequest getParam={getParam} timeList={timeList} appGroup={appGroup} feEnv={feEnv} />
        </TabPane>
        <TabPane tab="接口成功率" key="3">
          <SuccessRate getParam={getParam} timeList={timeList} appGroup={appGroup} feEnv={feEnv} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BasicApi;
