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

const rootCls = 'deploy-content-compo';
const tempData = {
  metadata: {
    id: 1650,
    appCode: 'dubbo-consumer',
    pipelineCode: 'test-pipeline3',
    envTypeCode: 'dev',
    isActive: 1,
    curUser: '王安楠',
  },
  branchInfo: {
    masterBranch: 'master',
    releaseBranch: 'release_test-pipeline3_20220425162817',
    features: ['feature_ccd_20220406160947'],
    unMergedFeatures: [],
    conflictFeature: '',
    tagName: '',
  },
  envInfo: {
    deployEnvs: ['test-proe-bm', 'base-dev'],
  },
  buildInfo: {
    buildUrl: {
      'base-dev': 'http://jenkins-dev.cfuture.shop/job/dubbo-consumer/38/console',
      'test-proe-bm': 'http://jenkins-dev.cfuture.shop/job/dubbo-consumer/39/console',
    },
    buildType: 'beServerBuild',
    buildResultInfo: {
      artifactId: 'dubbo-consumer',
      filePath: '',
      groupID: 'com.alibaba.edas',
      image:
        '[{"envCode":"base-dev","image":"cfuture-harbor-registry-vpc.cn-hangzhou.cr.aliyuncs.com/c2f/test-dubbo-consumer:20220425162834","deployTime":"2022-04-25 16:28:34"},{"envCode":"test-proe-bm","image":"cfuture-harbor-registry-vpc.cn-hangzhou.cr.aliyuncs.com/c2f/test-dubbo-consumer:20220425162834","deployTime":"2022-04-25 16:28:34"}]',
      jarPath: 'test-dubbo-consumer.jar',
      version: '1.0',
    },
  },
  status: {
    deployStatus: 'process',
    deployNodes: [
      {
        nodeName: '开始任务',
        nodeCode: 'start',
        nodeType: 'single',
        nodeStatus: 'finish',
        confirm: null,
      },
      {
        nodeName: '合并分支',
        nodeCode: 'merge',
        nodeType: 'single',
        nodeStatus: 'finish',
        confirm: {
          waitConfirm: false,
          label: '确认合并',
        },
      },
      {
        nodeName: '并发节点',
        nodeCode: 'concurrency',
        nodeType: 'subject',
        nodeStatus: 'error',
        confirm: null,
        nodes: {
          'base-dev': [
            {
              nodeName: '构建',
              nodeCode: 'build',
              nodeType: 'single',
              nodeStatus: 'finish',
              confirm: {
                waitConfirm: false,
                label: '确认构建',
              },
              EnvCode: 'base-dev',
            },
            {
              nodeName: '部署',
              nodeCode: 'deploy',
              nodeType: 'single',
              nodeStatus: 'finish',
              confirm: {
                waitConfirm: false,
                label: '确认部署',
              },
              EnvCode: 'base-dev',
              DeployingBatch: 0,
            },
          ],
          'test-proe-bm': [
            {
              nodeName: '构建',
              nodeCode: 'build',
              nodeType: 'single',
              nodeStatus: 'finish',
              confirm: {
                waitConfirm: false,
                label: '确认构建',
              },
              EnvCode: 'test-proe-bm',
            },
            {
              nodeName: '部署',
              nodeCode: 'deploy',
              nodeType: 'single',
              nodeStatus: 'error',
              confirm: {
                waitConfirm: false,
                label: '确认部署',
              },
              EnvCode: 'test-proe-bm',
              DeployingBatch: 0,
            },
          ],
        },
      },
      {
        nodeName: '完成',
        nodeCode: 'end',
        nodeType: 'single',
        nodeStatus: 'wait',
        confirm: null,
      },
    ],
    CurDeployNodesID: 3,
    deployErrInfo: {
      'base-dev': '',
      concurrency: '参数异常',
      'test-proe-bm': '',
    },
    lockID: 0,
  },
};

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

const DeployContent = React.forwardRef((props: DeployContentProps, ref) => {
  //传给父组件 关闭/开启 定时器的方法
  useImperativeHandle(ref, () => ({
    onOperate,
    onSpin,
    stopSpin,
  }));

  const { envTypeCode, isActive, onDeployNextEnvSuccess, pipelineCode, visible, nextTab } = props;
  console.log(pipelineCode, 'pipelineCode');
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

  // setDeployInfo(tempData)

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

    // if (resp1?.data?.dataSource && resp1?.data?.dataSource.length > 0) {
    // const nextInfo = resp1?.data?.dataSource[0];
    // setDeployInfo(nextInfo);
    // if (tempData) {
    //   setDeployInfo(tempData);
    // }

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
  }, [visible]);

  const onSpin = () => {
    debugger;
    setLoading(true);
    console.log('jiazai');
  };

  const stopSpin = () => {
    setLoading(false);
    console.log('stop jiazai');
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
            masterBranch={masterBranchName.current}
          />
          <PublishBranch
            deployInfo={deployInfo}
            masterBranch={masterBranchName.current}
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
          />
        </Spin>
      </div>
      <div className={`${rootCls}-sider`}>
        <PublishRecord env={envTypeCode} appCode={appCode} />
      </div>
    </div>
  );
});

export default DeployContent;

// export default function DeployContent(props: DeployContentProps) {

// }
