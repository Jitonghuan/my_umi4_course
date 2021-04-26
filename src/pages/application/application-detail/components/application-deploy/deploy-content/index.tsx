/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React, { useState, useContext } from 'react';
import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import PublishRecord from './components/publish-record';
import useInterval from './useInterval';
import DetailContext from '../../../context';
import { queryDeployList, queryFeatureDeployed } from '../../../../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'deploy-content-compo';

const DeployContent = ({ env }: IProps) => {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};

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
          appCode: appCode!,
          env,
          isActive: 1,
          pageIndex: 1,
          pageSize: 10,
        }),
        queryFeatureDeployed({ appCode: appCode!, env }),
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

  const onOperate = (operateType: string) => {
    if (operateType.endsWith('Start')) {
      timerHandle('stop');
    } else if (operateType.endsWith('End')) {
      timerHandle('do', true);
    }
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <PublishDetail
          env={env}
          deployInfo={deployInfo}
          onOperate={onOperate}
        />
        <PublishContent
          appCode={appCode!}
          env={env}
          deployInfo={deployInfo}
          deployedList={branchInfo.deployed}
          onOperate={onOperate}
        />
        <PublishBranch
          deployInfo={deployInfo}
          hasPublishContent={
            !!(branchInfo.deployed && branchInfo.deployed.length)
          }
          dataSource={branchInfo.unDeployed}
          env={env}
          onSubmitBranch={(status) => {
            timerHandle(status === 'start' ? 'stop' : 'do', true);
          }}
        />
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={env} appCode={appCode} />
      </div>
    </div>
  );
};

DeployContent.defaultProps = {};

export default DeployContent;
