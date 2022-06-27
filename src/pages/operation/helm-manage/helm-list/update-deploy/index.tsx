// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Button, Table, Space, Tag, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { ContentCard } from '@/components/vc-page-content';
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
  const { mode, curRecord, curClusterName, onCancle } = props;

  useEffect(() => {
    // queryProductVersionList(descriptionInfoData.id);
  }, []);

  return (
    <Modal visible={mode} width="60%" onOk={() => {}} onCancel={onCancle}>
      <h3 className="update-title">
        更新发布——metrics-sever{curRecord?.releaseName} &nbsp;&nbsp;&nbsp;&nbsp;当前集群：{curClusterName || '--'}
      </h3>
      <AceEditor mode="yaml" height={700} value={''} />
      <div className="create-card-footer"></div>
    </Modal>
  );
}
