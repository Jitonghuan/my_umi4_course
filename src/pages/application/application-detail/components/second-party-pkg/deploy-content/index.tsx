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
import { queryDeployList, queryFeatureDeployed, queryActiveDeployInfo,getNewDeployInfo,judgeIsNew } from '@/pages/application/service';
import './index.less';
import { Spin } from 'antd';

const rootCls = 'deploy-content-compo';

export interface IProps {
  /** 环境参数 */
  env: string;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
  pipelineCode: string;
}

export default function DeployContent({ env, onDeployNextEnvSuccess, pipelineCode }: IProps) {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const cachebranchName = useRef<string>();
  const newPublish = useRef<any>(undefined);//是否是新的cicd
  const [updating, setUpdating] = useState(false);
  const [deployInfo, setDeployInfo] = useState({});
  const [branchInfo, setBranchInfo] = useState<{
    deployed: any[];
    unDeployed: any[];
  }>({ deployed: [], unDeployed: [] });
  const masterBranchName = useRef<string>('master');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!appCode || !pipelineCode) return;
    isNewPublish();
   

  }, [appCode, pipelineCode])

  const requestData = async () => {
    if (!appCode || !pipelineCode) return;

    setUpdating(true);
    let queryDeployInfo = newPublish.current ? getNewDeployInfo : queryActiveDeployInfo;
    const resp = await queryDeployInfo({ pipelineCode: pipelineCode });
    const resp2 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode: env,
      isDeployed: 1,
      pipelineCode,
      masterBranch: masterBranchName.current,
    });
    const resp3 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode: env,
      isDeployed: 0,
      branchName: cachebranchName.current,
      masterBranch: masterBranchName.current,
      pipelineCode,
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

  const onSpin = () => {
    setLoading(true);
  };

  const stopSpin = () => {
    setLoading(false);
  };

  // 判断该应用是否要用新的发布流程
  const isNewPublish = () => {
    judgeIsNew({ appCode: appData?.appCode }).then((res: any) => {
      if (res?.success) {
        res?.data === 'v1' ? newPublish.current = false : newPublish.current = true;
      } else {
        newPublish.current = false;
      }
    }).finally(() => { timerHandle('do', true) })
  }


  return (
    <div className={rootCls}>
      <div className={`${rootCls}-body`}>
        <Spin spinning={loading}>
          <PublishDetail
            env={env}
            deployInfo={deployInfo}
            pipelineCode={pipelineCode}
            newPublish={newPublish.current}
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
            pipelineCode={pipelineCode}
            envTypeCode={env}
            deployInfo={deployInfo}
            newPublish={newPublish.current}
            deployedList={branchInfo.deployed}
            onOperate={onOperate}
            onSpin={onSpin}
            stopSpin={stopSpin}
          />
          <PublishBranch
            deployInfo={deployInfo}
            hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
            dataSource={branchInfo.unDeployed}
            env={env}
            newPublish={newPublish.current}
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
        <PublishRecord env={env} appCode={appCode}   newPublish={newPublish.current}/>
      </div>
    </div>
  );
}
