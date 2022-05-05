/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
import useInterval from './useInterval';
import DetailContext from '../../../context';
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

const rootCls = 'deploy-content-compo';

export interface DeployContentProps {
  /** 当前页面是否激活 */
  // isActive?: boolean;
  /** 环境参数 */
  envTypeCode: string;
  pipelineCode: string;
  /** 部署下个环境成功回调 */
  // onDeployNextEnvSuccess: () => void;
}

export default function DeployContent(props: DeployContentProps) {
  const {
    envTypeCode,
    pipelineCode,
    // isActive
  } = props;
  const { appData, projectEnvCode } = useContext(DetailContext);
  const { appCode } = appData || {};
  const cachebranchName = useRef<string>();
  const [updating, setUpdating] = useState(false);
  const masterBranchName = useRef<string>('master');
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
    if (!appCode || !projectEnvCode || !pipelineCode) return;

    setUpdating(true);

    const resp = await queryActiveDeployInfo({ pipelineCode: pipelineCode });

    // const resp1 = await queryDeployList({
    //   appCode: appCode!,
    //   envTypeCode: projectEnvCode,
    //   isActive: 1,
    //   pageIndex: 1,
    //   pageSize: 10,
    // });

    const resp2 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode: projectEnvCode,
      isDeployed: 1,
      pipelineCode,
    });
    const resp3 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode: projectEnvCode,
      pipelineCode,
      isDeployed: 0,
      branchName: cachebranchName.current,
      masterBranch: masterBranchName.current,
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
    if (!appCode || !pipelineCode) return;
    timerHandle('do', true);
  }, [appCode, pipelineCode]);

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
            envTypeCode={projectEnvCode}
            deployInfo={deployInfo}
            pipelineCode={pipelineCode}
            envCode={projectEnvCode}
            // appStatusInfo={appStatusInfo}
            onOperate={(type: any) => {
              // if (type === 'deployNextEnvSuccess') {
              //   onDeployNextEnvSuccess();
              //   return;
              // }
              requestData();
              onOperate(type);
            }}
          />
          <PublishContent
            appCode={appCode!}
            envTypeCode={projectEnvCode}
            deployInfo={deployInfo}
            deployedList={branchInfo.deployed}
            // appStatusInfo={appStatusInfo}
            onOperate={onOperate}
            onSpin={onSpin}
            stopSpin={stopSpin}
            pipelineCode={pipelineCode}
          />
          <PublishBranch
            deployInfo={deployInfo}
            hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
            dataSource={branchInfo.unDeployed}
            env={projectEnvCode}
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
        </Spin>
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={projectEnvCode} appCode={appCode} />
      </div>
    </div>
  );
}
