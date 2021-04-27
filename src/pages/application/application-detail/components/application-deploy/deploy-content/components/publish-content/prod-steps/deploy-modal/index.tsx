/**
 * DeployModal
 * @description 部署-弹窗
 * @author moting.nq
 * @create 2021-04-24 11:46
 */

import React, { useMemo, useState } from 'react';
import { Steps, Button, Modal, Radio, Spin, message } from 'antd';
import { confirmProdDeploy } from '../../../../../../../../service';
import { IProps } from './types';
// import './index.less';

const hospitalCodeToText: Record<string, string> = {
  tiantai: '天台',
  weishan: '巍山',
  zheyi: '浙一',
};

const DeployModal = ({ visible, deployInfo, onCancel, onOperate }: IProps) => {
  const {
    deployStatus,
    deployingHospital,
    deployingHosBatch,
    jenkinsUrl,
    hospitals,
  } = deployInfo || {};

  const [deployConfig, setDeployConfig] = useState({
    deployEnv: '',
    deployBatch: 12,
  });

  const detail = useMemo(() => {
    // TODO 如何判断哪个机构被部署了

    if (deployStatus === 'deployWait') {
      return null;
    }

    let text1 = null;
    let text2 = null;

    if (deployStatus === 'deploying') {
      text1 = (
        <span>{hospitalCodeToText[deployingHospital]}正在部署中。。。</span>
      );

      if (deployingHosBatch === 2) {
        text2 = <span>第一批已部署完成，正在部署第二批。。。</span>;
      }
    } else if (deployStatus === 'deployWaitBatch2') {
      text1 = (
        <span>{hospitalCodeToText[deployingHospital]}正在部署中。。。</span>
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
  }, [deployStatus, deployingHospital, deployingHosBatch]);

  return (
    <Modal
      title="批量部署"
      visible={visible}
      confirmLoading={deployStatus === 'deploying'}
      okText={deployStatus === 'deployWait' ? '确定' : '继续'}
      onOk={() => {
        let batch: 0 | 1 | 2 = deployConfig.deployBatch === 12 ? 1 : 0;

        if (deployStatus === 'deployWaitBatch2') {
          batch = 2;
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
        {/* 根据 hospitals 拿到列表 */}
        <Radio.Group
          value={deployConfig.deployEnv}
          onChange={(v) =>
            setDeployConfig({ ...deployConfig, deployEnv: v.target.value })
          }
          options={hospitals?.split(',').map((code: string) => ({
            label: hospitalCodeToText[code],
            value: code,
          }))}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <span>发布批次：</span>
        <Radio.Group
          disabled={deployStatus !== 'deployWait'}
          value={deployConfig.deployBatch}
          onChange={(v) =>
            setDeployConfig({ ...deployConfig, deployBatch: v.target.value })
          }
          options={[
            { label: '分批', value: 12 },
            { label: '不分批', value: 0 },
          ]}
        />
      </div>

      <h3 style={{ marginTop: 20 }}>发布详情</h3>
      {detail}
    </Modal>
  );
};

DeployModal.defaultProps = {};

export default DeployModal;
