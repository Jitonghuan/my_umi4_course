/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React, { useEffect, useState } from 'react';
import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import useInterval from './useInterval';
import { queryDeployList, queryFeatureDeployed } from '../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'deploy-content-compo';

const DeployContent = ({ env, appCode, appId }: IProps) => {
  const [updating, setUpdating] = useState(false);
  const [deployInfo, setDeployInfo] = useState({});
  const [branchInfo, setBranchInfo] = useState<{
    deployed: any[];
    unDeployed: any[];
  }>({ deployed: [], unDeployed: [] });

  // 定时请求发布内容
  const { getStatus: getTimerStatus, handle: timerHandle } = useInterval(
    () => {
      setUpdating(true);
      Promise.all([
        queryDeployList({
          appCode,
          env,
          isActive: 1,
          pageIndex: 1,
          pageSize: 10,
        }),
        queryFeatureDeployed({ appCode, env }),
      ])
        .then(([res1, res2]) => {
          setDeployInfo(res1?.list?.[0]);
          setBranchInfo({
            deployed: res2?.deployed || [],
            unDeployed: res2?.unDeployed || [],
          });
        })
        .finally(() => {
          setUpdating(false);
        });
    },
    8000,
    { immediate: true },
  );

  return (
    <div className={rootCls}>
      <PublishDetail deployInfo={deployInfo} />
      <PublishContent
        appCode={appCode}
        env={env}
        deployInfo={deployInfo}
        deployedList={branchInfo.deployed}
        onOperate={(operateType) => {
          if (operateType.endsWith('Start')) {
            timerHandle('stop');
          } else if (operateType.endsWith('End')) {
            timerHandle('do', true);
          }
        }}
      />
      <PublishBranch
        dataSource={branchInfo.unDeployed}
        appCode={appCode}
        env={env}
        onSubmitBranch={(status) => {
          timerHandle(status === 'start' ? 'stop' : 'do', true);
        }}
      />
    </div>
  );
};

DeployContent.defaultProps = {};

export default DeployContent;
