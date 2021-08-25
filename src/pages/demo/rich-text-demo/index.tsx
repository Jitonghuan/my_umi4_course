import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import RichText from '@/components/rich-text';

export default function DemoPageTb() {
  const onChange = (val: string) => {
    console.log(val);
  };
  return (
    <PageContainer>
      <ContentCard>
        <RichText onChange={onChange} />
      </ContentCard>
    </PageContainer>
  );
}
