// rollback modal
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/09 16:22

import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Form, Modal, Radio, message, Empty } from 'antd';
import DetailContext from '../../../../../context';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';
import * as APIS from '../../services';

export interface RollbackModalProps {
  visible?: boolean;
  deployInfo: any;
  onClose?: () => any;
  onSave?: () => any;
}

export default function RollbackModal(props: RollbackModalProps) {
  const { appData } = useContext(DetailContext);
  const [rollbackVersions, setRollbackVersions] = useState<any[]>([]);
  const [field] = Form.useForm();

  const queryRollbackVersions = useCallback(async (envCode: string) => {
    const result = await getRequest(APIS.queryHistoryVersions, {
      data: {
        deploymentName: appData?.deploymentName,
        envCode, // TODO 使用 appManage/env/list 接口获取 ? { categoryCode, envTypeCode }
      },
    });

    const { historyVersions: nextList } = result.data || {};

    if (!nextList?.length) {
      return message.warning('没有可回滚的版本！');
    }

    setRollbackVersions(nextList);
  }, []);

  // 环境可选项
  const envSource = useMemo(() => {
    const envString = props.deployInfo?.deployedEnvs;
    const envs: string[] = envString ? envString.split(/,\s?/) || [] : [];

    return envs.map((env) => ({
      label: env,
      value: env,
      key: env,
    }));
  }, [props.deployInfo]);

  useEffect(() => {
    if (!props.visible) {
      setRollbackVersions([]);
      field.resetFields();
      return;
    }

    // 初始化数据
    if (props.deployInfo?.deployedEnvs || 1) {
      const defaultEnvCode = envSource[0]?.value;
      field.setFieldsValue({ envCode: defaultEnvCode });
      queryRollbackVersions(defaultEnvCode);
    }
  }, [props.visible]);

  // 确认回滚
  const handleRollbackSubmit = useCallback(async () => {
    const { envCode, version } = await field.validateFields();
    console.log('>> handleRollbackSubmit', envCode, version);
    const versionItem = rollbackVersions.find((n) => n.packageVersionId === version);

    await postRequest(APIS.rollbackApplication, {
      data: {
        deploymentName: appData?.deploymentName,
        envCode: envCode,
        appId: versionItem.appId,
        packageVersion: versionItem.packageVersion,
        packageVersionId: versionItem.packageVersionId,
        owner: appData?.owner,
      },
    });

    message.success('应用回滚完成！');
    setRollbackVersions([]);

    props.onSave?.();
  }, [rollbackVersions]);

  if (!envSource.length) {
    return (
      <Modal
        title="发布回滚"
        visible={props.visible}
        footer={false}
        maskClosable={false}
        onCancel={props.onClose}
        width={640}
      >
        <Empty description="没有可回滚的环境和版本" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Modal>
    );
  }

  return (
    <Modal
      title="发布回滚"
      visible={props.visible}
      maskClosable={false}
      onCancel={props.onClose}
      okText="回滚"
      onOk={handleRollbackSubmit}
      width={640}
    >
      <Form form={field} labelCol={{ flex: '100px' }}>
        <Form.Item label="选择环境" name="envCode" rules={[{ required: true, message: '请选择环境' }]}>
          <Radio.Group options={envSource} onChange={(e) => queryRollbackVersions(e.target.value)} />
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
