import React, { useEffect, useState } from 'react';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import AddCaseDrawer from './add-case-drawer';
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
  const [rootCateId, setRootCateId] = useState<string>(testCaseCateId as string);
  const [cateId, setCateId] = useState<string>(testCaseCateId as string);
  const [drawerVisible, setDrawerVisible] = useState(true);

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

  const onAddCaseBtnClick = () => {
    void setDrawerVisible(true);
  };

  const onEditCaseBtnClick = () => {
    void setDrawerVisible(true);
  };

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="test-case-library" history={props.history} />
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>
          <LeftTree
            cateId={cateId}
            setCateId={setCateId}
            rootCateId={rootCateId}
            setRootCateId={setRootCateId}
            cateTreeData={cateTreeData}
            caseCategories={caseCategories}
            defaultCateId={testCaseCateId}
            searchCateTreeData={updateLeftTree}
          />
        </CardRowGroup.SlideCard>
        <ContentCard>
          <RightDetail
            cateId={cateId}
            setDrawerVisible={setDrawerVisible}
            onAddCaseBtnClick={onAddCaseBtnClick}
            onEditCaseBtnClick={onEditCaseBtnClick}
          />
        </ContentCard>
      </CardRowGroup>

      <AddCaseDrawer visible={drawerVisible} setVisible={setDrawerVisible} />
    </MatrixPageContent>
  );
}
