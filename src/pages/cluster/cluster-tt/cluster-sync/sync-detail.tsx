// 同步的操作弹层
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:06

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Button, Steps, Spin, Result, message } from 'antd';
import moment from 'moment';
import { ContentCard } from '@/components/vc-page-content';
import type { IResponse } from '@cffe/vc-request/es/base-request/type';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import './index.less';

type ResPromise = Promise<IResponse<any>>;

/**
 * - `DiffApp`: 单应用比对
 * - `SyncSingleApp` 单应用同步
 * - `GetDiffClusterApp`: 集群应用比对
 * - `GetDiffClusterConfig`: Nacos比对
 * - `syncClusterConfig`: Nacos配置同步
 * - `GetDiffXxlJob`: xxl-job比对
 * - `SyncXxlJob`: xxl-job同步
 * - `SyncClusterApp`: 集群应用同步
 * - `SyncClusterWebSource`: 前端资源同步
 * - `ClusterSyncOver`: 集群同步完成
 */
type ICategory =
  | 'Pass'
  | 'GetDiffClusterConfig'
  | 'syncClusterConfig'
  | 'GetDiffXxlJob'
  | 'syncXxlJob'
  | 'GetDiffClusterApp'
  | 'SyncClusterApp'
  | 'SyncClusterWebSource'
  | 'ClusterSyncOver';

// 每一个状态对应的显示步骤
const category2stepMapping: Record<ICategory, number> = {
  Pass: 0,
  GetDiffClusterConfig: 0,
  syncClusterConfig: 0,
  GetDiffXxlJob: 1,
  syncXxlJob: 1,
  GetDiffClusterApp: 2,
  SyncClusterApp: 2,
  SyncClusterWebSource: 3,
  ClusterSyncOver: 4,
};

const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s));

let resultLogCache = '';

