// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Upload } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import {
  cancelDeploy,
  deployReuse,
  deployMaster,
  queryEnvsReq,
  offlineDeploy,
  restartApp,
} from '@/pages/application/service';
import { UploadOutlined } from '@ant-design/icons';
import { IProps } from './types';
import RollbackModal from '../rollback-modal';
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
  const [deployEnv, setDeployEnv] = useState<string[]>();
  const [deployMasterEnv, setDeployMasterEnv] = useState<string[]>();
  const [deployNextEnv, setDeployNextEnv] = useState<string[]>();
  const [envDataList, setEnvDataList] = useState([]);
  const [nextEnvDataList, setNextEnvDataList] = useState([]);
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const [deployVisible, setDeployVisible] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);

  useEffect(() => {
    if (!appCategoryCode) return;

    // 当前部署环境
    queryEnvsReq({
      categoryCode: appCategoryCode,
      envTypeCode: envTypeCode,
    }).then((data) => {
      setEnvDataList(data.list);
    });

    // 下一个部署环境
    const nextEnvTypeCode = nextEnvTypeCodeMapping[envTypeCode];
    queryEnvsReq({
      categoryCode: appCategoryCode,
      envTypeCode: nextEnvTypeCode,
    }).then((data) => {
      setNextEnvDataList(data.list);
    });
  }, [appCategoryCode, envTypeCode]);

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
  const envNames = useMemo(() => {
    const { envs } = deployInfo;
    const namesArr: any[] = [];
    if (envs?.indexOf(',') > -1) {
      const list = envs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            namesArr.push(item.envName);
          }
        });
      });
      return namesArr.join(',');
    }
    return (envDataList as any).find((v: any) => v.envCode === envs)?.envName;
  }, [envDataList, deployInfo]);

  // 离线部署
  const uploadImages = () => {
    return `${offlineDeploy}?appCode=${appData?.appCode}&envTypeCode=${props.envTypeCode}&envs=${deployEnv}&isClient=${appData?.isClient}`;
  };

  // 上传按钮
  const uploadProps = {
    name: 'image',
    action: uploadImages,
    headers: {},
    onChange: (info: any) => {
      if (info.file.status !== 'uploading') {
        setConfirmLoading(true);
      }
      if (info.file.status === 'done' && info.file.response?.success == 'true') {
        message.success(`${info.file.name} 文件上传成功`);
      } else {
        message.error(info.file.response?.errorMsg || '上传失败');
      }

      setDeployVisible(false);
      setConfirmLoading(false);
    },
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
          envCode: deployInfo.envs,
          appCategoryCode: appData?.appCategoryCode,
        })
          .then((resp) => {
            if (resp.success) {
              message.success('操作成功！');
            }
          })
          .finally(() => {
            setRestartVisible(false);
          });
      },
      onCancel() {},
    });
  };

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {envTypeCode === 'prod' && (
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启
          </Button>
        )}
        {envTypeCode === 'prod' && (
          <Button type="primary" onClick={() => setDeployVisible(true)} icon={<UploadOutlined />}>
            离线部署
          </Button>
        )}

        {envTypeCode === 'prod' ? (
          <Button type="default" disabled={!deployInfo.deployedEnvs} danger onClick={() => setRollbackVisible(true)}>
            发布回滚
          </Button>
        ) : null}
        {envTypeCode !== 'prod' && (
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
      >
        <Descriptions.Item label="CRID">{deployInfo?.id}</Descriptions.Item>
        <Descriptions.Item label="部署分支">{deployInfo?.releaseBranch}</Descriptions.Item>
        <Descriptions.Item label="发布环境">{envNames}</Descriptions.Item>
        <Descriptions.Item label="冲突分支" span={3}>
          {deployInfo?.conflictFeature}
        </Descriptions.Item>
        <Descriptions.Item label="合并分支" span={3}>
          {deployInfo?.features}
        </Descriptions.Item>
        {deployInfo?.deployErrInfo !== '' && deployInfo.hasOwnProperty('deployErrInfo') && (
          <Descriptions.Item label="部署错误信息" span={3} contentStyle={{ color: 'red' }}>
            {deployInfo?.deployErrInfo}
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
          <Checkbox.Group value={deployNextEnv} onChange={(v: any) => setDeployNextEnv(v)} options={nextEnvDataList} />
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
        onCancel={() => setDeployVisible(false)}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v: any) => setDeployEnv(v)} options={envDataList || []} />
        </div>

        <div style={{ display: 'flex', marginTop: '12px' }}>
          <span>配置文件：</span>
          <Upload {...uploadProps}>
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
        onCancel={() => setRestartVisible(false)}
        onOk={ensureRestart}
        maskClosable={false}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v: any) => setDeployEnv(v)} options={envDataList || []} />
        </div>
      </Modal>

      {/* 回滚版本 */}
      <RollbackModal
        visible={rollbackVisible}
        deployInfo={deployInfo}
        onClose={() => setRollbackVisible(false)}
        onSave={() => {
          onOperate('rollbackVersion');
          setRollbackVisible(false);
        }}
      />
    </div>
  );
}
