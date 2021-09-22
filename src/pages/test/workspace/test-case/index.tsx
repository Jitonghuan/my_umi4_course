import React, { useEffect, useState } from 'react';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import HeaderTabs from '../_components/header-tabs';
import { getCaseCategoryDeepList } from '../service';
import PageContainer from '@/components/page-container';
import { ContentCard, CardRowGroup } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import { history } from 'umi';
import { LeftOutlined } from '@ant-design/icons';
import './index.less';

export default function TestCase(props: any) {
  const testCaseCateId = history.location.query?.testCaseCateId;

  const [caseCateTreeData, setCaseCateTreeData] = useState<any[]>();
  const [filterCaseCateTreeData, setFilterCaseCateTreeData] = useState<any[]>();
  const [caseCategories, setCaseCategories] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [curCase, setCurCase] = useState<any>();
  const [rootCateId, setRootCateId] = useState<string>(testCaseCateId as string);
  const [cateId, setCateId] = useState<string>(testCaseCateId as string);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [caseReadOnly, setCaseReadOnly] = useState<boolean>(false);

  /** ------------------------ 更新左侧树列表 start ------------------------ */

  const dataClean = (node: any) => {
    node.key = node.id;
    node.title = node.name;
    node.children = node.items;
    node.children?.forEach((item: any) => dataClean(item));

    return node;
  };

  let nedExpandKeys: React.Key[] = [];
  const filterTreeData = (nodeArr: any[], keyword?: string): any[] => {
    if (!keyword || nodeArr.length === 0) return nodeArr;
    return nodeArr
      .map((item) => ({ ...item }))
      .filter((node) => {
        nedExpandKeys.push(node.key);
        if (node.title.includes(keyword)) {
          // 自己匹配上了，不需要展开
          nedExpandKeys.pop();
          return true;
        }
        node.children = filterTreeData(node.children || [], keyword);

        // 孩子没有匹配到，不需要展开
        if (node.children.length <= 0) nedExpandKeys.pop();
        return node.children.length > 0;
      });
  };

  useEffect(() => {
    getRequest(getCaseCategoryDeepList, {
      data: {
        id: 0,
        deep: 1,
      },
    }).then((res) => {
      const _data = res.data;
      void setCaseCategories(_data?.map((item: any) => ({ ...item, key: item.id, title: item.name })) || []);
    });
  }, []);

  const updateLeftTree = async (cateId: number, keyword?: string, force: boolean = false) => {
    const res = await getRequest(getCaseCategoryDeepList, {
      data: {
        id: cateId,
        deep: -1,
      },
    });
    const _curTreeData = dataClean({ key: -1, items: res.data }).children;
    void setCaseCateTreeData(_curTreeData || []);
    nedExpandKeys = [];
    void setFilterCaseCateTreeData(filterTreeData(_curTreeData || [], keyword));
    // 根节点一定展开
    if (!expandedKeys || expandedKeys.length === 0) {
      nedExpandKeys.push(+cateId);
      void setExpandedKeys(nedExpandKeys);
    }
  };

  /** ------------------------ 更新左侧树列表 end ------------------------ */

  const onAddCaseBtnClick = () => {
    void setCurCase(undefined);
    void setCaseReadOnly(false);
    void setDrawerVisible(true);
  };

  const onEditCaseBtnClick = (caseInfo: any) => {
    void setCurCase(caseInfo);
    void setCaseReadOnly(false);
    void setDrawerVisible(true);
  };

  const onSeeCaseBtnClick = (caseInfo: any) => {
    void setCurCase(caseInfo);
    void setCaseReadOnly(true);
    void setDrawerVisible(true);
  };

  const goBack = () => {
    history.push('/matrix/test/workspace/test-case-library');
  };

  return (
    <PageContainer>
      {/* <div className="back-btn-container">
        <div onClick={goBack} className="back-btn">
          <LeftOutlined /> <span className="back-btn-title">返回</span>
        </div>
      </div> */}
      <HeaderTabs activeKey="test-case-library" history={props.history} />
      <CardRowGroup>
        <CardRowGroup.SlideCard noPadding className="slide-card" width={320}>
          <LeftTree
            cateId={cateId}
            setCateId={setCateId}
            rootCateId={rootCateId}
            setRootCateId={setRootCateId}
            cateTreeData={filterCaseCateTreeData}
            caseCategories={caseCategories}
            defaultCateId={testCaseCateId}
            searchCateTreeData={updateLeftTree}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
          />
        </CardRowGroup.SlideCard>
        <ContentCard>
          <RightDetail
            cateId={cateId}
            curCase={curCase}
            drawerVisible={drawerVisible}
            setDrawerVisible={setDrawerVisible}
            onAddCaseBtnClick={onAddCaseBtnClick}
            onEditCaseBtnClick={onEditCaseBtnClick}
            caseReadOnly={caseReadOnly}
            onSeeCaseBtnClick={onSeeCaseBtnClick}
            caseCateTreeData={caseCateTreeData}
          />
        </ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}
