// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message,Radio, Typography, } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { UploadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import DetailContext from '@/pages/application/application-detail/context';
import { listAppEnv, checkNextEnv } from '@/pages/application/service';
import VersionDeploy from './version-deploy';
import NextDeploy from './next-deploy';
import MasterDeploy from './master-deploy';
import OfflineDeploy from './offline-deploy';
import EntryProject from './entry-project';
import {restartApp,checkOfflineDeploy} from '@/pages/application/service';
import { IProps } from './types';
import ServerStatus from '../server-status';
import { getPipelineUrl } from '@/pages/application/service';
import { useMasterBranchList } from '@/pages/application/application-detail/components/branch-manage/hook';
import './index.less';

const rootCls = 'publish-detail-compo';
const { Paragraph } = Typography;
export default function PublishDetail(props: IProps) {
  
  let { deployInfo, envTypeCode, onOperate, appStatusInfo, nextTab, pipelineCode,checkVersion,handleTabChange,versionData } = props;
  let { metadata, branchInfo, envInfo, buildInfo, status } = deployInfo || {};
  const { buildUrl } = buildInfo || {};
  const { appData } = useContext(DetailContext);
  const { appCategoryCode, feType, deployModel } = appData || {};
  const [envLoading,setEnvLoading]=useState<boolean>(false);
  const [deployNextEnvVisible, setDeployNextEnvVisible] = useState(false);
  const [deployMasterVisible, setDeployMasterVisible] = useState(false);
  const [envProjectVisible, setEnvProjectVisible] = useState(false);
  const [projectEnvCodeOptions, setProjectEnvCodeOptions] = useState<any>([]);
  const [offlineEnvData, setOffLineEnvData] = useState<any>([]); //支持离线部署的环境
  const [deployEnv, setDeployEnv] = useState<string[]>();
  const [restartEnv, setRestartEnv] = useState<string[]>([]); //重启时获取到的环境值
  const [envDataList, setEnvDataList] = useState<IOption[]>([]);
  const [nextEnvDataList, setNextEnvDataList] = useState<IOption[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [pipelineOptions, setPipelineOptions] = useState<any>([]);
  const [selectMaster, setSelectMaster] = useState<any>('');
  const [beforeUploadInfo, setBeforeUploadInfo] = useState<boolean>(true);
  const [masterListData] = useMasterBranchList({ branchType: 'master', appCode: appData?.appCode || '' });
  const [versionPublishVisiable,setVersionPublishVisiable]=useState<boolean>(false)

  let newNextEnvTypeCode = '';
  useEffect(() => {
    if (!appCategoryCode || !appData) return;
    // 所有环境
    getEnvList({ envTypeCode: envTypeCode, appCode: appData?.appCode, proEnvType: 'benchmark' });
    // 项目环境
    getEnvList({ envTypeCode: envTypeCode, appCode: appData?.appCode, proEnvType: 'project' });
    // 支持离线部署的环境
    getEnvList({
      envTypeCode: envTypeCode,
      appCode: appData?.appCode,
      proEnvType: 'benchmark',
      // clusterName: 'private-cluster',
    });

    if (metadata?.id !== undefined) {
      getRequest(checkNextEnv, {
        data: {
          id: metadata?.id,
        },
      }).then((response) => {
        if (response?.success) {
          newNextEnvTypeCode = response?.data;
          getNextEnv(newNextEnvTypeCode).then((resp) => {
            if (resp?.success) {
              let envSelect: any = [];
              resp?.data?.map((item: any) => {
                envSelect.push({ label: item.envName, value: item.envCode });
              });
              setNextEnvDataList(envSelect);
            }
          });
        }
      });
    }
  }, [appCategoryCode, envTypeCode, metadata?.id]);

  useEffect(() => {
    if (masterListData.length !== 0) {
      const option = masterListData.map((item: any) => ({ value: item.branchName, label: item.branchName }));
      setMasterBranchOptions(option);
      const initValue = option.find((item: any) => item.label === 'master');
      setSelectMaster(initValue?.value);
    }
  }, [masterListData]);

  useEffect(() => {
    if (nextTab) {
      getRequest(getPipelineUrl, {
        data: { appCode: appData?.appCode, envTypeCode: nextTab, pageIndex: -1, size: -1 },
      }).then((res) => {
        if (res?.success) {
          let data = res?.data?.dataSource;
          const pipelineOptionData = data.map((item: any) => ({ value: item.pipelineCode, label: item.pipelineName }));
          setPipelineOptions(pipelineOptionData);
        } else {
          setPipelineOptions([]);
        }
      });
    }
  }, [nextTab]);

  // 获取环境列表
  const getEnvList = (params: any) => {
    setEnvLoading(true)
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
        // if (params.clusterName) {
        setOffLineEnvData(envs);
        // }
        if (params.proEnvType === 'benchmark') {
          setOffLineEnvData(envs);
        }
        if (params.proEnvType === 'benchmark') {
          setEnvDataList(envs);
        }
        if (params.proEnvType === 'project') {
          setProjectEnvCodeOptions(envs);
        }
      }
    }).finally(()=>{
      setEnvLoading(false)
    });
  };
  // 下一个部署环境
  const getNextEnv = (envTypeCode: string) => {
    return getRequest(listAppEnv, {
      data: {
        envTypeCode: newNextEnvTypeCode,
        appCode: appData?.appCode,
      },
    });
  };
  
  // 部署到下一个环境
  const deployNext = () => {
    onOperate('deployNextEnvStart');
    setDeployNextEnvVisible(true);
  };
  // 放弃部署到下一个环境
  const cancelDeployNext = () => {
    onOperate('deployNextEnvEnd');
    setDeployNextEnvVisible(false);
   // setConfirmLoading(false);
  };
  

  // 部署 master
  const deployToMaster = () => {
    onOperate('deployMasterStart');
    setDeployMasterVisible(true);
  };
  // 放弃部署 master
  const cancelDeployToMaster = () => {
    onOperate('deployMasterEnd');
    setDeployMasterVisible(false);
   // setConfirmLoading(false);
  };


  // 发布环境
  let I = 0;
  const envNames = useMemo(() => {
    const { deployEnvs } = envInfo || {};
    return (
      envDataList
        .filter((envItem) => {
          return (deployEnvs || []).includes(envItem.value);
        })
        .map((envItem) => envItem.label)
        // .map((envItem) => `${envItem.label}(${envItem.value})`)
        .join(',')
    );
  }, [envDataList, deployInfo]);


  const handleCancel = () => {
    setDeployVisible(false);
    setDeployEnv([]);
    onOperate('uploadImageEnd');
  };

  //重启确认
  const { confirm } = Modal;
  const ensureRestart = () => {
    confirm({
      title: '确定要重启应用吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        restartApp({
          appCode: appData?.appCode,
          // envCode: restartEnv?.[0],
          envCode: restartEnv,
          appCategoryCode: appData?.appCategoryCode,
        })
          .then((resp) => {
            if (resp.success) {
              message.success('操作成功！');
            }
          })
          .finally(() => {
            setRestartVisible(false);
            setRestartEnv([]);
          });
      },
      onCancel() { },
    });
  };
  let envDataOption: any = []; //重启时选择环境option
  envDataList?.map((item) => {
    if (item?.value === 'tt-his') {
      envDataOption.push({ label: item.label, value: item.value });
    }
    if (item?.value === 'tt-health') {
      envDataOption.push({ label: item.label, value: item.value });
    }
    if (item?.value === 'seenew-health') {
      envDataOption.push({ label: item.label, value: item.value });
    }
    if (item?.value === 'tt-his-clusterb') {
      envDataOption.push({ label: item.label, value: item.value });
    }
  });


  let errorInfo: any[] = [];
  if (status && status.deployErrInfo) {
    Object.keys(status.deployErrInfo).forEach((item) => {
      if (status.deployErrInfo[item]) {
        errorInfo.push({ key: item, errorMessage: status.deployErrInfo[item] });
      }
    });
  }

  function goToJenkins(item: any) {
    let jenkinsUrl: any[] = [];
    if (buildUrl && item?.key) {
      const data = buildUrl[item?.key] || '';
      if (data) {
        window.open(data, '_blank');
      }
    }
    
  }
  const beforeUploadAction = (envCode: string) => {
    // setBeforeUploadInfo(true);
    getRequest(checkOfflineDeploy, { data: { appCode: appData?.appCode, envCode } }).then((res) => {
      if (res.success) {
        setBeforeUploadInfo(false);
      } else {
        setBeforeUploadInfo(true);
      }
    });
  };
  const changeEnv=(e:any)=>{
    onOperate('uploadImageStart');
    setDeployEnv(e.target.value);
    beforeUploadAction(e.target.value);
  }


  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {/* {appData?.appType === 'backend' && envTypeCode === 'prod' && deployEnv?.indexOf('tt-his') !== -1 && (
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启应用
          </Button>
        )} */}
         {checkVersion===true&& appData?.deployModel === 'online'&&envTypeCode !== 'prod' && (
          <Button type="primary" onClick={()=>{
            setVersionPublishVisiable(true)
            onOperate('versionPublishStart');
           
            }}>
            部署到版本发布
          </Button>
        )}
        {appData?.deployModel === 'offline' && (
          <Button
            type="primary"
            onClick={() => {
              setDeployVisible(true);
              setDeployEnv([]);
              setBeforeUploadInfo(true);
            }}
            icon={<UploadOutlined />}
          >
            离线部署
          </Button>
        )}

        {/* {envTypeCode === 'prod' ? (
          <Button type="default" disabled={!deployInfo.deployedEnvs} danger onClick={() => setRollbackVisible(true)}>
            发布回滚
          </Button>
        ) : null} */}
         
        {envTypeCode !== 'prod' && appData?.deployModel === 'online' && feType !== 'pda' && (
          <Button
            type="primary"
            onClick={() => {
              setEnvProjectVisible(true);
            }}
          >
            项目环境部署
          </Button>
        )}
        {envTypeCode !== 'prod' && appData?.deployModel === 'online' && (
          <Button type="primary" onClick={deployToMaster}>
            部署主干分支
          </Button>
        )}

        {envTypeCode !== 'prod' && feType !== 'pda' && appData?.deployModel === 'online' && (
          <Button type="primary" onClick={deployNext}>
            部署到下个环境
          </Button>
        )}

        {/* {envTypeCode === 'prod' && appData?.appType === 'backend' && (
          <Button type="primary" danger onClick={handleCancelPublish}>
            取消发布
          </Button>
        )} */}
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={4}
        bordered
      >
        <Descriptions.Item label="CRID" contentStyle={{ whiteSpace: 'nowrap' }}>
        
          {metadata?.id || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="部署分支" span={appData?.appType === 'frontend' ? 1 : 2}>
          {branchInfo?.releaseBranch ? <Paragraph copyable>{branchInfo?.releaseBranch}</Paragraph> : '---'}
         
        </Descriptions.Item>
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="部署版本" contentStyle={{ whiteSpace: 'nowrap' }}>
            {buildInfo?.buildResultInfo?.version ? (
              <Paragraph copyable>{buildInfo?.buildResultInfo?.version}</Paragraph>
            ) : (
              '---'
            )}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="发布环境">{envNames || '--'}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={4}>
          {branchInfo?.conflictFeature || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="主干分支" span={4}>
          {branchInfo?.masterBranch || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={4}>
          {branchInfo?.features.join(',') || '--'}
        </Descriptions.Item>
        {feType === 'pda' && (
          <Descriptions.Item label="打包方式" span={4}>
            <span style={{ color: '#1873cc' }}>{metadata?.pdaDeployType || '--'}</span>
          </Descriptions.Item>
        )}
        {status?.deployErrInfo && errorInfo.length && (
          <Descriptions.Item label="部署错误信息" span={4} contentStyle={{ color: 'red' }}>
            <div>
              {errorInfo.map((err) => (
                <div>
                  <span style={{ color: 'black' }}> {err?.errorMessage ? `${err?.key}：` : ''}</span>
                  <a
                    style={{ color: 'red', textDecoration: 'underline' }}
                    onClick={() => {
                      if (err?.errorMessage.indexOf('请查看jenkins详情') !== -1) {
                        goToJenkins(err);
                      }
                      if (
                        err?.errorMessage.indexOf('请查看jenkins详情') === -1 &&
                        err?.key !== 'dependencyCheck' &&
                        appData?.appType !== 'frontend'
                      ) {
                        localStorage.setItem('__init_env_tab__', metadata?.envTypeCode);
                        history.push(
                          `/matrix/application/detail/deployInfo?appCode=${metadata?.appCode}&id=${appData?.id}`,
                        );
                      }
                    }}
                  >
                    {err?.errorMessage}
                  </a>
                  {appData?.appType !== 'frontend' && envInfo?.depoloyEnvs?.includes(err.key) && (
                    <span style={{ color: 'gray' }}> {err?.errorMessage ? '（点击跳转）' : ''}</span>
                  )}
                </div>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
      {envTypeCode === 'prod' && appStatusInfo?.length ? (
        <ServerStatus onOperate={onOperate} appStatusInfo={appStatusInfo} />
      ) : null}

      {/* --------------------- modals --------------------- */}

      {/* 部署到 下一个环境 */}
      <NextDeploy 
      deployNextEnvVisible={deployNextEnvVisible}  
      curPipelineCode={pipelineCode}    
      pipelineOptions={pipelineOptions}  
      onSave={()=>{
       setDeployNextEnvVisible(false);
        onOperate('deployNextEnvSuccess');
      }} 
      onClose={cancelDeployNext} 
      nextEnvDataList={nextEnvDataList}/>

      {/* 部署到主干分支 */}
      <MasterDeploy 
      deployMasterVisible={deployMasterVisible} 
      masterBranchOptions={masterBranchOptions}
      envDataList={envDataList}
      selectMaster={selectMaster}
      deployModel={deployModel}
      appData={appData}
      curPipelineCode={pipelineCode}
      feType={feType}
      changeMaster={(value:string)=>{setSelectMaster(value)}}
      onSave={()=>{
         setDeployMasterVisible(false);
        // setDeployMasterEnv([]);
         onOperate('deployMasterEnd');
      }}
      onClose={cancelDeployToMaster}
      />
     
      {/* 离线部署 */}
      <OfflineDeploy 
      deployVisible={deployVisible}
      curPipelineCode={pipelineCode}
      deployModel={deployModel}
      onClose={handleCancel}
      feType={feType}
      envLoading={envLoading}
      beforeUploadInfo={beforeUploadInfo}
      changeEnv={(e:any)=>changeEnv(e)}
      deployEnv={deployEnv}
      offlineEnvData={offlineEnvData}
      onSave={()=>{
        setDeployVisible(false);
        setDeployEnv([]);
        onOperate('uploadImageEnd');
      }}

      />
    

      {/* 重启按钮 */}
      <Modal
        key="deployRestart"
        title="选择重启环境"
        visible={restartVisible}
        onCancel={() => {
          setRestartVisible(false);
          setRestartEnv([]);
        }}
        onOk={ensureRestart}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          {envDataOption.length > 0 && (
            <Radio.Group
              value={restartEnv}
              onChange={(v: any) => setRestartEnv(v.target.value)}
              options={envDataOption}
            ></Radio.Group>
          )}
        </div>
      </Modal>
      {/* 跳转项目环境信息页面按钮 */}
      <EntryProject 
      envProjectVisible={envProjectVisible}
      onClose={()=>{
        setEnvProjectVisible(false);
      }}
      appData={appData}
      projectEnvCodeOptions={projectEnvCodeOptions}
      envLoading={envLoading}
      />
     {/* --------- 部署到版本发布弹窗----- */}
      <VersionDeploy 
      visible={versionPublishVisiable} 
      onClose={()=>{setVersionPublishVisiable(false)
        onOperate('versionPublishEnd');
      }} 
      handleTabChange={(tab:string)=>{handleTabChange(tab)}}
      appCode={appData?.appCode}
      curPipelineCode={pipelineCode}
      onSave={()=>{
        setVersionPublishVisiable(false)
        onOperate('versionPublishEnd');

      }}
      versionData={versionData}
       />
     
    </div>
  );
}
