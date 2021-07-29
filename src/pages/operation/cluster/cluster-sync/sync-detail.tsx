// 同步的操作弹层
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:06

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Steps, message } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import './index.less';

export default function ClusterSyncDetail(props: any) {
  const [pending, setPending] = useState(true);
  const [currStep, setCurrStep] = useState<number>(-1);
  const [resultLog, setResultLog] = useState<string>(`
  fdsfdsa
  fd
  <aside>das
  fads
   f
   dsaf
   dsaf
   dsa fds
   afd sa
   fds
   af fdas
   fds afds
   afdsa
   for (const a f
    f in object) {
     if (Object.prototype.hasOwnProperty.call(object, a f
      f)) {
       const value = object[a f
      f];

     }
   }</aside>
  `);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="cluster-sync" history={props.history} />
      <ContentCard className="page-cluster-sync-detail">
        <Steps current={currStep}>
          <Steps.Step title="MQ同步" />
          <Steps.Step title="配置同步" />
          <Steps.Step title="应用同步" />
          <Steps.Step title="前端资源同步" />
          <Steps.Step title="完成" />
        </Steps>
        <pre className="result-log">{resultLog}</pre>
        <div className="action-row">
          <Button type="primary">MQ同步开始</Button>
          <Button type="primary">下一步</Button>
          <Button type="default" onClick={() => props.history.push('./cluster-sync')}>
            取消
          </Button>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
