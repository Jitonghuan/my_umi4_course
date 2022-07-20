import React, { useState, useContext, useEffect, useRef } from 'react';
import { Spin } from 'antd';

import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import PublishRecord from './components/publish-record';

import useInterval from './useInterval';
import DetailContext from '@/pages/npm-manage/detail/context';
import { queryFeatureDeployed, queryActiveDeployInfo } from '@/pages/application/service';

import './index.less';
const rootCls = 'deploy-content-compo';

export interface DeployContentProps {
  /** 当前页面是否激活 */
  isActive?: boolean;
  /** 环境参数 */
  envTypeCode: string;
  /** 环境列表 */
  envList: any[];
  pipelineCode?: string;
}

export default function DeployContent(props: DeployContentProps) {
  const { envTypeCode, isActive, envList, pipelineCode } = props;
  const { npmData } = useContext(DetailContext);
  const { npmName } = npmData || {};
  const cachebranchName = useRef<string>();
  const masterBranchName = useRef<string>('master');
  const [deployInfo, setDeployInfo] = useState<any>({});
  const [branchInfo, setBranchInfo] = useState<{
    deployed: any[];
    unDeployed: any[];
  }>({ deployed: [], unDeployed: [] });
  const [loading, setLoading] = useState(false);

  const requestData = async () => {
    if (!npmName || !isActive || !pipelineCode) return;

    const resp = await queryActiveDeployInfo({ pipelineCode });

    const resp2 = await queryFeatureDeployed({
      appCode: npmName!,
      envTypeCode,
      isDeployed: 1,
      pipelineCode,
      masterBranch: masterBranchName.current,
      isNpm: true
    });
    const resp3 = await queryFeatureDeployed({
      appCode: npmName!,
      envTypeCode,
      pipelineCode,
      isDeployed: 0,
      branchName: cachebranchName.current,
      masterBranch: masterBranchName.current,
      isNpm: true
    });

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
  };

  // 定时请求发布内容
  const { handle: timerHandle } = useInterval(requestData, 8000, { immediate: true });

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
    if (!npmName || !isActive || !pipelineCode) {
      timerHandle('stop');
    } else {
      timerHandle('stop');
      timerHandle('do', true);
    }
  }, [npmName, isActive, pipelineCode]);


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
          />
          <PublishContent
            appCode={npmName!}
            envTypeCode={envTypeCode}
            deployInfo={deployInfo}
            deployedList={branchInfo.deployed}
            onOperate={onOperate}
            onSpin={onSpin}
            stopSpin={stopSpin}
            envList={envList}
          />
          <PublishBranch
            deployInfo={deployInfo}
            hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
            dataSource={branchInfo.unDeployed}
            env={envTypeCode}
            pipelineCode={pipelineCode}
            onSearch={searchUndeployedBranch}
            onSubmitBranch={(status) => {
              timerHandle(status === 'start' ? 'stop' : 'do', true);
            }}
            masterBranchChange={(masterBranch: string) => {
              masterBranchName.current = masterBranch;
              timerHandle('do', true);
            }}
            changeBranchName={(branchName: string) => {}}
          />
        </Spin>
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={envTypeCode} npmName={npmName} />
      </div>
    </div>
  );
}