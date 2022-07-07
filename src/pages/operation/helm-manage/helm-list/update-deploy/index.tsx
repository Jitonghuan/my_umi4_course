// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect, useState } from 'react';
import { Form, Modal, Select, Divider } from 'antd';
import AceEditor from '@/components/ace-editor';
import { useUpgradeRelease, queryChartVersions, getReleaseValues } from '../hook';
import './index.less';

export interface ReleaseProps {
  mode: boolean;
  curRecord: any;
  curClusterName: string;
  onCancle: () => void;
  onSave: () => void;
}

export default function UpdateDeploy(props: ReleaseProps) {
  const { mode, curRecord, curClusterName, onCancle, onSave } = props;
  const [loading, upgradeRelease] = useUpgradeRelease();
  const [form] = Form.useForm();
  const [chartLinkOptions, setChartLinkOptions] = useState<any>([]);
  useEffect(() => {
    if (mode) {
      getReleaseValues({
        releaseName: curRecord?.releaseName,
        namespace: curRecord?.namespace,
        clusterName: curClusterName,
      }).then((res) => {
        form.setFieldsValue({ values: res });
      });
      queryChartVersions({ clusterName: curClusterName, chartName: curRecord?.chartName }).then((res) => {
        setChartLinkOptions(res);
      });
    }
    return () => {
      form.resetFields();
    };
  }, [mode]);
  const update = async () => {
    const values = await form.validateFields();
    upgradeRelease({
      releaseName: curRecord?.releaseName,
      namespace: curRecord?.namespace,
      ...values,
      clusterName: curClusterName,
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
      <Divider />

      <Form form={form}>
        <Form.Item label="chart版本" name="chartLink" rules={[{ required: true, message: '请选择' }]}>
          <Select options={chartLinkOptions} showSearch allowClear style={{ width: 400 }} />
        </Form.Item>
        <Form.Item name="values">
          <AceEditor mode="yaml" height={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
