/**
 * DeployContent
 * @description 部署内容
 * @author moting.nq
 * @create 2021-04-15 10:04
 */

import React, { useState, useContext, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
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
import { Iprops } from '_@cffe_fe-datav-components@0.1.8@@cffe/fe-datav-components/es/components/charts/chart-bar';

const rootCls = 'deploy-content-compo';

export interface DeployContentProps {
  /** 当前页面是否激活 */
  isActive?: boolean;
  /** 环境参数 */
  envTypeCode: string;
  /** 流水线 */
  pipelineCode: string;
  visible: boolean;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
  // 下一个tab
  nextTab: string;
}

export default function DeployContent(props: DeployContentProps) {
  const { envTypeCode, isActive, onDeployNextEnvSuccess, pipelineCode, visible, nextTab } = props;
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const cachebranchName = useRef<string>();
  const masterBranchName = useRef<string>('master');
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
  const publishContentRef = useRef<any>();

  const requestData = async () => {
    if (!appCode || !isActive || !pipelineCode) return;

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
      pipelineCode,
      isDeployed: 1,
      masterBranch: masterBranchName.current,
    });
    const resp3 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode,
      isDeployed: 0,
      pipelineCode,
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

    // 如果有部署信息，且为线上，则更新应用状态
    if (envTypeCode === 'prod' && appData) {
      const resp4 = await getRequest(queryApplicationStatus, {
        data: {
          deploymentName: appData?.deploymentName,
          envCode: deployInfo?.envInfo?.deployEnvs,
        },
      }).catch(() => {
        return { data: null };
      });

      const { Status: nextAppStatus } = resp4?.data || {};
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
    if (!appCode || !isActive || !pipelineCode) return;
    timerHandle('do', true);
  }, [appCode, isActive, pipelineCode]);

  useEffect(() => {
    if (visible) {
      timerHandle('stop');
    }
    if (!visible) {
      timerHandle('do', true);
    }
  }, [visible]);

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
            pipelineCode={pipelineCode}
            nextTab={nextTab}
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
            pipelineCode={pipelineCode}
            deployedList={branchInfo.deployed}
            appStatusInfo={appStatusInfo}
            onOperate={onOperate}
            onSpin={onSpin}
            stopSpin={stopSpin}
          />
          <PublishBranch
            deployInfo={deployInfo}
            hasPublishContent={!!(branchInfo.deployed && branchInfo.deployed.length)}
            dataSource={branchInfo.unDeployed}
            env={envTypeCode}
            onSearch={searchUndeployedBranch}
            pipelineCode={pipelineCode}
            onSubmitBranch={(status) => {
              timerHandle(status === 'start' ? 'stop' : 'do', true);
            }}
            masterBranchChange={(masterBranch: string) => {
              masterBranchName.current = masterBranch;
              timerHandle('do', true);
            }}
            changeBranchName={(branchName: string) => {
              // cachebranchName.current = branchName;
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
