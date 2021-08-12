import React, { useEffect, useState } from 'react';
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
  getCaseCategoryDeepList,
} from '../service';
import { ContentCard, CardRowGroup } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import { Tree, TreeNode } from '@cffe/algorithm';
import { history } from 'umi';
import './index.less';

const createTreeOptions = {
  type: 'tree' as 'tree',
  keyProp: 'id',
  childrenProp: 'items',
};

export default function TestCase(props: any) {
  const testCaseCateId = history.location.query?.testCaseCateId;
  const [tree, setTree] = useState<Tree>();
  const [cateTreeData, setCateTreeData] = useState<any[]>([]);
  const [caseCategories, setCaseCategories] = useState<any[]>([]);

  const updateLeftTree = async (cateId: string, keyword?: string) => {
    let curTree: Tree = tree as Tree;
    if (!tree) {
      const res = await getRequest(getCaseCategoryDeepList);
      const tree = new Tree(res.data, createTreeOptions);
      curTree = tree;
      setTree(tree);
    }
    let cateTreeNode = curTree.root.find((node) => node.id === parseInt(cateId || '0'));
    if (keyword) cateTreeNode = cateTreeNode?.filter((node) => node.name?.includes(keyword)) as TreeNode;
    void setCaseCategories(curTree.root.children);
    void setCateTreeData([cateTreeNode]);
  };

  useEffect(() => {
    void updateLeftTree(testCaseCateId as string);
  }, []);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="test-case-library" history={props.history} />
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>
          <LeftTree
            cateTreeData={cateTreeData}
            caseCategories={caseCategories}
            defaultCateId={testCaseCateId}
            searchCateTreeData={updateLeftTree}
          />
        </CardRowGroup.SlideCard>
        <ContentCard>
          <RightDetail />
        </ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
