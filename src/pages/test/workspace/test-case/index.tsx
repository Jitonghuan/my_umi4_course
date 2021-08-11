import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import { history } from 'umi';

export default function TestCase(props: any) {
  const {
    location: { query },
  } = history;

  console.log(query?.testCaseId);

  return (
    <MatrixPageContent>
      <ContentCard>TestCase</ContentCard>
    </MatrixPageContent>
  );
}
