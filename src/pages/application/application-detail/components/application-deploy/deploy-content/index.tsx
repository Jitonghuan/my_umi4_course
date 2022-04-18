/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
import useInterval from './useInterval';
import DetailContext from '@/pages/application/application-detail/context';
import {
  queryDeployList,
  queryFeatureDeployed,
  queryApplicationStatus,
  queryActiveDeployInfo,
} from '@/pages/application/service';
import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';
import { getRequest } from '@/utils/request';
import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import PublishRecord from './components/publish-record';
import { Spin } from 'antd';
import './index.less';
const masterBranch = 'aas';

const rootCls = 'deploy-content-compo';
const tempData = {
  metadata: {
    id: 1564,
    appCode: 'dubbo-consumer',
    pipelineCode: 'pipeline-1',
    envTypeCode: 'dev',
    isActive: 1,
    version: '1.0',
  },
  branchInfo: {
    masterBranch: 'master-1',
    releaseBranch: 'release_dev_20220411162402',
    features: ['feature_ccd_20220406160947', 'feature_test_20220330202635'],
    conflictFeature: '',
    // "tagName": "tag-1"
  },
  envInfo: {
    deployEnvs: ['base', 'dev'],
  },
  buildInfo: {
    buildUrl:
      '[{"envCode":"base","subJenkinsUrl":"http://jenkins-dev.cfuture.shop/job/dubbo-consumer/25/console"},{"envCode":"dev","subJenkinsUrl":"http://jenkins-dev.cfuture.shop/job/dubbo-consumer/26/console"}]',
    buildType: 'beClientBuild',
  },
  status: {
    deployErrInfo: '[{"envCode":"base","subErrInfo":""},{"envCode":"dev","subErrInfo":"推送资源出错"}]',
    deployNodes: [
      { nodeType: 'single', nodeName: '创建任务', nodeStatus: 'finish' },
      { nodeType: 'single', nodeName: '合并realease', nodeStatus: 'finish' },
      { nodeName: '构建', nodeStatus: 'finish', nodeType: 'single' },
      {
        nodeType: 'subject',
        nodes: {
          base: [
            { nodeName: '推送资源', nodeStatus: 'finish', nodeType: 'single' },
            { nodeName: '灰度验证', nodeStatus: 'process', nodeType: 'single' },
            { nodeName: '推送版本', nodeStatus: 'wait', nodeType: 'single' },
          ],
          dev: [
            { nodeName: '推送资源', nodeStatus: 'finish', nodeType: 'single' },
            { nodeName: '灰度验证', nodeStatus: 'process', nodeType: 'single' },
            { nodeName: '推送版本', nodeStatus: 'wait', nodeType: 'single' },
          ],
        },
      },
      { nodeType: 'single', nodeName: '合并realease', nodeStatus: 'wait' },
      { nodeType: 'single', nodeName: '删除feature', nodeStatus: 'wait' },
      { nodeType: 'single', nodeName: '完成', nodeStatus: 'wait' },
      // nodes: []
    ],
  },
};

export interface DeployContentProps {
  /** 当前页面是否激活 */
  isActive?: boolean;
  /** 环境参数 */
  envTypeCode: string;
  /** 流水线 */
  pipelineCode: string;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
}

export default function DeployContent(props: DeployContentProps) {
  const { envTypeCode, isActive, onDeployNextEnvSuccess, pipelineCode } = props;
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};

  const cachebranchName = useRef<string>();
  const [updating, setUpdating] = useState(false);
  // const [deployInfo, setDeployInfo] = useState<DeployInfoVO>({} as DeployInfoVO);
  const [deployInfo, setDeployInfo] = useState<any>({});
  const [branchInfo, setBranchInfo] = useState<{
    deployed: any[];
    unDeployed: any[];
  }>({ deployed: [], unDeployed: [] });
  // 应用状态，仅线上有
  const [appStatusInfo, setAppStatusInfo] = useState<IStatusInfoProps[]>([]);
  const [loading, setLoading] = useState(false);

  const requestData = async () => {
    if (!appCode || !isActive) return;

    setUpdating(true);

    const resp = await queryActiveDeployInfo({ pipelineCode: pipelineCode });

    // const resp1 = await queryDeployList({
    //   appCode: appCode!,
    //   envTypeCode,
    //   isActive: 1,
    //   pageIndex: 1,
    //   pageSize: 10,
    // });

    const resp2 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode,
      isDeployed: 1,
    });
    const resp3 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode,
      isDeployed: 0,
      branchName: cachebranchName.current,
    });
    // if (resp?.data) {
    //   const { data } = resp;
    //   // setDeployInfo(data)
    // }

    // if (resp1?.data?.dataSource && resp1?.data?.dataSource.length > 0) {
    // const nextInfo = resp1?.data?.dataSource[0];
    // setDeployInfo(nextInfo);
    if (tempData) {
      setDeployInfo(tempData);
    }

    // 如果有部署信息，且为线上，则更新应用状态
    if (envTypeCode === 'prod' && appData) {
      const resp4 = await getRequest(queryApplicationStatus, {
        data: {
          deploymentName: appData?.deploymentName,
          envCode: tempData?.envInfo?.deployEnvs,
        },
      }).catch(() => {
        return { data: null };
      });

      const { Status: nextAppStatus } = resp4.data || {};
      setAppStatusInfo(nextAppStatus);
    }
    // }

    setBranchInfo({
      deployed: resp2?.data || [],
      unDeployed: resp3?.data || [],
    });
    setUpdating(false);
  };

  // 定时请求发布内容
  const { getStatus: getTimerStatus, handle: timerHandle } = useInterval(requestData, 8000, { immediate: false });

  const searchUndeployedBranch = (branchName?: string) => {
    cachebranchName.current = branchName;
    timerHandle('do', true);
  };

  // 操作开始时终止定时请求，操作结束后继续
  const onOperate = (operateType: string) => {
    if (operateType.endsWith('Start')) {
      timerHandle('stop');
    } else if (operateType.endsWith('End')) {
      timerHandle('do', true);
    }
  };

  // appCode变化时
  useEffect(() => {
    if (!appCode || !isActive) return;
    timerHandle('do', true);
  }, [appCode, isActive, pipelineCode]);

  const onSpin = () => {
    setLoading(true);
  };

  const stopSpin = () => {
    setLoading(false);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <Spin spinning={loading}>
          <PublishDetail
            envTypeCode={envTypeCode}
            deployInfo={deployInfo}
            appStatusInfo={appStatusInfo}
            onOperate={(type) => {
              if (type === 'deployNextEnvSuccess') {
                onDeployNextEnvSuccess();
                return;
              }
              requestData();
              onOperate(type);
            }}
          />
          <PublishContent
            appCode={appCode!}
            envTypeCode={envTypeCode}
            deployInfo={deployInfo}
            deployedList={branchInfo.deployed}
            appStatusInfo={appStatusInfo}
            onOperate={onOperate}
            onSpin={onSpin}
            stopSpin={stopSpin}
          />
          <PublishBranch
            deployInfo={deployInfo}
            masterBranch={masterBranch}
            hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
            dataSource={branchInfo.unDeployed}
            env={envTypeCode}
            onSearch={searchUndeployedBranch}
            onSubmitBranch={(status) => {
              timerHandle(status === 'start' ? 'stop' : 'do', true);
            }}
            masterBranchChange={() => {
              timerHandle('do', true);
            }}
          />
        </Spin>
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={envTypeCode} appCode={appCode} />
      </div>
    </div>
  );
}
