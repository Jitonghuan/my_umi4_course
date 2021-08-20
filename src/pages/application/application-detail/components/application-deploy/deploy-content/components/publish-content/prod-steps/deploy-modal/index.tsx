/**
 * DeployModal
 * @description 部署-弹窗
 * @author moting.nq
 * @create 2021-04-24 11:46
 */

import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Steps, Button, Modal, Radio, Spin, message } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import { confirmProdDeploy, queryEnvsReq } from '@/pages/application/service';
import { IProps } from './types';

const DeployModal = ({ envTypeCode, visible, deployInfo, onCancel, onOperate }: IProps) => {
  const { deployStatus, deployedEnvs, deployingEnv, deployingHosBatch, jenkinsUrl } = deployInfo || {};
  const { appData } = useContext(DetailContext);
  const { appCategoryCode } = appData || {};

  const [deployConfig, setDeployConfig] = useState({
    deployEnv: deployingEnv,
    deployBatch: 12,
  });
  const [envDataList, setEnvDataList] = useState([]);

  useEffect(() => {
    if (!['deploying', 'deployWaitBatch2'].includes(deployStatus)) return;

    if (deployingEnv && deployingEnv !== deployConfig.deployEnv) {
      console.log('>> reset deployEnv: ', deployingEnv);

      setDeployConfig({
        deployEnv: deployingEnv,
        deployBatch: deployConfig.deployBatch,
      });
    }
  }, [deployingEnv]);

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      categoryCode: appCategoryCode as string,
      envTypeCode,
    }).then((data) => {
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, envTypeCode]);

  const envList = useMemo(() => {
    const { envs } = deployInfo;
    const namesArr: any[] = [];
    if (envs?.indexOf(',') > -1) {
      const list = envs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            namesArr.push({
              envName: item.envName,
              envCode: v,
            });
          }
        });
      });
      return namesArr;
    }
    return (envDataList as any[]).filter((v: any) => v.envCode === envs);
  }, [envDataList, deployInfo]);

  const deployedEnvList = useMemo(() => {
    const { deployedEnvs } = deployInfo;
    const resultList: any[] = [];
    if (deployedEnvs?.indexOf(',') > -1) {
      const list = deployedEnvs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            resultList.push({
              envName: item.envName,
              envCode: v,
            });
          }
        });
      });
      return resultList;
    }
    return (envDataList as any[]).filter((v: any) => v.envCode === deployedEnvs);
  }, [envDataList, deployInfo]);

  const detail = useMemo(() => {
    // TODO 如何判断哪个机构被部署了
    let text1 = null;
    let text2 = null;
    if (deployStatus !== 'deploying' && deployStatus !== 'deployWaitBatch2') {
      return null;
    }

    if (deployStatus === 'deploying') {
      text1 = (
        <span>
          {envList.find((v) => v.envCode === deployingEnv)?.envName}
          正在部署中...
        </span>
      );

      if (deployingHosBatch === 2) {
        text2 = <span>第一批已部署完成，正在部署第二批...</span>;
      }
    } else if (deployStatus === 'deployWaitBatch2') {
      text1 = (
        <span>
          {envList.find((v) => v.envCode === deployingEnv)?.envName}
          正在部署中...
        </span>
      );
      text2 = <span>第一批已部署完成，点击继续按钮发布第二批</span>;
    }

    return (
      <>
        <div>
          <Spin spinning />
          {text1}
          {text2}
        </div>
        {jenkinsUrl && (
          <div>
            <a target="_blank" href={jenkinsUrl}>
              查看Jenkins详情
            </a>
          </div>
        )}
      </>
    );
  }, [deployInfo]);

  return (
    <Modal
      title="批量部署"
      visible={visible}
      confirmLoading={deployStatus === 'deploying'}
      okText={deployStatus === 'deployWaitBatch2' ? '继续' : '确定'}
      onOk={() => {
        let batch: 0 | 1 | 2 = deployConfig.deployBatch === 12 ? 1 : 0;

        if (deployStatus === 'deployWaitBatch2') {
          batch = 2;
        } else if (deployStatus === 'deployWait') {
          batch = 1;
        } else {
          onCancel?.();
          return;
        }

        confirmProdDeploy({
          id: deployInfo.id,
          hospital: deployConfig.deployEnv,
          batch,
        })
          .then((res) => {
            if (!res.success) {
              message.error(res.errorMsg);
            }
          })
          .finally(() => onOperate('deployEnd'));
      }}
      onCancel={onCancel}
    >
      <div>
        <span>发布环境：</span>
        {/* 根据 envs 拿到列表 */}
        <Radio.Group
          disabled={['deploying', 'deployWaitBatch2'].includes(deployStatus)}
          value={deployConfig.deployEnv}
          onChange={(v) => setDeployConfig({ ...deployConfig, deployEnv: v.target.value })}
          options={envList?.map((v: any) => ({
            label: v.envName,
            value: v.envCode,
          }))}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <span>发布批次：</span>
        <Radio.Group
          disabled={deployStatus !== 'deployWait'}
          value={deployConfig.deployBatch}
          onChange={(v) => setDeployConfig({ ...deployConfig, deployBatch: v.target.value })}
          options={[
            { label: '分批', value: 12 },
            { label: '不分批', value: 0 },
          ]}
        />
      </div>
      <h3 style={{ marginTop: 20 }}>发布详情</h3>
      {deployedEnvs &&
        deployedEnvList.map((item: any) => {
          return <div>{item.envName}已经部署完成</div>;
        })}
      {detail}
    </Modal>
  );
};

DeployModal.defaultProps = {};

export default DeployModal;
