// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Radio, Upload } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { history } from 'umi';
import DetailContext from '@/pages/application/application-detail/context';
import { listAppEnv, checkNextEnv } from '@/pages/application/service';
import {
  cancelDeploy,
  deployReuse,
  deployMaster,
  queryEnvsReq,
  offlineDeploy,
  restartApp,
} from '@/pages/application/service';
import MergeConflict from '../merge-conflict';
import { UploadOutlined } from '@ant-design/icons';
import { IProps } from './types';
import ServerStatus from '../server-status';
import './index.less';

const rootCls = 'publish-detail-compo';
const nextEnvTypeCodeMapping: Record<string, string> = {
  dev: 'test',
  test: 'pre',
  pre: 'prod',
};

export default function PublishDetail(props: IProps) {
  let { deployInfo, envTypeCode, onOperate, appStatusInfo } = props;
  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};
  const [deployNextEnvVisible, setDeployNextEnvVisible] = useState(false);
  const [deployMasterVisible, setDeployMasterVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [envDataList, setEnvDataList] = useState([]);
  const [deployEnv, setDeployEnv] = useState<string[]>();
  const [restartEnv, setRestartEnv] = useState<string[]>([]); //重启时获取到的环境值
  const [deployMasterEnv, setDeployMasterEnv] = useState<string[]>();
  const [deployNextEnv, setDeployNextEnv] = useState<string[]>();
  const [envDataList, setEnvDataList] = useState<IOption[]>([]);
  const [nextEnvDataList, setNextEnvDataList] = useState<IOption[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const [mergeVisible, setMergeVisible] = useState(false); //冲突详情
  let newNextEnvTypeCode = '';
  useEffect(() => {
    if (!appCategoryCode) return;

    // 当前部署环境
    getRequest(listAppEnv, {
      data: {
        envTypeCode: envTypeCode,
        appCode: appData?.appCode,
      },
    }).then((result) => {
      let envSelect: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          envSelect.push({ label: item.envName, value: item.envCode });
        });
        setEnvDataList(envSelect);
      }
      // setEnvDataList(data.list);
    });

    if (deployInfo.id !== undefined) {
      getRequest(checkNextEnv, {
        data: {
          id: deployInfo.id,
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
    // const nextEnvTypeCode = nextEnvTypeCodeMapping[envTypeCode];
  }, [appCategoryCode, envTypeCode, deployInfo.id]);
  // 下一个部署环境
  const getNextEnv = (envTypeCode: string) => {
    return getRequest(listAppEnv, {
      data: {
        envTypeCode: newNextEnvTypeCode,
        appCode: appData?.appCode,
      },
    });
  };
  // 取消发布
  const handleCancelPublish = () => {
    onOperate('cancelDeployStart');

    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({
          id: deployInfo.id,
        }).then(() => {
          onOperate('cancelDeployEnd');
        });
      },
      onCancel() {
        onOperate('cancelDeployEnd');
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
    setConfirmLoading(false);
  };
  // 确认发布操作
  const confirmPublishNext = async () => {
    setConfirmLoading(true);
    try {
      await deployReuse({ id: deployInfo.id, envs: deployNextEnv });
      message.success('操作成功，正在部署中...');
      setDeployNextEnvVisible(false);
      onOperate('deployNextEnvSuccess');
    } finally {
      setConfirmLoading(false);
    }
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
    setConfirmLoading(false);
  };
  // 确认发布操master作
  const confirmPublishToMaster = async () => {
    setConfirmLoading(true);
    try {
      await deployMaster({
        appCode: appData?.appCode,
        envTypeCode: envTypeCode,
        envCodes: deployMasterEnv,
        isClient: appData?.isClient === 1,
      });
      message.success('操作成功，正在部署中...');
      setDeployMasterVisible(false);
      setDeployMasterEnv([]);
      onOperate('deployMasterEnd');
    } finally {
      setConfirmLoading(false);
    }
  };

  // 发布环境
  let I = 0;
  const envNames = useMemo(() => {
    const { envs } = deployInfo;
    const envList = envs?.split(',') || [];

    // console.log(envDataList,I++);
    return envDataList
      .filter((envItem) => {
        return envList.includes(envItem.value);
      })
      .map((envItem) => `${envItem.label}(${envItem.value})`)
      .join(',');
  }, [envDataList, deployInfo]);

  // 离线部署
  const uploadImages = () => {
    return `${offlineDeploy}?appCode=${appData?.appCode}&envTypeCode=${props.envTypeCode}&envs=${deployEnv}&isClient=${appData?.isClient}`;
  };

  // 上传按钮 message.error(info.file.response?.errorMsg) ||
  const uploadProps = {
    name: 'image',
    action: uploadImages,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
    },
    onChange: (info: any) => {
      if (info.file.status === 'uploading') {
        return;
      }
      if (info.file.status === 'done' && info.file?.response.success == 'true') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      } else {
        message.error(info.file.response.errorMsg || '');
      }
      setDeployVisible(false);
      setDeployEnv([]);
      onOperate('uploadImageEnd');
    },
  };

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
      onCancel() {},
    });
  };
  // 冲突代码的查看详情
  const handleMergeDetail = () => {
    setMergeVisible(true);
  };
  const handleCancelMerge = () => {
    setMergeVisible(false);
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

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {/* {appData?.appType === 'backend' && envTypeCode === 'prod' && deployEnv?.indexOf('tt-his') !== -1 && (
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启应用
          </Button>
        )} */}
        {envTypeCode === 'prod' && (
          <Button type="primary" onClick={() => setDeployVisible(true)} icon={<UploadOutlined />}>
            离线部署
          </Button>
        )}

        {/* {envTypeCode === 'prod' ? (
          <Button type="default" disabled={!deployInfo.deployedEnvs} danger onClick={() => setRollbackVisible(true)}>
            发布回滚
          </Button>
        ) : null} */}
        {appData?.appType === 'backend' && envTypeCode !== 'prod' && (
          <Button type="primary" onClick={deployToMaster}>
            部署Master
          </Button>
        )}

        {envTypeCode !== 'prod' && (
          <Button type="primary" onClick={deployNext}>
            部署到下个环境
          </Button>
        )}

        <Button type="primary" danger onClick={handleCancelPublish}>
          取消发布
        </Button>
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={4}
        bordered
      >
        <Descriptions.Item label="CRID" contentStyle={{ whiteSpace: 'nowrap' }}>
          {deployInfo?.id || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="部署分支" span={appData?.appType === 'frontend' ? 1 : 2}>
          {deployInfo?.releaseBranch || '--'}
        </Descriptions.Item>
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="部署版本" contentStyle={{ whiteSpace: 'nowrap' }}>
            {deployInfo?.version || '--'}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="发布环境">{envNames || '--'}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={4}>
          {deployInfo?.conflictFeature || '--'}
          {!deployInfo?.conflictFeature && (
            <Button type="primary" onClick={handleMergeDetail} className="ml10">
              查看详情
            </Button>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={4}>
          {deployInfo?.features || '--'}
        </Descriptions.Item>
        {deployInfo?.deployErrInfo !== '' && deployInfo.hasOwnProperty('deployErrInfo') && (
          <Descriptions.Item label="部署错误信息" span={4} contentStyle={{ color: 'red' }}>
            <a
              style={{ color: 'red', textDecoration: 'underline' }}
              onClick={() => {
                if (deployInfo?.deployErrInfo.indexOf('请查看jenkins详情') !== -1) {
                  window.open(deployInfo.jenkinsUrl);
                }
                if (deployInfo?.deployErrInfo.indexOf('请查看jenkins详情') === -1) {
                  localStorage.setItem('__init_env_tab__', deployInfo?.envTypeCode);
                  history.push(
                    `/matrix/application/detail/deployInfo?appCode=${deployInfo?.appCode}&id=${appData?.id}`,
                  );
                }
              }}
            >
              {deployInfo?.deployErrInfo}
            </a>
            <span style={{ color: 'gray' }}>（点击跳转）</span>
          </Descriptions.Item>
        )}
      </Descriptions>
      {envTypeCode === 'prod' && appStatusInfo?.length ? (
        <ServerStatus onOperate={onOperate} appStatusInfo={appStatusInfo} />
      ) : null}

      {/* --------------------- modals --------------------- */}

      {/* 部署到 下一个环境 */}
      <Modal
        key="deployNext"
        title="选择发布环境"
        visible={deployNextEnvVisible}
        confirmLoading={confirmLoading}
        onOk={confirmPublishNext}
        maskClosable={false}
        onCancel={cancelDeployNext}
      >
        <div>
          <span>发布环境：</span>
          {/* <Radio.Group value={type} onChange={handleTypeChange}> */}
          {/* <Radio.Group  value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList}></Radio.Group> */}
          <Checkbox.Group value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList} />

          {/* {nextEnvDataList.map((item,index)=>{
            return(
              <Radio.Group  onChange={(v: any) => setDeployNextEnv(v)}  value={deployNextEnv}>
              <Radio key={index} value={item.value}  autoFocus >{item.label}</Radio>
  
            </Radio.Group>
            )
          })} */}
        </div>
      </Modal>

      {/* 部署到 master */}
      <Modal
        key="deployMaster"
        title="选择发布环境"
        visible={deployMasterVisible}
        confirmLoading={confirmLoading}
        onOk={confirmPublishToMaster}
        maskClosable={false}
        onCancel={cancelDeployToMaster}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployMasterEnv} onChange={(v: any) => setDeployMasterEnv(v)} options={envDataList} />
        </div>
      </Modal>

      {/* 离线部署 */}
      <Modal
        key="deployOffline"
        title="选择部署环境"
        visible={deployVisible}
        footer={null}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group
            value={deployEnv}
            onChange={(v: any) => {
              onOperate('uploadImageStart');
              setDeployEnv(v);
            }}
            options={envDataList || []}
          />
        </div>

        <div style={{ display: 'flex', marginTop: '12px' }} key={Math.random()}>
          <span>配置文件：</span>
          <Upload {...uploadProps} accept=".tgz">
            <Button icon={<UploadOutlined />} type="primary" ghost disabled={!deployEnv?.length}>
              离线部署
            </Button>
          </Upload>
        </div>
      </Modal>

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
      <MergeConflict visible={mergeVisible} handleCancel={handleCancelMerge}></MergeConflict>
    </div>
  );
}
