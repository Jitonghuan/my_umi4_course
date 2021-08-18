// rollback modal
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/09 16:22

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Modal, Radio, message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import DetailContext from '../../../../context';
import * as APIS from '../../services';
import './index.less';

export interface RollbackModalProps {
  visible?: boolean;
  envCode?: string;
  onClose?: () => any;
  onSave?: () => any;
}

export default function RollbackModal(props: RollbackModalProps) {
  const { appData } = useContext(DetailContext);
  const [rollbackVersions, setRollbackVersions] = useState<any[]>([]);
  const [pending, setPending] = useState(false);
  const [field] = Form.useForm();

  const queryRollbackVersions = useCallback(async () => {
    const result = await getRequest(APIS.queryHistoryVersions, {
      data: {
        deploymentName: appData?.deploymentName,
        envCode: props.envCode,
      },
    });

    const { historyVersions: nextList } = result.data || {};

    if (!nextList?.length) {
      return message.warning('没有可回滚的版本！');
    }

    setRollbackVersions(nextList);
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
    console.log('>> handleRollbackSubmit', version);
    const versionItem = rollbackVersions.find((n) => n.packageVersionId === version);

    setPending(true);
    try {
      await postRequest(APIS.rollbackApplication, {
        data: {
          deploymentName: appData?.deploymentName,
          envCode: props.envCode,
          appId: versionItem.appId,
          packageVersion: versionItem.packageVersion,
          packageVersionId: versionItem.packageVersionId,
          owner: appData?.owner,
        },
      });

      message.success('应用回滚完成！');
      setRollbackVersions([]);

      props.onSave?.();
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
      onOk={handleRollbackSubmit}
      width={640}
    >
      <Form form={field} labelCol={{ flex: '100px' }}>
        <Form.Item label="环境Code">
          <span className="ant-form-text">{props.envCode}</span>
        </Form.Item>
        <Form.Item label="回滚版本" name="version" rules={[{ required: true, message: '请选择版本' }]}>
          <Radio.Group style={{ width: '100%' }}>
            {rollbackVersions.map((item: any, index) => (
              <Radio key={index} value={item.packageVersionId} className="flex-radio-wrap">
                <span>版本号：{item.packageVersion}</span>
                <span>部署时间：{item.deployTime || '--'}</span>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
