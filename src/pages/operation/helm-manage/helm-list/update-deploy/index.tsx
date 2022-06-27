// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Button, Table, Space, Tag, Descriptions } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';

export interface Item {
  id: number;
  versionName: string;
  versionDescription: string;
  releaseTime: number;
  gmtCreate: any;
  releaseStatus: number;
}
type releaseStatus = {
  text: string;
  type: any;
  disabled: boolean;
};

export default function deliveryDescription() {
  useEffect(() => {
    // queryProductVersionList(descriptionInfoData.id);
  }, []);

  return (
    <PageContainer className="product-description">
      <ContentCard>
        <h3>metrics-sever</h3>
        <AceEditor mode="yaml" height={'70%'} value={''} />
        <div className="create-card-footer">
          <Space>
            <Button onClick={() => {}}>确定</Button>
            <Button>取消</Button>
          </Space>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
