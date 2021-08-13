import React, { useEffect } from 'react';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import HeaderTabs from '../_components/header-tabs';
import MatrixPageContent from '@/components/matrix-page-content';
import {
  createCase,
  caseDelete,
  updateCase,
  copyCases,
  moveCases,
  getCaseInfo,
  getCasePageList,
  getCaseMultiDeepList,
} from '../service';
import { ContentCard, CardRowGroup } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import { history } from 'umi';
import './index.less';

export default function TestCase(props: any) {
  const testCaseId = history.location.query?.testCaseId;

  useEffect(() => {
    const res = getRequest(getCaseInfo + '/' + testCaseId);
    console.log(res);
  }, []);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="test-case-library" history={props.history} />
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>
          <LeftTree />
        </CardRowGroup.SlideCard>
        <ContentCard>
          <RightDetail />
        </ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
