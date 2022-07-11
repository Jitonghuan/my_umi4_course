// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Form, Modal } from 'antd';
import AceEditor from '@/components/ace-editor';
import { getReleaseValues } from '../../../../helm-list/hook';

export interface ReleaseProps {
  mode: boolean;
  curRecord: any;
  curClusterName: string;
  onCancle: () => void;
  onSave: () => void;
}

export default function LogDetail(props: ReleaseProps) {
  const { mode, curRecord, curClusterName, onCancle, onSave } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (mode) {
      getReleaseValues({
        releaseName: curRecord?.releaseName,
        namespace: curRecord?.namespace,
        clusterName: curClusterName,
        revision: curRecord?.revision,
      }).then((res) => {
        form.setFieldsValue({ values: res });
      });
    }
  }, [mode]);

  return (
    <Modal visible={mode} width="60%" onCancel={onCancle} footer={null}>
      <h3 className="update-title">
        更新发布——<span style={{ color: 'royalblue' }}>{curRecord?.releaseName}</span>{' '}
        &nbsp;&nbsp;&nbsp;&nbsp;当前集群：{curClusterName || '--'}
      </h3>
      <Form form={form}>
        <Form.Item name="values">
          <AceEditor mode="yaml" height={500} readOnly />
        </Form.Item>
      </Form>

      <div className="create-card-footer"></div>
    </Modal>
  );
}
