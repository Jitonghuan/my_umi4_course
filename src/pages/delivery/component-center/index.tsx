/* 组件中心
 * @Author: your name
 * @Date: 2022-03-07 01:01:37
 * @LastEditTime: 2022-03-07 14:11:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/delivery/version-detail/index.tsx
 */
import React, { useState } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Radio, Space, Descriptions, Button, Input, Form, Typography } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { productionTabsConfig } from './tab-config';
import InfoTable from './readOnlyTable';
import UserModal from './components/UserModal';
import BasicDataModal from './components/basicDataModal';
import MiddlewareModal from './components/middlewareModal';
const { TabPane } = Tabs;
const { Paragraph } = Typography;

export default function VersionDetail() {
  const [matchlabels, setMatchlabels] = useState<any[]>([]);
  const [editableStr, setEditableStr] = useState('This is an editable text.');
  const [tabActiveKey, setTabActiveKey] = useState<string>('user');
  const [userModalVisiable, setUserModalVisiable] = useState<boolean>(false);
  const [basicDataModalVisiable, setBasicDataModalVisiable] = useState<boolean>(false);
  const [middlewareModalVisibale, setMiddlewareModalVisibale] = useState<boolean>(false);

  const matchlabelsFun = (value: any[]) => {
    setMatchlabels(value);
  };
  const pageTypes: any = {
    user: { text: '用户组件接入' },
    middleware: { text: '平台组件接入' },
    basicData: { text: '基础数据接入' },
  };

  return (
    <PageContainer>
      <ContentCard>
        <UserModal
          visable={userModalVisiable}
          onClose={() => {
            setUserModalVisiable(false);
          }}
        />
        <BasicDataModal visable={basicDataModalVisiable} />
        <MiddlewareModal visable={middlewareModalVisibale} />

        <>
          <FilterCard className="layout-compact">
            <Tabs
              activeKey={tabActiveKey}
              onChange={(key) => {
                setTabActiveKey(key);
              }}
              tabBarExtraContent={
                <div className="tab-right-extra">
                  <span>
                    <Button
                      type="primary"
                      onClick={() => {
                        if (tabActiveKey === 'user') {
                          setUserModalVisiable(true);
                        }
                        if (tabActiveKey === 'middleware') {
                          setMiddlewareModalVisibale(true);
                        }
                        if (tabActiveKey === 'basicData') {
                          setBasicDataModalVisiable(true);
                        }
                      }}
                    >
                      {pageTypes[tabActiveKey].text}
                    </Button>
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
            <InfoTable currentTab={tabActiveKey} />
          </div>
        </>
      </ContentCard>
    </PageContainer>
  );
}
