/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import PublishRecord from './components/publish-record';
import useInterval from './useInterval';
import DetailContext from '@/pages/application/application-detail/context';
import { queryDeployList, queryFeatureDeployed, queryActiveDeployInfo } from '@/pages/application/service';
import './index.less';

const rootCls = 'deploy-content-compo';

export interface IProps {
  /** 环境参数 */
  env: string;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
  pipelineCode: string;
}

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
    deployEnvs: ['base'],
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
      { nodeType: 'single', nodeName: '部署', nodeStatus: 'wait' },
      { nodeType: 'single', nodeName: '执行完成', nodeStatus: 'wait' },
      // nodes: []
    ],
  },
};

export default function DeployContent({ env, onDeployNextEnvSuccess, pipelineCode }: IProps) {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const cachebranchName = useRef<string>();

  const [updating, setUpdating] = useState(false);
  const [deployInfo, setDeployInfo] = useState({});
  const [branchInfo, setBranchInfo] = useState<{
    deployed: any[];
    unDeployed: any[];
  }>({ deployed: [], unDeployed: [] });
  const masterBranchName = useRef<string>('master');

  const requestData = async () => {
    if (!appCode || !pipelineCode) return;

    setUpdating(true);
    const resp = await queryActiveDeployInfo({ pipelineCode: pipelineCode });

    // const resp1 = await queryDeployList({
    //   appCode: appCode!,
    //   envTypeCode: env,
    //   isActive: 1,
    //   pageIndex: 1,
    //   pageSize: 10,
    // });

    const resp2 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode: env,
      isDeployed: 1,
      pipelineCode,
    });
    const resp3 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode: env,
      isDeployed: 0,
      branchName: cachebranchName.current,
      pipelineCode,
    });

    // if (resp1?.data?.dataSource && resp1?.data?.dataSource.length > 0) {
    //   setDeployInfo(resp1?.data?.dataSource[0]);
    // }

    if (resp && resp.success) {
      if (resp?.data) {
        setDeployInfo(resp.data);
      }
      if (!resp.data) {
        setDeployInfo({});
      }
    } else {
      setDeployInfo({});
    }

    setBranchInfo({
      deployed: resp2?.data || [],
      unDeployed: resp3?.data || [],
    });

    setUpdating(false);
  };

  // 定时请求发布内容
  const { getStatus: getTimerStatus, handle: timerHandle } = useInterval(requestData, 8000, { immediate: true });

  const onOperate = (operateType: string) => {
    if (operateType.endsWith('Start')) {
      timerHandle('stop');
    } else if (operateType.endsWith('End')) {
      timerHandle('do', true);
    }
  };

  // appCode变化时
  useEffect(() => {
    if (!appCode || !pipelineCode) return;

    timerHandle('do', true);
  }, [appCode, pipelineCode]);

  const searchUndeployedBranch = (branchName?: string) => {
    cachebranchName.current = branchName;
    timerHandle('do', true);
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <PublishDetail
          env={env}
          deployInfo={deployInfo}
          pipelineCode={pipelineCode}
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
          envTypeCode={env}
          deployInfo={deployInfo}
          deployedList={branchInfo.deployed}
          onOperate={onOperate}
        />
        <PublishBranch
          deployInfo={deployInfo}
          hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
          dataSource={branchInfo.unDeployed}
          env={env}
          pipelineCode={pipelineCode}
          onSearch={searchUndeployedBranch}
          onSubmitBranch={(status) => {
            timerHandle(status === 'start' ? 'stop' : 'do', true);
          }}
          masterBranchChange={(masterBranch: string) => {
            masterBranchName.current = masterBranch;
            timerHandle('do', true);
          }}
        />
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={env} appCode={appCode} />
      </div>
    </div>
  );
}
