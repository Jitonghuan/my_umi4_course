/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */

import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { Descriptions, Button, Modal, message, Checkbox, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DetailContext from '../../../../../context';
import { cancelDeploy, deployReuse, deployMaster, queryEnvsReq } from '../../../../../../service';
import { IProps } from './types';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../../services';
import './index.less';

const rootCls = 'publish-detail-compo';
const { confirm } = Modal;

const PublishDetail = ({ deployInfo, envTypeCode, nextEnvTypeCode, onOperate }: IProps) => {
  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};
  const [deployNextEnvVisible, setDeployNextEnvVisible] = useState(false);
  const [deployMasterVisible, setDeployMasterVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deployEnv, setDeployEnv] = useState<any[]>();
  const [envDataList, setEnvDataList] = useState([]);
  const [nextEnvDataList, setNextEnvDataList] = useState([]);

  // 可选择的回滚版本
  const [rollbackVersions, setRollbackVersions] = useState<any[]>([]);
  const [rollbackVersion, setRollbackVersion] = useState<string>();

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

  const handleShowRollback = useCallback(async () => {
    // const result = await getRequest(APIS.queryHistoryVersions, {
    //   data: {
    //     deploymentName: appData?.deploymentName,
    //     envCode: deployInfo.envs,
    //   },
    // });

    // const { HistoryVersions: nextList } = result.data || {};

    // if (!nextList?.length) {
    //   return message.warning('没有可回滚的版本！');
    // }
    // setRollbackVersions(nextList);

    setRollbackVersions([
      {
        AppId: '55576fe3-99c4-4b4f-b7aa-83b69ba20786',
        DeployTime: '2021-08-02 16:47:53',
        PackageVersion: '1.3',
        PackageVersionId: '5c026c10-1d3b-491b-a4a7-80c9ccc60e7f',
      },
      {
        AppId: '55576fe3-99c4-4b4f-b7aa-83b69ba20786',
        DeployTime: '2021-08-02 10:34:33',
        PackageVersion: '1.2',
        PackageVersionId: '0ec00674-fbd8-4bab-ba06-4396a991b5bf',
      },
      {
        AppId: '55576fe3-99c4-4b4f-b7aa-83b69ba20786',
        DeployTime: '2021-08-02 10:26:04',
        PackageVersion: '1.1',
        PackageVersionId: '8f73cfc5-3876-4c6b-9211-2dfe6c832923',
      },
      {
        AppId: '55576fe3-99c4-4b4f-b7aa-83b69ba20786',
        DeployTime: '2021-08-02 10:20:22',
        PackageVersion: '20210802.101858',
        PackageVersionId: 'c8d39906-534e-4b67-bf9c-d5e618d0407f',
      },
    ]);
    setRollbackVersion(undefined);
  }, []);
  // 确认回滚
  const handleRollbackSubmit = useCallback(async () => {
    console.log('>> handleRollbackSubmit', rollbackVersion);
    if (!rollbackVersion) {
      return message.warning('请选择版本');
    }

    const versionItem = rollbackVersions.find((n) => n.PackageVersionId === rollbackVersion);

    await postRequest(APIS.rollbackApplication, {
      data: {
        deploymentName: appData?.deploymentName,
        envCode: deployInfo.envs,
        // envCode: 'tt-prd',
        appId: appData?.id,
        packageVersion: versionItem.packageVersion,
        PackageVersionId: versionItem.PackageVersionId,
      },
    });

    message.success('应用回滚完成！');
    setRollbackVersions([]);

    onOperate('rollbackVersion');
  }, [rollbackVersions, rollbackVersion]);

  return (
    <div className={rootCls}>
      <div className={`${rootCls}__right-top-btns`}>
        {envTypeCode === 'prod' ? (
          <Button type="default" danger onClick={handleShowRollback}>
            发布回滚
          </Button>
        ) : null}
        {envTypeCode !== 'prod' && (
          <Button
            type="primary"
            onClick={() => {
              onOperate('deployMasterStart');
              setDeployMasterVisible(true);
              return;
            }}
          >
            部署Master
          </Button>
        )}

        {envTypeCode !== 'prod' && (
          <Button
            type="primary"
            onClick={() => {
              onOperate('deployNextEnvStart');
              setDeployNextEnvVisible(true);
              return;
            }}
          >
            部署到下个环境
          </Button>
        )}

        <Button
          type="primary"
          danger
          onClick={() => {
            onOperate('cancelDeployStart');

            confirm({
              title: '确定要取消当前发布吗？',
              icon: <ExclamationCircleOutlined />,
              onOk() {
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
          }}
        >
          取消发布
        </Button>
      </div>

      <Descriptions
        title="发布详情"
        labelStyle={{ color: '#5F677A', textAlign: 'right' }}
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
        {envTypeCode === 'prod' ? (
          <Descriptions.Item label="应用状态" span={3} className="app-status-detail">
            <p>
              <span>服务器IP：192.168.52.202</span>
              <span>运行状态：正常</span>
              <span>变更状态：正常</span>
            </p>
            <p>
              <span>服务器IP：192.168.52.202</span>
              <span>运行状态：正常</span>
              <span>变更状态：正常</span>
            </p>
            <p>
              <span>服务器IP：192.168.52.202</span>
              <span>运行状态：正常</span>
              <span>变更状态：正常</span>
            </p>
            <p>
              <span>服务器IP：192.168.52.202</span>
              <span>运行状态：正常</span>
              <span>变更状态：正常</span>
            </p>
            <p className="status-add">+ 新增</p>
          </Descriptions.Item>
        ) : null}
      </Descriptions>

      <Modal
        title="选择发布环境"
        visible={deployNextEnvVisible || deployMasterVisible}
        confirmLoading={confirmLoading}
        onOk={() => {
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
        }}
        onCancel={() => {
          setDeployMasterVisible(false);
          setDeployNextEnvVisible(false);
          setConfirmLoading(false);
          onOperate('deployNextEnvEnd');
        }}
      >
        <div>
          <span>发布环境：</span>
          <Checkbox.Group value={deployEnv} onChange={(v) => setDeployEnv(v)} options={getDeployEnvData()} />
        </div>
      </Modal>

      <Modal
        title="发布回滚"
        visible={!!rollbackVersions?.length}
        maskClosable={false}
        onCancel={() => setRollbackVersions([])}
        okText="回滚"
        onOk={handleRollbackSubmit}
        width={600}
      >
        <h3>请选择要回滚的版本</h3>
        <Radio.Group
          style={{ width: '100%' }}
          value={rollbackVersion}
          onChange={(e) => setRollbackVersion(e.target.value)}
        >
          {rollbackVersions.map((item: any, index) => (
            <Radio key={index} value={item.PackageVersionId} className="flex-radio-wrap">
              <span>版本号：{item.PackageVersion}</span>
              <span>部署时间：{item.DeployTime || '--'}</span>
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
};

PublishDetail.defaultProps = {};

export default PublishDetail;
