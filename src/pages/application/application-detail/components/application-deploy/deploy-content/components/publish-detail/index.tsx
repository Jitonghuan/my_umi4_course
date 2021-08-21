/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '@/pages/application/application-detail/context';
import { cancelDeploy, deployReuse, deployMaster, queryEnvsReq } from '@/pages/application/service';
import { IProps } from './types';
import RollbackModal from '../rollback-modal';
import ServerStatus from '../server-status';
import './index.less';

const rootCls = 'publish-detail-compo';

export default function PublishDetail(props: IProps) {
  let { deployInfo, envTypeCode, nextEnvTypeCode, onOperate, appStatusInfo } = props;

  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};
  const [deployNextEnvVisible, setDeployNextEnvVisible] = useState(false);
  const [deployMasterVisible, setDeployMasterVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [envDataList, setEnvDataList] = useState([]);
  const [nextEnvDataList, setNextEnvDataList] = useState([]);
  const [rollbackVisible, setRollbackVisible] = useState(false);

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: envTypeCode,
    }).then((data) => {
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, envTypeCode]);

  useEffect(() => {
    if (!appCategoryCode) return;
    if (envTypeCode === 'dev') {
      nextEnvTypeCode = 'test';
    } else if (envTypeCode === 'test') {
      nextEnvTypeCode = 'pre';
    } else if (envTypeCode === 'pre') {
      nextEnvTypeCode = 'prod';
    }
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode: nextEnvTypeCode,
    }).then((data) => {
      setNextEnvDataList(data.list);
    });
  }, [appCategoryCode, envTypeCode]);

  function getDeployEnvData(): string[] {
    if (deployNextEnvVisible) {
      return nextEnvDataList;
    } else if (deployMasterVisible) {
      return envDataList;
    }

    return [];
  }

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

  // 部署 master
  const deployToMaster = () => {
    onOperate('deployMasterStart');
    setDeployMasterVisible(true);
  };

  // 部署到下一个环境
  const deployNext = () => {
    onOperate('deployNextEnvStart');
    setDeployNextEnvVisible(true);
  };

  // 确认发布操作
  const handleConfirmPublish = () => {
    setConfirmLoading(true);
    if (deployNextEnvVisible) {
      return deployReuse({ id: deployInfo.id, envs: deployEnv })
        .then((res) => {
          if (res.success) {
            message.success('操作成功，正在部署中...');
            setDeployNextEnvVisible(false);
            onOperate('deployNextEnvSuccess');
          }
        })
        .finally(() => setConfirmLoading(false));
    } else if (deployMasterVisible) {
      return deployMaster({
        appCode: appData?.appCode,
        envTypeCode: envTypeCode,
        envCodes: deployEnv,
        isClient: appData?.isClient === 1,
      })
        .then((res) => {
          if (res.success) {
            setDeployMasterVisible(false);
            onOperate('deployMasterEnd');
            setDeployEnv([]);
          }
        })
        .finally(() => setConfirmLoading(false));
    }
  };

  // 取消(放弃)发布操作
  const handleGiveupPublish = () => {
    setDeployMasterVisible(false);
    setDeployNextEnvVisible(false);
    setConfirmLoading(false);
    onOperate('deployNextEnvEnd');
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

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
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
        {deployInfo?.deployErrInfo !== '' && (
          <Descriptions.Item label="部署错误信息" span={3} contentStyle={{ color: 'red' }}>
            {deployInfo?.deployErrInfo}
          </Descriptions.Item>
        )}
      </Descriptions>
      {envTypeCode === 'prod' && appStatusInfo?.length ? (
        <ServerStatus onOperate={onOperate} appStatusInfo={appStatusInfo} />
      ) : null}

      {/* --------------------- modals --------------------- */}

      <Modal
        title="选择发布环境"
        visible={deployNextEnvVisible || deployMasterVisible}
        confirmLoading={confirmLoading}
        onOk={handleConfirmPublish}
        onCancel={handleGiveupPublish}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v) => setDeployEnv(v)} options={getDeployEnvData()} />
        </div>
      </Modal>

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
