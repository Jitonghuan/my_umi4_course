// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Typography, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import DetailContext from '../../../../../context';
import { cancelDeploy, deployMaster, offlineDeploy, restartApp } from '@/pages/application/service';
import { IProps } from './types';
import './index.less';

const rootCls = 'publish-detail-compo';
const { Paragraph } = Typography;

export default function PublishDetail(props: IProps) {
  let { deployInfo, envTypeCode, onOperate } = props;
  const { appData, projectEnvCode, projectEnvName } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<string[]>();
  const [restartEnv, setRestartEnv] = useState<string[]>([]); //重启时获取到的环境值
  const [deployMasterEnv, setDeployMasterEnv] = useState<string[]>();
  const [envDataList, setEnvDataList] = useState<IOption[]>([]);
  const [deployVisible, setDeployVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  let newNextEnvTypeCode = '';
  useEffect(() => {
    if (!appCategoryCode) return;
    if (!envTypeCode) return;
  }, [appCategoryCode, envTypeCode, deployInfo.id]);

  // 取消发布
  const handleCancelPublish = () => {
    onOperate('cancelDeployStart');

    Modal.confirm({
      title: '确定要取消当前发布吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return cancelDeploy({
          id: deployInfo.id,
          envCode: '',
        }).then(() => {
          onOperate('cancelDeployEnd');
        });
      },
      onCancel() {
        onOperate('cancelDeployEnd');
      },
    });
  };

  // 部署 master
  const deployToMaster = () => {
    onOperate('deployMasterStart');
    confirmPublishToMaster();
  };
  // 放弃部署 master
  const cancelDeployToMaster = () => {
    onOperate('deployMasterEnd');
    setConfirmLoading(false);
  };
  // 确认发布操master作
  const confirmPublishToMaster = async () => {
    setConfirmLoading(true);
    try {
      await deployMaster({
        appCode: appData?.appCode,
        envTypeCode: envTypeCode,
        envCodes: [envTypeCode],
        isClient: appData?.isClient === 1,
      });
      message.success('操作成功，正在部署中...');
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

  let deployErrInfo: any[] = [];
  try {
    deployErrInfo = deployInfo.deployErrInfo ? JSON.parse(deployInfo.deployErrInfo) : [];
  } catch (e) {
    if (deployInfo.deployErrInfo) {
      deployErrInfo = [
        {
          subErrInfo: deployInfo.deployErrInfo,
          envCode: deployInfo.envs,
        },
      ];
    }
  }

  function goToJenkins(item: any) {
    let jenkinsUrl: any[] = [];
    try {
      jenkinsUrl = deployInfo.jenkinsUrl ? JSON.parse(deployInfo.jenkinsUrl) : [];
    } catch (e) {
      if (deployInfo.jenkinsUrl) {
        jenkinsUrl = [
          {
            subJenkinsUrl: deployInfo.jenkinsUrl,
            envCode: deployInfo.envs,
          },
        ];
      }
    }
    const data = jenkinsUrl.find((val) => val.envCode === item.envCode);
    if (data && data.subJenkinsUrl) {
      window.open(data.subJenkinsUrl, '_blank');
    }
  }

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {/* {appData?.appType === 'backend' && envTypeCode === 'prod' && deployEnv?.indexOf('tt-his') !== -1 && (
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启应用
          </Button>
        )} */}
        {appData?.appType === 'backend' && (
          <Popconfirm
            title="确定要部署Master吗？"
            onConfirm={() => {
              deployToMaster();
            }}
            onCancel={() => {
              cancelDeployToMaster();
            }}
          >
            <Button type="primary" loading={confirmLoading}>
              部署Master
            </Button>
          </Popconfirm>
        )}
        {/* {appData?.appType === 'backend' && (
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
          {deployInfo?.id || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="部署分支" span={appData?.appType === 'frontend' ? 1 : 2}>
          {deployInfo?.releaseBranch ? <Paragraph copyable>{deployInfo?.releaseBranch}</Paragraph> : '---'}
        </Descriptions.Item>
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="部署版本" contentStyle={{ whiteSpace: 'nowrap' }}>
            {deployInfo?.releaseBranch ? <Paragraph copyable>{deployInfo?.releaseBranch}</Paragraph> : '---'}
            {/* <Paragraph copyable>{deployInfo?.version || '--'}</Paragraph> */}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="发布环境">{envTypeCode || '--'}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={4}>
          {deployInfo?.conflictFeature || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={4}>
          {deployInfo?.features || '--'}
        </Descriptions.Item>
        {deployInfo?.deployErrInfo && deployErrInfo.length && (
          <Descriptions.Item label="部署错误信息" span={4} contentStyle={{ color: 'red' }}>
            <div>
              {deployErrInfo.map((errInfo) => (
                <div>
                  <span style={{ color: 'black' }}> {errInfo?.subErrInfo ? `${errInfo?.envCode}：` : ''}</span>
                  <a
                    style={{ color: 'red', textDecoration: 'underline' }}
                    onClick={() => {
                      if (errInfo?.subErrInfo.indexOf('请查看jenkins详情') !== -1) {
                        goToJenkins(errInfo);
                      }
                      if (errInfo?.subErrInfo.indexOf('请查看jenkins详情') === -1 && appData?.appType !== 'frontend') {
                        history.push(
                          `/matrix/application/environment-deploy/deployInfo?appCode=${deployInfo?.appCode}&id=${appData?.id}&projectEnvCode=${projectEnvCode}&projectEnvName=${projectEnvName}`,
                        );
                      }
                    }}
                  >
                    {errInfo?.subErrInfo}
                  </a>
                  {appData?.appType !== 'frontend' && (
                    <span style={{ color: 'gray' }}> {errInfo?.subErrInfo ? '（点击跳转）' : ''}</span>
                  )}
                </div>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* --------------------- modals --------------------- */}
      {/* 重启按钮 */}
      {/* <Modal
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
      </Modal> */}
    </div>
  );
}
