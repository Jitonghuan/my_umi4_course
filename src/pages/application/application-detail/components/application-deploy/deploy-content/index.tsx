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
import DetailContext from '../../../context';
import { queryDeployList, queryFeatureDeployed } from '../../../../service';
import { IStatusInfoProps } from './types';
import { getRequest } from '@/utils/request';
import * as APIS from './services';
import './index.less';

const rootCls = 'deploy-content-compo';

export interface DeployContentProps {
  appCode?: string;
  /** 环境参数 */
  envTypeCode: string;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
}

export default function DeployContent(props: DeployContentProps) {
  const { envTypeCode, onDeployNextEnvSuccess } = props;
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};

  const cachebranchName = useRef<string>();
  const [updating, setUpdating] = useState(false);
  const [deployInfo, setDeployInfo] = useState({});
  const [branchInfo, setBranchInfo] = useState<{
    deployed: any[];
    unDeployed: any[];
  }>({ deployed: [], unDeployed: [] });
  // 应用状态，仅线上有
  const [appStatusInfo, setAppStatusInfo] = useState<IStatusInfoProps[]>([]);

  const requestData = async () => {
    if (!appCode) return;
    setUpdating(true);

    const resp1 = await queryDeployList({
      appCode: appCode!,
      envTypeCode,
      isActive: 1,
      pageIndex: 1,
      pageSize: 10,
    });

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

    if (resp1?.data?.dataSource && resp1?.data?.dataSource.length > 0) {
      const nextInfo = resp1?.data?.dataSource[0];
      setDeployInfo(nextInfo);

      // 如果有部署信息，且为线上，则更新应用状态
      // if (envTypeCode === 'prod' && appData) {
      //   const resp4 = await getRequest(APIS.queryApplicationStatus, {
      //     data: {
      //       deploymentName: appData?.deploymentName,
      //       envCode: nextInfo.deployedEnvs,
      //     },
      //   }).catch(() => {
      //     return { data: null };
      //   });

      //   const { Status: nextAppStatus } = resp4.data || {};
      //   setAppStatusInfo(nextAppStatus);
      // }
    }

    setBranchInfo({
      deployed: resp2?.data || [],
      unDeployed: resp3?.data || [],
    });

    setUpdating(false);
  };

  // 定时请求发布内容
  const { getStatus: getTimerStatus, handle: timerHandle } = useInterval(requestData, 8000, { immediate: true });

  const searchUndeployedBranch = (branchName?: string) => {
    cachebranchName.current = branchName;
    timerHandle('do', true);
  };

  const onOperate = (operateType: string) => {
    if (operateType.endsWith('Start')) {
      timerHandle('stop');
    } else if (operateType.endsWith('End')) {
      timerHandle('do', true);
    }
  };

  // appCode变化时
  useEffect(() => {
    if (!appCode) return;

    timerHandle('do', true);
  }, [appCode]);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
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
        />
        <PublishBranch
          deployInfo={deployInfo}
          hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
          dataSource={branchInfo.unDeployed}
          env={envTypeCode}
          onSearch={searchUndeployedBranch}
          onSubmitBranch={(status) => {
            timerHandle(status === 'start' ? 'stop' : 'do', true);
          }}
        />
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={envTypeCode} appCode={appCode} />
      </div>
    </div>
  );
}
