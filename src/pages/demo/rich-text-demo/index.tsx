import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import RichText from '@/components/rich-text';

export default function DemoPageTb() {
  const onChange = (val: string) => {
    console.log(val);
  };
  return (
    <MatrixPageContent>
      <ContentCard>
        <RichText onChange={onChange} />
      </ContentCard>
    </MatrixPageContent>
  );
}
