// 同步的操作弹层
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:06

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Button, Steps, Spin, Result, message } from 'antd';
import moment from 'moment';
import { history,useLocation } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import type { IResponse } from '@cffe/vc-request/es/base-request/type';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import './index.less';

type ResPromise = Promise<IResponse<any>>;

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
  | 'GetDiffClusterMq'
  | 'DeployClusterMqTopic'
  | 'DeployClusterMqGroup'
  | 'GetDiffClusterConfig'
  | 'DeployClusterConfig'
  | 'GetDiffClusterApp'
  | 'DeployClusterApp'
  | 'DeployClusterWebSource'
  | 'DeployClusterWebVersion'
  | 'ClusterDeployOver';

// 每一个状态对应的显示步骤
const category2stepMapping: Record<ICategory, number> = {
  Pass: 0,
  GetDiffClusterMq: 0,
  DeployClusterMqTopic: 0,
  DeployClusterMqGroup: 1,
  GetDiffClusterConfig: 1,
  DeployClusterConfig: 2,
  GetDiffClusterApp: 2,
  DeployClusterApp: 3,
  DeployClusterWebSource: 3,
  DeployClusterWebVersion: 3,
  ClusterDeployOver: 4,
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
      const result = await getRequest(APIS.queryWorkState);
      const initState = result?.data?.category;

      if (initState === 'DeployClusterApp') {
        updateResultLog(result?.data?.log || '<no initial log>');
        return await getClusterApp();
      } else if (initState === 'DeployClusterWebSource') {
        setCurrState('DeployClusterApp');
        await getFESourceDeployProcess();
      } else {
        updateResultLog(result?.data?.log || '<no initial log>');
        setCurrState(initState);
      }
    } catch (ex) {
      setCurrState('Pass');
    } finally {
      setPending(false);
    }
  }, []);

  const doAction = useCallback(async (promise: ResPromise) => {
    try {
      setPending(true);
      const result = await promise;
      let addon = result?.data;

      if (typeof addon === 'object' && 'appCode' in addon) {
        addon = addon.appCode === 'Pass' ? '应用同步完成' : `下一个要同步的应用: ${addon.appCode || '--'}`;
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

  // 1. get mq diff
  const getMqDiff = useCallback(async () => {
    await doAction(getRequest(APIS.mqDiff));
    setCurrState('GetDiffClusterMq');
  }, []);
  // 2. deploy mq topic
  const deployTopic = useCallback(async () => {
    await doAction(postRequest(APIS.deployTopic));
    setCurrState('DeployClusterMqTopic');
  }, []);
  // 3. deploy mq group
  const deployGroup = useCallback(async () => {
    await doAction(postRequest(APIS.deployGroup));
    setCurrState('DeployClusterMqGroup');
  }, []);
  // 4. get config diff
  const getConfigDiff = useCallback(async () => {
    await doAction(getRequest(APIS.configServerDiff));
    setCurrState('GetDiffClusterConfig');
  }, []);
  // 5. deploy config
  const deployConfig = useCallback(async () => {
    await doAction(postRequest(APIS.configServerDeploy));
    setCurrState('DeployClusterConfig');
  }, []);
  // 6. get cluster app
  const getClusterApp = useCallback(async () => {
    const nextApp = await doAction(getRequest(APIS.queryClusterApp));
    // if (!nextApp?.appCode) {
    //   return message.warning('返回数据异常，appCode 为空值!');
    // }
    if (nextApp?.appCode && nextApp.appCode !== 'Pass') {
      setCurrState('GetDiffClusterApp');
      setNextDeployApp(nextApp.appCode);
    } else {
      setCurrState('DeployClusterApp');
    }
  }, []);
  // 7. deploy app
  const deployApp = useCallback(async () => {
    await doAction(
      postRequest(APIS.appDeploy, {
        data: { appCode: nextDeployApp },
      }),
    );
    // 成功后再调一次 queryClusterApp 接口
    await getClusterApp();
  }, [nextDeployApp]);
  // 8. deploy fe source
  const deployFESource = useCallback(async () => {
    setPending(true);
    // 1. 触发资源同步
    await postRequest(APIS.frontendSourceDeploy);
    updateResultLog('前端资源同步开始...');
    // 2. 轮循调接口获取当前的部署状态，直到没有数据为止
    await getFESourceDeployProcess();
  }, []);
  // 8.5 获取前端资源同步进度
  const getFESourceDeployProcess = useCallback(async () => {
    let logCache = resultLogCache;
    let addonLog = '';
    while (true) {
      await sleep(6000); // 延迟 6 秒获取一次状态
      try {
        const result = await getRequest(APIS.queryFrontendSource);
        // 没有数据表示已经结束
        if (!result?.data || result?.data === 'Pass') {
          updateResultLog(addonLog);
          updateResultLog('前端资源同步完成！');
          setPending(false);
          return setCurrState('DeployClusterWebSource');
        }

        addonLog = result?.data;
        const nextLog = logCache + addonLog;
        setResultLog(nextLog);
      } catch (ex) {
        // updateResultLog('资源同步状态获取异常！');
      }
    }
  }, []);
  // 9. deploy fe version
  const deployFEVersion = useCallback(async () => {
    await doAction(postRequest(APIS.frontendVersionDeploy));
    setCurrState('DeployClusterWebVersion');
  }, []);
  // 10. finish
  const finishDeploy = useCallback(async () => {
    await doAction(postRequest(APIS.clusterDeployOver));
    setCurrState('ClusterDeployOver');
  }, []);

  // 不同的状态对应不同的 step
  useEffect(() => {
    if (!currState) return;
    const nextStep = category2stepMapping[currState];
    setCurrStep(nextStep);

    // 如果是 pass 状态，自动进行第一步
    if (currState === 'Pass') {
      setTimeout(() => getMqDiff());
    }
  }, [currState]);

  // const reDeploy = useCallback(() => {
  //   setCurrState('Pass');
  //   setCurrStep(1);
  //   resultLogCache = '';
  //   setResultLog('');
  // }, []);

  return (
    <ContentCard className="page-cluster-sync-detail">
      <Steps current={currStep}>
        <Steps.Step title="MQ同步" />
        <Steps.Step title="配置同步" />
        <Steps.Step title="应用同步" />
        <Steps.Step title="前端资源同步" />
        <Steps.Step title="完成" />
      </Steps>
      {currStep !== 4 ? (
        <pre className="result-log" ref={resultRef}>
          {resultLog}
        </pre>
      ) : null}
      {currStep !== 4 ? (
        <Spin spinning={pending} tip="执行中，请勿关闭或切换页面">
          <div className="action-row">
            {currState === 'Pass' ? (
              <Button type="primary" onClick={getMqDiff}>
                开始 MQ 对比
              </Button>
            ) : null}
            {currState === 'GetDiffClusterMq' ? (
              <Button type="primary" onClick={deployTopic}>
                开始同步 MQ Topic
              </Button>
            ) : null}
            {currState === 'DeployClusterMqTopic' ? (
              <Button type="primary" onClick={deployGroup}>
                开始同步 MQ Group
              </Button>
            ) : null}
            {currState === 'DeployClusterMqGroup' ? (
              <Button type="primary" onClick={getConfigDiff}>
                开始进行配置对比
              </Button>
            ) : null}
            {currState === 'GetDiffClusterConfig' ? (
              <Button type="primary" onClick={deployConfig}>
                开始配置同步
              </Button>
            ) : null}
            {currState === 'DeployClusterConfig' ? (
              <Button type="primary" onClick={getClusterApp}>
                开始查询发布应用
              </Button>
            ) : null}
            {currState === 'GetDiffClusterApp' ? (
              <Button type="primary" onClick={deployApp}>
                同步下一个应用
              </Button>
            ) : null}
            {currState === 'DeployClusterApp' ? (
              <Button type="primary" onClick={deployFESource}>
                开始前端资源同步
              </Button>
            ) : null}
            {currState === 'DeployClusterWebSource' ? (
              <Button type="primary" onClick={deployFEVersion}>
                开始前端版本同步
              </Button>
            ) : null}
            {currState === 'DeployClusterWebVersion' ? (
              <Button type="primary" onClick={finishDeploy}>
                完成集群同步
              </Button>
            ) : null}
            <Button type="default" onClick={() => history.push('./cluster-sync')}>
              取消
            </Button>
          </div>
        </Spin>
      ) : null}
      {currStep === 4 ? (
        <Result
          status="success"
          title="同步成功"
          extra={[
            // <Button key="again" type="primary" onClick={reDeploy}>
            //   再次同步集群
            // </Button>,
            <Button key="showlist" type="default" onClick={() => history.push('./dashboards')}>
              查看集群看板
            </Button>,
          ]}
        />
      ) : null}
    </ContentCard>
  );
}
