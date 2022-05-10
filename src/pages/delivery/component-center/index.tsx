/* 组件中心
 * @Author: muxi.jth
 * @Date: 2022-03-07 01:01:37
 * @FilePath: /fe-matrix/src/pages/delivery/version-detail/index.tsx
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Button, Typography, Select } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { productionTabsConfig } from './tab-config';
import InfoTable from './ReadOnlyTable';
import UserModal from './components/UserModal';
import BasicDataModal from './components/basicDataModal';
import MiddlewareModal from './components/middlewareModal';
import { useQueryComponentList, useQueryProductlineList } from './hook';
const { TabPane } = Tabs;
const { Paragraph } = Typography;
export const productLineOptions = [
  {
    label: 'hbos',
    value: 'hbos',
  },
  {
    label: 'gmc',
    value: 'gmc',
  },
];

export default function VersionDetail() {
  const [matchlabels, setMatchlabels] = useState<any[]>([]);
  const [editableStr, setEditableStr] = useState('This is an editable text.');
  const [tabActiveKey, setTabActiveKey] = useState<string>('app');
  const [loading, dataSource, pageInfo, setPageInfo, setDataSource, queryComponentList] = useQueryComponentList();
  const [selectLoading, productLineOptions, getProductlineList] = useQueryProductlineList();
  const [userModalVisiable, setUserModalVisiable] = useState<boolean>(false);
  const [basicDataModalVisiable, setBasicDataModalVisiable] = useState<boolean>(false);
  const [middlewareModalVisibale, setMiddlewareModalVisibale] = useState<boolean>(false);
  const [curProductLine, setCurProductLine] = useState<string>('');

  const matchlabelsFun = (value: any[]) => {
    setMatchlabels(value);
  };
  const pageTypes: any = {
    app: { text: '应用组件接入' },
    middleware: { text: '中间件组件接入' },
    sql: { text: '基础数据接入' },
  };
  const getCurProductLine = () => {};
  useEffect(() => {
    getProductlineList();
  }, []);

  return (
    <PageContainer>
      <ContentCard>
        <UserModal
          visable={userModalVisiable}
          productLineOptions={productLineOptions}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          queryComponentList={(tabActiveKey: any) => queryComponentList(tabActiveKey, curProductLine)}
          onClose={() => {
            setUserModalVisiable(false);
          }}
        />
        <BasicDataModal
          visable={basicDataModalVisiable}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          queryComponentList={(tabActiveKey: any) => queryComponentList(tabActiveKey, curProductLine)}
          onClose={() => {
            setBasicDataModalVisiable(false);
          }}
        />
        <MiddlewareModal
          visable={middlewareModalVisibale}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          queryComponentList={(tabActiveKey: any) => queryComponentList(tabActiveKey, curProductLine)}
          onClose={() => {
            setMiddlewareModalVisibale(false);
          }}
        />

        <>
          <FilterCard className="layout-compact">
            <Tabs
              activeKey={tabActiveKey}
              onChange={(key) => {
                setTabActiveKey(key);
              }}
              tabBarExtraContent={
                <div className="tab-right-extra">
                  <span style={{ marginRight: 12 }}>
                    <span>切换产品线：</span>
                    <Select
                      style={{ width: 160 }}
                      options={productLineOptions}
                      onChange={getCurProductLine}
                      loading={selectLoading}
                    />
                  </span>
                  <span>
                    {tabActiveKey !== 'middleware' && (
                      <Button
                        type="primary"
                        onClick={() => {
                          if (tabActiveKey === 'app') {
                            setUserModalVisiable(true);
                          }
                          //  if (tabActiveKey === 'middleware') {
                          //    // setMiddlewareModalVisibale(true);
                          //  }
                          if (tabActiveKey === 'sql') {
                            setBasicDataModalVisiable(true);
                          }
                        }}
                      >
                        {pageTypes[tabActiveKey].text}
                      </Button>
                    )}
                  </span>
                </div>
              }
            >
              {productionTabsConfig?.map((item: any, index: number) => (
                <TabPane tab={item.label} key={item.type}></TabPane>
              ))}
            </Tabs>
          </FilterCard>
          <div>
            <InfoTable
              currentTab={tabActiveKey}
              dataSource={dataSource}
              queryComponentList={(tabActiveKey: any) => queryComponentList(tabActiveKey, curProductLine)}
              tableLoading={loading}
            />
          </div>
        </>
      </ContentCard>
    </PageContainer>
  );
}
