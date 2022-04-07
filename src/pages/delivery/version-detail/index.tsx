import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Radio, Space, Descriptions, Button, Input, Form, Typography } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import moment from 'moment';
import EditorTablePro from './Editor-Table-Pro';
import GlobalParamsEditorTable from './GlobalParamsEditorTable';
import ComponentParamsEditorTable from './ComponentParamsEditorTable';
import { productionTabsConfig, deliveryTabsConfig, productionPageTypes } from './tab-config';
import { useVersionDescriptionInfo, useEditProductVersionDescription } from './hooks';
import './index.less';
const { TabPane } = Tabs;
const { Paragraph } = Typography;
export default function VersionDetail() {
  const descriptionInfoData: any = history.location.state;
  const [matchlabels, setMatchlabels] = useState<any[]>([]);
  const [editableStr, setEditableStr] = useState(descriptionInfoData.versionDescription);
  const [infoLoading, versionDescriptionInfo, getVersionDescriptionInfo] = useVersionDescriptionInfo();
  const [editLoading, editProductVersionDescription] = useEditProductVersionDescription();
  useEffect(() => {
    getVersionDescriptionInfo(descriptionInfoData.versionId);
  }, []);
  const matchlabelsFun = (value: any[]) => {
    setMatchlabels(value);
  };

  return (
    <PageContainer className="version-detail">
      <ContentCard>
        <div className="version-detail-back">
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/matrix/delivery/product-description',
                state: {
                  id: descriptionInfoData.productId,
                  productName: descriptionInfoData.productName,
                  productDescription: descriptionInfoData.productDescription,
                  gmtCreate: descriptionInfoData.productGmtCreate,
                },
              });
            }}
          >
            返回
          </Button>
        </div>
        <>
          <Tabs tabPosition="left">
            <TabPane tab="基本信息" key="1">
              <div>
                <Descriptions title="基本信息" column={2} className="basic-info-description">
                  <Descriptions.Item label="产品名称">{descriptionInfoData.productName}</Descriptions.Item>
                  <Descriptions.Item label="产品版本">{descriptionInfoData.versionName}</Descriptions.Item>
                  <Descriptions.Item label="版本描述">
                    <Paragraph
                      editable={{
                        onChange: (productVersionDescription: string) =>
                          editProductVersionDescription(descriptionInfoData.versionId, productVersionDescription).then(
                            () => {
                              setEditableStr(productVersionDescription);
                            },
                          ),
                      }}
                    >
                      {editableStr}
                    </Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {moment(descriptionInfoData.versionGmtCreate).format('YYYY-MM-DD HH:mm:ss')}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
            <TabPane tab="产品编排" key="2">
              <Tabs type="card">
                {productionTabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    <div>
                      <EditorTablePro currentTab={item.value} versionId={descriptionInfoData.versionId} />
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
            <TabPane tab="交付配置" key="3">
              <Tabs type="card">
                {deliveryTabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    {item.value === 'globalParameters' && (
                      <div>
                        <GlobalParamsEditorTable currentTab={item.value} versionId={descriptionInfoData.versionId} />
                      </div>
                    )}
                    {item.value === 'componentParameters' && (
                      <div>
                        <ComponentParamsEditorTable currentTab={item.value} />
                      </div>
                    )}
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
          </Tabs>
        </>
      </ContentCard>
    </PageContainer>
  );
}
