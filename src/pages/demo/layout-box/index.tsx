// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';

export default function DemoPageTb() {
  // let numsArry=[-9,-6,0,13,16];
  let numsArry = [-9, -6, -5, -4, -1];
  let nums1 = 0;
  let nums2 = numsArry.length - 1;
  let newArry = [];

  while (nums1 <= nums2) {
    let a = numsArry[nums1] * numsArry[nums1];
    let b = numsArry[nums2] * numsArry[nums2];
    if (a > b) {
      nums2--;
      newArry.push(b);
    } else {
      nums1++;
      newArry.push(a);
    }
  }

  return (
    <PageContainer>
      <FilterCard>TOP</FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
        <ContentCard>
          RIGHT
          <div className="rigth_top"></div>
          <div className="rigth_down"></div>
        </ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}
