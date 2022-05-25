import { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Descriptions, Button, Typography, Divider } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import moment from 'moment';
import EditorTablePro from './Editor-Table-Pro';
import GlobalParamsEditorTable from './GlobalParamsEditorTable';
import ComponentParamsEditorTable from './ComponentParamsEditorTable';
import { productionTabsConfig, deliveryTabsConfig, productionPageTypes } from './tab-config';
import { useVersionDescriptionInfo, useEditProductVersionDescription } from './hooks';
import './index.less';
import { useQueryDeliveryParamList, useQueryDeliveryGloableParamList } from './hooks';
const { TabPane } = Tabs;
const { Paragraph } = Typography;
export default function VersionDetail() {
  const descriptionInfoData: any = history.location.state;
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, queryDeliveryParamList] = useQueryDeliveryParamList();
  const [
    gloableTableLoading,
    gloableTableDataSource,
    gloablePageInfo,
    setgloablePageInfo,
    queryDeliveryGloableParamList,
  ] = useQueryDeliveryGloableParamList();
  const [editableStr, setEditableStr] = useState(descriptionInfoData?.versionDescription);
  const [infoLoading, versionDescriptionInfo, getVersionDescriptionInfo] = useVersionDescriptionInfo();
  const [editLoading, editProductVersionDescription] = useEditProductVersionDescription();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [tabActiveKey, setTabActiveKey] = useState<string>('basicInfo');
  console.log('descriptionInfoData', descriptionInfoData);

  useEffect(() => {
    if (!descriptionInfoData.versionId) {
      debugger;
      return;
    }
    if (descriptionInfoData?.optType === 'componentDetail') {
      setTabActiveKey('production');
      console.log('tabActiveKey', tabActiveKey);
    }
  }, [descriptionInfoData?.optType]);
  useEffect(() => {
    getVersionDescriptionInfo(descriptionInfoData.versionId);
  }, []);

  useEffect(() => {
    //全局参数查询交付配置参数
    queryDeliveryGloableParamList(descriptionInfoData.versionId, 'global');
    //组件参数
    queryDeliveryParamList(descriptionInfoData.versionId);
    if (descriptionInfoData.releaseStatus === 1) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }

    return () => {
      setIsEditable(false);
    };
  }, []);
  return (
    <PageContainer className="version-detail">
      <ContentCard className="version-detail-info">
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
        <Divider style={{ marginTop: 0, marginBottom: 4 }} />
        <>
          <Tabs
            tabPosition="left"
            className="basicInfo"
            activeKey={tabActiveKey}
            onChange={(key) => {
              setTabActiveKey(key);
            }}
          >
            <TabPane tab="基本信息" key="basicInfo">
              <div>
                <Descriptions
                  title="基本信息"
                  column={2}
                  className="basic-info-description"
                  // labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
                  // contentStyle={{ color: '#000' }}
                  bordered={true}
                >
                  <Descriptions.Item label="产品名称:">{descriptionInfoData?.productName || '--'}</Descriptions.Item>
                  <Descriptions.Item label="产品版本:">{descriptionInfoData?.versionName || '--'}</Descriptions.Item>
                  <Descriptions.Item label="版本描述:">
                    {isEditable ? (
                      <span>{descriptionInfoData?.versionDescription}</span>
                    ) : (
                      <Paragraph
                        editable={{
                          onChange: (productVersionDescription: string) =>
                            editProductVersionDescription(
                              descriptionInfoData.versionId,
                              productVersionDescription,
                            ).then(() => {
                              setEditableStr(productVersionDescription);
                            }),
                        }}
                      >
                        {editableStr}
                      </Paragraph>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间:">
                    {moment(descriptionInfoData?.versionGmtCreate).format('YYYY-MM-DD HH:mm:ss') || '--'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
            <TabPane tab="产品编排" key="production">
              <Tabs type="card" className="basicInfocard">
                {productionTabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    <div>
                      <EditorTablePro
                        currentTab={item.value}
                        currentTabType={item.type}
                        versionId={descriptionInfoData.versionId}
                        isEditable={isEditable}
                        versionDescription={descriptionInfoData.versionDescription}
                        releaseStatus={descriptionInfoData.releaseStatus}
                        descriptionInfoData={descriptionInfoData}
                      />
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
            <TabPane tab="交付配置" key="delivery">
              <Tabs type="card">
                {deliveryTabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    {item.value === 'globalParameters' && (
                      <div>
                        <GlobalParamsEditorTable
                          currentTab={item.value}
                          versionId={descriptionInfoData.versionId}
                          initDataSource={tableDataSource}
                          isEditable={isEditable}
                        />
                      </div>
                    )}
                    {item.value === 'componentParameters' && (
                      <div>
                        <ComponentParamsEditorTable
                          currentTab={item.value}
                          versionId={descriptionInfoData.versionId}
                          initDataSource={gloableTableDataSource}
                          isEditable={isEditable}
                        />
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
