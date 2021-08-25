// page 404
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/01 14:54

import React from 'react';
import { Result } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';

export default function Page404() {
  return (
    <PageContainer>
      <ContentCard>
        <Result status="404" title="404" subTitle="啊！页面去火星了~" />
      </ContentCard>
    </PageContainer>
  );
}
