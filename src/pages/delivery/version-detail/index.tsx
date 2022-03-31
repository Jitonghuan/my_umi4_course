/*
 * @Author: your name
 * @Date: 2022-03-07 01:01:37
 * @LastEditTime: 2022-03-07 14:11:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/delivery/version-detail/index.tsx
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Radio, Space, Descriptions, Button, Input, Form, Typography } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import EditorTablePro from './Editor-Table-Pro';
import { history } from 'umi';
import moment from 'moment';
import EditorTableProTwo from './Editor-Table-Pro-two';
import { productionTabsConfig, deliveryTabsConfig } from './tab-config';
import { useVersionDescriptionInfo, useEditProductVersionDescription } from './hooks';
import './index.less';
const { TabPane } = Tabs;
const { Paragraph } = Typography;
export default function VersionDetail() {
  const descriptionInfoData: any = history.location.state;
  const [matchlabels, setMatchlabels] = useState<any[]>([]);
  const [editableStr, setEditableStr] = useState('This is an editable text.');
  const [infoLoading, versionDescriptionInfo, getVersionDescriptionInfo] = useVersionDescriptionInfo();
  const [editLoading, editProductVersionDescription] = useEditProductVersionDescription();
  useEffect(() => {
    getVersionDescriptionInfo(descriptionInfoData.versionId);
  }, []);
  const matchlabelsFun = (value: any[]) => {
    setMatchlabels(value);
  };

  return (
    <PageContainer>
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
                <Descriptions title="基本信息" column={2}>
                  <Descriptions.Item label="产品名称">{descriptionInfoData.productName}</Descriptions.Item>
                  <Descriptions.Item label="产品版本">{versionDescriptionInfo.versionName}</Descriptions.Item>
                  <Descriptions.Item label="版本描述">
                    <Paragraph
                      editable={{
                        onChange: (productVersionDescription: string) =>
                          editProductVersionDescription(descriptionInfoData.id, productVersionDescription),
                      }}
                    >
                      {versionDescriptionInfo.versionDescription}
                    </Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {moment(versionDescriptionInfo.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
            <TabPane tab="产品编排" key="2">
              <Tabs type="card">
                {productionTabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    <div>
                      <EditorTableProTwo />
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
            <TabPane tab="交付配置" key="3">
              <Tabs type="card">
                {deliveryTabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    <div>
                      <EditorTableProTwo />
                    </div>
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
