// rollback modal
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/09 16:22

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Modal, Radio, message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import DetailContext from '../../../../context';
import * as APIS from '@/pages/application/service';
import './index.less';

export interface RollbackModalProps {
  visible?: boolean;
  envCode?: string;
  onClose?: () => any;
  onSave?: () => any;
  intervalStop?: () => void;
  intervalStart?: () => void;
}

export default function RollbackModal(props: RollbackModalProps) {
  const { appData } = useContext(DetailContext);
  const [rollbackVersions, setRollbackVersions] = useState<any[]>([]);
  const [pending, setPending] = useState(false);
  const [field] = Form.useForm();

  const queryRollbackVersions = useCallback(async () => {
    const result = await getRequest(APIS.queryHistoryVersions, {
      data: {
        appCode: appData?.appCode,
        envCode: props.envCode,
      },
    });

    if (result?.data?.historyVersions && result.data.historyVersions.length) {
      setRollbackVersions(result.data.historyVersions);
      return;
    }

    if (result?.data && result.data.length) {
      setRollbackVersions(result.data);
      return;
    }

    setRollbackVersions([]);
  }, [appData, props.envCode]);

  useEffect(() => {
    if (!props.visible) {
      setRollbackVersions([]);
      field.resetFields();
      return;
    }

    if (props.envCode) {
      queryRollbackVersions();
    }
  }, [props.visible]);

  // 确认回滚
  const handleRollbackSubmit = useCallback(async () => {
    const { version } = await field.validateFields();
    const versionItem = rollbackVersions.find((n) => n?.packageVersionId === version || n.image === version);
    setPending(true);
    try {
      await postRequest(APIS.rollbackApplication, {
        data: {
          appCode: appData?.appCode,
          envCode: props.envCode,
          image: versionItem?.image,
          appId: versionItem?.appId,
          packageVersion: versionItem?.packageVersion,
          packageVersionId: versionItem?.packageVersionId,
          owner: appData?.owner,
        },
      }).then((res) => {
        if (res.success) {
          message.success('操作成功，正在回滚...');
          setRollbackVersions([]);
          props.onSave?.();
        }
      });
    } finally {
      setPending(false);
    }
  }, [rollbackVersions]);

  return (
    <Modal
      title="发布回滚"
      visible={props.visible}
      maskClosable={false}
      onCancel={props.onClose}
      okText="回滚"
      confirmLoading={pending}
      okButtonProps={{ disabled: !rollbackVersions.length }}
      onOk={handleRollbackSubmit}
      width={'60%'}
    >
      <Form form={field} labelCol={{ flex: '70px' }}>
        <Form.Item label="环境Code">
          <span className="ant-form-text">{props.envCode}</span>
        </Form.Item>
        <Form.Item label="回滚版本" name="version" rules={[{ required: true, message: '请选择版本' }]}>
          <Radio.Group style={{ width: '100%' }}>
            {rollbackVersions?.reverse()?.map((item: any, index) => (
              <Radio
                key={index}
                disabled={item?.isDeployImage === 1 ? true : false}
                value={item.packageVersionId || item.image}
                className="flex-radio-wrap"
              >
                {/* 版本号： */}
                {item?.hasOwnProperty('packageVersionId') ? (
                  <div>
                    <div>版本号：{item.packageVersion}</div>
                    <div>部署时间：{item.deployTime || '--'}</div>
                  </div>
                ) : null}
                {/* 镜像 */}
                {item?.hasOwnProperty('image') ? (
                  <div>
                    <div>镜像:{item.image}</div>
                    <div>部署时间：{item.deployedTime || '--'}</div>
                  </div>
                ) : null}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
