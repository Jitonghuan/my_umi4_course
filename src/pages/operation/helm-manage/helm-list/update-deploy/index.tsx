// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Form, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { useUpgradeRelease, useGetReleaseValues, getReleaseValues } from '../hook';
import './index.less';

export interface ReleaseProps {
  mode: boolean;
  curRecord: any;
  curClusterName: string;
  onCancle: () => void;
  onSave: () => void;
}
type releaseStatus = {
  text: string;
  type: any;
  disabled: boolean;
};

export default function UpdateDeploy(props: ReleaseProps) {
  const { mode, curRecord, curClusterName, onCancle, onSave } = props;
  const [loading, upgradeRelease] = useUpgradeRelease();
  const [form] = Form.useForm();
  // const [updateLoading,values, getReleaseValues]=useGetReleaseValues();
  useEffect(() => {
    if (mode) {
      getReleaseValues({
        releaseName: curRecord?.releaseName,
        namespace: curRecord?.namespace,
        clusterName: curClusterName,
      }).then((res) => {
        form.setFieldsValue({ values: res });
      });
    }
  }, [mode]);
  const update = () => {
    const values = form.getFieldsValue();
    upgradeRelease({
      releaseName: curRecord?.releaseName,
      namespace: curRecord?.namespace,
      values,
      clusterName: curRecord?.clusterName,
    }).then(() => {
      onSave();
    });
  };

  return (
    <Modal visible={mode} width="60%" onOk={update} confirmLoading={loading} onCancel={onCancle}>
      <h3 className="update-title">
        更新发布——<span style={{ color: 'royalblue' }}>{curRecord?.releaseName}</span>{' '}
        &nbsp;&nbsp;&nbsp;&nbsp;当前集群：{curClusterName || '--'}
      </h3>
      <Form form={form}>
        <Form.Item name="values">
          <AceEditor mode="yaml" height={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
