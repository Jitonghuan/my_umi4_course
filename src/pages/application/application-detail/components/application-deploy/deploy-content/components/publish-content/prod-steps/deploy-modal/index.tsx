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

const DeployModal = ({ visible, deployInfo, onCancel, onOperate }: IProps) => {
  const { deployingHospital, jenkinsUrl, deployingHosBatch } = deployInfo;

  const [deployConfig, setDeployConfig] = useState({
    deployEnv: '',
    deployBatch: undefined,
  });

  // TODO 发布详情
  const detail = useMemo(() => {
    return (
      <>
        <div>
          <Spin spinning />
          <span>{deployingHospital}正在部署中。。。</span>
          <span>第一批已部署完成，点击继续按钮发布第二批</span>
        </div>
        <div>
          <a target="_blank" href={jenkinsUrl}>
            查看Jenkins详情
          </a>
        </div>
      </>
    );
  }, [deployInfo]);

  // TODO
  const okBtnDisabled = false;
  const confirmLoading = false;

  return (
    <Modal
      title="批量部署"
      visible={visible}
      confirmLoading={confirmLoading}
      // TODO
      okText={true ? '确定' : '继续'}
      okButtonProps={{
        disabled: okBtnDisabled,
      }}
      onOk={() => {
        // TODO
        const batch = deployConfig.deployBatch === 12 ? 1 : 0;

        confirmProdDeploy({
          id: deployInfo.id,
          hospital: deployConfig.deployEnv,
          batch,
        })
          .then((res) => {
            if (res.success) {
              // TODO
              return;
            }
            message.error(res.errorMsg);
          })
          .finally(() => onOperate('retryDeployEnd'));
      }}
      onCancel={onCancel}
    >
      <div>
        <span>发布环境：</span>
        {/* TODO 数据哪里来 */}
        <Radio.Group
          value={deployConfig.deployEnv}
          onChange={(v) =>
            setDeployConfig({ ...deployConfig, deployEnv: v.target.value })
          }
          options={[
            { label: '天台', value: 'tian' },
            { label: '巍山', value: 'weishan' },
          ]}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <span>发布批次：</span>
        {/* TODO 数据哪里来 */}
        <Radio.Group
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
