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
  getNewDeployInfo
} from '@/pages/application/service';
import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';
import { getRequest } from '@/utils/request';
import PublishDetail from './components/publish-detail';
import PublishContent from './components/publish-content';
import PublishBranch from './components/publish-branch';
import PublishRecord from './components/publish-record';
import VersionPublishDetail from '../version-publish';
import VersionPublishRecord from '../version-publish/component/version-record'
import { Spin } from 'antd';
import { listAppEnv, judgeIsNew } from '@/pages/application/service';
import { appActiveReleases } from '../service';
import './index.less';
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
  // versionData:any;
  checkVersion: boolean;
  handleTabChange: (tab: string) => void;
}

export default function DeployContent(props: DeployContentProps) {
  const { envTypeCode, isActive, onDeployNextEnvSuccess, pipelineCode, visible, nextTab, checkVersion, handleTabChange } = props;
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const cachebranchName = useRef<string>();
  const masterBranchName = useRef<string>('master');
  const [updating, setUpdating] = useState(false);
  const [deployInfo, setDeployInfo] = useState<any>({});
  const [deployed, setDeployed] = useState<any>([]);
  const [unDeployed, setUnDeployed] = useState<any>([]);
  // 应用状态，仅线上有
  const [appStatusInfo, setAppStatusInfo] = useState<IStatusInfoProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [envList, setEnvList] = useState([])
  const [deployedLoad, setDeployedLoad] = useState(false);
  const [unDeployedLoad, setUnDeployedLoad] = useState(false);
  const newPublish = useRef<any>(undefined);//是否是新的cicd
  const [versionData, setVersionData] = useState<any>([]);//请求版本列表数据
  const isHbosVersion = appData?.appCategoryCode === 'hbos' && checkVersion && envTypeCode === 'version';
  useEffect(() => {
    if (!appCode || !isActive || !pipelineCode) return;
    isNewPublish();
    getVersionList();

  }, [appCode, isActive, pipelineCode])

  const getVersionList = () => {
    appActiveReleases({ appCode: appData?.appCode }).then((res) => {
      if (res?.success && res?.data?.length > 0) {
        setVersionData(res?.data)

      } else {
        setVersionData([])

      }

    })
  }


  const requestData = async () => {
    if (!appCode || !isActive || !pipelineCode) return;
    setUpdating(true);

    // const resp = await queryActiveDeployInfo({ pipelineCode: pipelineCode });

    var queryDeployInfo = newPublish.current ? getNewDeployInfo : queryActiveDeployInfo;
    const resp = await queryDeployInfo({ pipelineCode: pipelineCode });

    if (resp && resp.success) {
      if (resp?.data) {
        setDeployInfo(resp?.data || {});
      }
      if (!resp.data) {
        setDeployInfo({});
      }
    } else {
      setDeployInfo({});
    }
    if (!deployed?.length) {
      setDeployedLoad(true)
    }
    if (!unDeployed?.length) {
      setUnDeployedLoad(true)
    }
    const resp2 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode,
      pipelineCode,
      isDeployed: 1,
      masterBranch: masterBranchName.current,
      needRelationInfo: envTypeCode === 'prod' ? 1 : 0
    });
    setDeployed(resp2?.data || [])
    setDeployedLoad(false);

    const resp3 = await queryFeatureDeployed({
      appCode: appCode!,
      envTypeCode,
      isDeployed: 0,
      pipelineCode,
      branchName: cachebranchName.current,
      masterBranch: masterBranchName.current,
      needRelationInfo: envTypeCode === 'prod' ? 1 : 0
    });
    setUnDeployed(resp3?.data || [])
    setUnDeployedLoad(false);

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
    setUpdating(false);
  };

  // 定时请求发布内容
  const { getStatus: getTimerStatus, handle: timerHandle } = useInterval(requestData, 8000, { immediate: false, delay: true });

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
  // useEffect(() => {
  //   if (!appCode || !isActive || !pipelineCode) return;
  //   timerHandle('do', true);
  // }, [appCode, isActive, pipelineCode]);

  useEffect(() => {
    if (visible) {
      timerHandle('stop');
    }
    if (!visible && newPublish.current !== undefined) {
      timerHandle('do', true);
    }
  }, [visible]);

  useEffect(() => {
    if (!appCode || !envTypeCode) return;
    getEnvList({ envTypeCode, appCode: appData?.appCode, proEnvType: 'benchmark' });
  }, [envTypeCode, appCode])

  // 获取该应用所有环境列表
  const getEnvList = (params: any) => {
    getRequest(listAppEnv, {
      data: {
        ...params,
      },
    }).then((result) => {
      let envs: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          envs.push({ label: item.envName, value: item.envCode });
        });
        setEnvList(envs)
      }
    });
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
          {envTypeCode === "version" ? <VersionPublishDetail
            //@ts-ignore
            isActive={isActive}
            envTypeCode={envTypeCode}
            pipelineCode={pipelineCode}
            visible={visible}

          /> :
            <PublishDetail
              envTypeCode={envTypeCode}
              deployInfo={deployInfo}
              appStatusInfo={appStatusInfo}
              pipelineCode={pipelineCode}
              nextTab={nextTab}
              checkVersion={checkVersion}
              versionData={versionData}
              newPublish={newPublish.current}
              onOperate={(type) => {
                if (type === 'deployNextEnvSuccess') {
                  onDeployNextEnvSuccess();
                  return;
                }
                requestData();
                onOperate(type);
              }}
              handleTabChange={(tab: string) => { handleTabChange(tab) }}
            />
          }

          <PublishContent
            appCode={appCode!}
            envTypeCode={envTypeCode}
            deployInfo={deployInfo}
            pipelineCode={pipelineCode}
            deployedList={deployed}
            appStatusInfo={appStatusInfo}
            loading={deployedLoad}
            onOperate={onOperate}
            onSpin={onSpin}
            stopSpin={stopSpin}
            envList={envList}
            newPublish={newPublish.current}
          // loadData={requestDeployBranch}
          // refreshList={() => {
          //   requestUnDeployBranch();
          //   requestDeployBranch();
          // }}
          />
          {(envTypeCode !== 'version' || isHbosVersion) && <PublishBranch
            deployInfo={deployInfo}
            hasPublishContent={!!(deployed && deployed.length)}
            dataSource={unDeployed}
            env={envTypeCode}
            versionData={versionData}
            checkVersion={checkVersion}
            onSearch={searchUndeployedBranch}
            pipelineCode={pipelineCode}
            onSubmitBranch={(status) => {
              timerHandle(status === 'start' ? 'stop' : 'do', true);
            }}
            masterBranchChange={(masterBranch: string) => {
              masterBranchName.current = masterBranch;
              timerHandle('do', true);
            }}
            loading={unDeployedLoad}
            changeBranchName={(branchName: string) => {
              // cachebranchName.current = branchName;
            }}
            newPublish={newPublish.current}
            isHbosVersion={isHbosVersion}
          />
          }

        </Spin>
      </div>
      <div className={`${rootCls}-sider`}>
        {envTypeCode === "version" ? <>
          <VersionPublishRecord envTypeCode={envTypeCode} />

        </> :
          <PublishRecord env={envTypeCode} appCode={appCode} newPublish={newPublish.current} />}
      </div>
    </div>
  );
}
