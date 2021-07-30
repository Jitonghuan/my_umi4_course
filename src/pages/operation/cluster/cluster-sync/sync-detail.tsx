// 同步的操作弹层
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:06

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Steps, message, Spin } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import './index.less';

/**
 * - `DiffApp`: 单应用比对
 * - `DeployApp`: 单应用发布
 * - `GetDiffClusterApp`: 集群应用比对
 * - `GetDiffClusterMq`: MQ比对
 * - `GetDiffClusterConfig`: 配置比对
 * - `DeployClusterMqTopic`: MQ Topic发布
 * - `DeployClusterMqGroup`: MQ Group发布
 * - `DeployClusterConfig`: 配置发布
 * - `DeployClusterApp`: 集群应用发布
 * - `DeployClusterWebSource`: 前端资源发布
 * - `DeployClusterWebVersion`: 前端版本号发布
 * - `ClusterDeployOver`: 双集群同步完成
 * - `SwitchFlow`: 集群流量调度
 * - `Pass`: 可继续集群同步
 */
type ICategory =
  | 'Pass'
  | 'DeployClusterMqTopic'
  | 'DeployClusterMqGroup'
  | 'DeployClusterConfig'
  | 'DeployClusterApp'
  | 'DeployClusterWebSource'
  | 'DeployClusterWebVersion'
  | 'ClusterDeployOver';

// 每一个状态对应的显示步骤
const category2stepMapping: Record<ICategory, number> = {
  Pass: 0,
  DeployClusterMqTopic: 0,
  DeployClusterMqGroup: 1,
  DeployClusterConfig: 2,
  DeployClusterApp: 2,
  DeployClusterWebSource: 3,
  DeployClusterWebVersion: 3,
  ClusterDeployOver: 4,
};

export default function ClusterSyncDetail(props: any) {
  const [pending, setPending] = useState(true);
  const [currStep, setCurrStep] = useState<number>(-1);
  const [resultLog, setResultLog] = useState<string>('');
  const [currState, setCurrState] = useState<ICategory>();

  // 查询当前状态
  const queryCurrStatus = useCallback(async () => {
    setPending(true);
    try {
      const result = await getRequest(APIS.queryWorkState);
      console.log('> current work state: ', result.data);
      setCurrState(result.data.category);
    } finally {
      setPending(false);
    }
  }, []);

  // 初始化查询一次状态
  useEffect(() => {
    queryCurrStatus();
  }, []);

  // 不同的状态对应不同的 step
  useEffect(() => {
    if (!currState) return;
    const nextStep = category2stepMapping[currState];
    setCurrStep(nextStep);
  }, [currState]);

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
        <Spin spinning={pending}>
          <pre className="result-log">{resultLog}</pre>
          <div className="action-row">
            {currState === 'Pass' ? <Button type="primary">MQ同步开始</Button> : null}
            <Button type="primary">下一步</Button>
            <Button type="default" onClick={() => props.history.push('./cluster-sync')}>
              取消
            </Button>
          </div>
        </Spin>
      </ContentCard>
    </MatrixPageContent>
  );
}