export default function ClusterSyncDetail(props: any) {
  const [pending, setPending] = useState(true);
  const [currStep, setCurrStep] = useState<number>(-1);
  const [resultLog, setResultLog] = useState<string>('');
  const [currState, setCurrState] = useState<ICategory>();
  const resultRef = useRef<HTMLPreElement>(null);

  const [nextDeployApp, setNextDeployApp] = useState<string>();

  const updateResultLog = useCallback((addon: string) => {
    resultLogCache += `[${moment().format('HH:mm:ss')}] ${addon || '<no result> success'}\n`;
    setResultLog(resultLogCache);
  }, []);

  // 查询当前状态
  const queryCurrStatus = useCallback(async () => {
    setPending(true);
    try {
      const result = await getRequest(APIS.querySyncState, { data: { envCode: 'tt-health' } });
      const initState = result.data.category;

      if (initState === 'SyncClusterApp') {
        updateResultLog(result?.data?.log || '<no initial log>');
        return await getClusterApp();
      } else if (initState === 'SyncClusterWebSource') {
        setCurrState('SyncClusterApp');
        // await getFESourceDeployProcess();
      } else if (initState === 'Pass') {
        setCurrState('Pass');
        updateResultLog(result.data.log || '<no initial log>');
      } else {
        updateResultLog(result.data.log || '<no initial log>');
        setCurrState(initState);
      }
    } catch (ex) {
      setCurrState('Pass');
    } finally {
      setPending(false);
    }
  }, []);
  let nextDeploymentName = '';
  const doAction = useCallback(async (promise: ResPromise) => {
    try {
      setPending(true);
      const result = await promise;
      let addon = result?.data;
      if (typeof addon === 'object' && 'log' in addon) {
        if (addon?.log === 'null') {
          addon = '';
        } else {
          addon = addon?.log;
        }
      }
      if (typeof addon === 'object' && 'nextSyncDeployment' in addon) {
        addon = addon.nextSyncDeployment === 'End' ? ` ${addon.syncLog || '--'}` : ` ${addon.syncLog || '--'}`;
      }
      if (typeof addon === 'object' && 'deploymentName' in addon) {
        addon = `当前同步的应用: ${addon.deploymentName || '--'}`;
      }

      updateResultLog(addon);
      return result.data;
    } catch (ex) {
      updateResultLog(`<ERROR> ${ex?.message || 'Server Error'}`);
      throw ex;
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    // 初始化后查询一次状态
    queryCurrStatus();

    // 离开时清空缓存
    return () => {
      resultLogCache = '';
    };
  }, []);

  // 每次日志有新增的时候都滚动到最底部
  useLayoutEffect(() => {
    resultRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [resultLog]);

  // 1. get nacos 配置比对
  const configDiff = useCallback(async () => {
    await doAction(getRequest(APIS.configDiff, { data: { envCode: 'tt-health' } }));
    setCurrState('GetDiffClusterConfig');
  }, []);
  // 2. Nacos同步
  const syncConfig = useCallback(async () => {
    await doAction(postRequest(APIS.syncConfig, { data: { envCode: 'tt-health' } }));
    setCurrState('syncClusterConfig');
  }, []);
  // 3. XXL-Job比对
  const xxlJobDiff = useCallback(async () => {
    await doAction(getRequest(APIS.xxlJobDiff, { data: { envCode: 'tt-health' } }));
    setCurrState('GetDiffXxlJob');
  }, []);
  // 4. XXL-Job同步
  const syncXxlJob = useCallback(async () => {
    await doAction(postRequest(APIS.syncXxlJob, { data: { envCode: 'tt-health' } }));
    setCurrState('syncXxlJob');
  }, []);
  // 5. get cluster app
  const getClusterApp = useCallback(async () => {
    const nextApp = await doAction(getRequest(APIS.queryClusterApp, { data: { envCode: 'tt-health' } }));
    nextDeploymentName = nextApp?.deploymentName;
    console.log('nextApp', nextApp);
    setCurrState('GetDiffClusterApp');
  }, []);
  // 6. deploy app
  const deployApp = useCallback(async () => {
    console.log('nextDeploymentName', nextDeploymentName);
    const result = await doAction(
      postRequest(APIS.syncClusterApp, {
        data: { deploymentName: nextDeploymentName, envCode: 'tt-health' },
      }),
    );
    if (result?.nextSyncDeployment && result.nextSyncDeployment !== 'End') {
      setCurrState('GetDiffClusterApp');
      nextDeploymentName = result?.nextSyncDeployment;
      setNextDeployApp(result?.nextSyncDeployment);
      // 成功后再调一次 deployApp 接口
      await deployApp();
    } else if (result.nextSyncDeployment === 'End') {
      setCurrState('SyncClusterApp');
    }
  }, []);
  // 7. 前端资源同步
  const syncFrontendSource = useCallback(async () => {
    await doAction(postRequest(APIS.syncFrontendSource, { data: { envCode: 'tt-health' } }));
    setCurrState('SyncClusterWebSource');
  }, []);
  // 8. finish
  const syncClusterOver = useCallback(async () => {
    await doAction(getRequest(APIS.syncClusterOver, { data: { envCode: 'tt-health' } }));
    setCurrState('ClusterSyncOver');
  }, []);

  // 不同的状态对应不同的 step
  useEffect(() => {
    if (!currState) return;
    const nextStep = category2stepMapping[currState];
    setCurrStep(nextStep);

    // 如果是 pass 状态，自动进行第一步
    if (currState === 'Pass') {
      setTimeout(() => configDiff());
    }
  }, [currState]);

  return (
    <ContentCard className="page-cluster-sync-detail">
      <Steps current={currStep}>
        <Steps.Step title="Nacos配置同步" />
        <Steps.Step title="XXL-Job同步" />
        <Steps.Step title="集群应用同步" />
        <Steps.Step title="前端资源同步" />
        <Steps.Step title="集群同步完成" />
      </Steps>
      {currStep !== 7 ? (
        <pre className="result-log" ref={resultRef}>
          {resultLog}
        </pre>
      ) : null}
      {currStep !== 7 ? (
        <Spin spinning={pending} tip="执行中，请勿关闭或切换页面">
          <div className="action-row">
            {currState === 'Pass' ? (
              <Button type="primary" onClick={configDiff}>
                开始Nacos配置对比
              </Button>
            ) : null}
            {currState === 'GetDiffClusterConfig' ? (
              <Button type="primary" onClick={syncConfig}>
                开始Nacos配置同步
              </Button>
            ) : null}
            {currState === 'syncClusterConfig' ? (
              <Button type="primary" onClick={xxlJobDiff}>
                开始XXL-Job比对
              </Button>
            ) : null}
            {currState === 'GetDiffXxlJob' ? (
              <Button type="primary" onClick={syncXxlJob}>
                开始XXL-Job同步
              </Button>
            ) : null}
            {currState === 'syncXxlJob' ? (
              <Button type="primary" onClick={getClusterApp}>
                开始查询发布应用
              </Button>
            ) : null}
            {currState === 'GetDiffClusterApp' ? (
              <Button type="primary" onClick={deployApp}>
                同步应用
              </Button>
            ) : null}
            {currState === 'SyncClusterApp' ? (
              <Button type="primary" onClick={syncFrontendSource}>
                开始前端资源同步
              </Button>
            ) : null}
            {currState === 'SyncClusterWebSource' ? (
              <Button type="primary" onClick={syncClusterOver}>
                完成集群同步
              </Button>
            ) : null}
            <Button type="default" onClick={() => props.history.push('./cluster-sync')}>
              返回
            </Button>
          </div>
        </Spin>
      ) : null}
      {currStep === 7 ? (
        <Result
          status="success"
          title="同步成功"
          extra={[
            <Button key="showlist" type="default" onClick={() => props.history.push('./dashboards')}>
              查看集群看板
            </Button>,
          ]}
        />
      ) : null}
    </ContentCard>
  );
}
