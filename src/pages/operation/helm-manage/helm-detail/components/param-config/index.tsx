// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Form } from 'antd';
import AceEditor from '@/components/ace-editor';
import { getReleaseValues } from '../../../helm-list/hook';

export interface PorpsItem {
  record: any;
  curClusterName: string;
}
type releaseStatus = {
  text: string;
  type: any;
  disabled: boolean;
};

export default function deliveryDescription(props: PorpsItem) {
  const { record, curClusterName } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    getReleaseValues({
      releaseName: record?.releaseName,
      namespace: record?.namespace,
      clusterName: curClusterName,
    }).then((res) => {
      form.setFieldsValue({ values: res });
    });
  }, []);

  return (
    <div>
      <Form form={form}>
        <Form.Item name="values">
          <AceEditor mode="yaml" height={500} readOnly />
        </Form.Item>
      </Form>
    </div>
  );
}
