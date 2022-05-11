/* 组件中心
 * @Author: muxi.jth
 * @Date: 2022-03-07 01:01:37
 * @FilePath: /fe-matrix/src/pages/delivery/version-detail/index.tsx
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Button, Typography, Select, Form } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { productionTabsConfig } from './tab-config';
import InfoTable from './ReadOnlyTable';
import { getRequest, postRequest } from '@/utils/request';
import UserModal from './components/UserModal';
import BasicDataModal from './components/basicDataModal';
import MiddlewareModal from './components/middlewareModal';
import { useQueryComponentList, useQueryProductlineList } from './hook';
import { queryProductlineList } from '../service';
import './index.less';
const { TabPane } = Tabs;
const { Paragraph } = Typography;

export default function VersionDetail() {
  const [productLineForm] = Form.useForm();
  const [matchlabels, setMatchlabels] = useState<any[]>([]);
  const [editableStr, setEditableStr] = useState('This is an editable text.');
  const [tabActiveKey, setTabActiveKey] = useState<string>('app');
  const [loading, dataSource, pageInfo, setPageInfo, setDataSource, queryComponentList] = useQueryComponentList();
  // const [selectLoading, productLineOptions, getProductlineList] = useQueryProductlineList();
  const [userModalVisiable, setUserModalVisiable] = useState<boolean>(false);
  const [basicDataModalVisiable, setBasicDataModalVisiable] = useState<boolean>(false);
  const [middlewareModalVisibale, setMiddlewareModalVisibale] = useState<boolean>(false);
  const [curProductLine, setCurProductLine] = useState<string>('');
  const [selectLoading, setSelectLoading] = useState<boolean>(false);
  const [productLineOptions, setProductLineOptions] = useState<any>([]);
  const getProductlineList = async () => {
    setSelectLoading(true);
    try {
      await getRequest(queryProductlineList)
        .then((res) => {
          if (res?.success) {
            let data = res.data;
            const option = data?.map((item: any) => ({
              label: item.categoryCode || '',
              value: item.categoryCode || '',
            }));
            setProductLineOptions(option);
            setCurProductLine(option[0]?.value || '');
            productLineForm.setFieldsValue({
              productLine: option[0]?.value || '',
            });
          } else {
            setProductLineOptions([]);
            return;
          }
        })
        .finally(() => {
          setSelectLoading(false);
        });
    } catch (error) {
      console.log(error, 2222);
    }
  };

  const matchlabelsFun = (value: any[]) => {
    setMatchlabels(value);
  };
  const pageTypes: any = {
    app: { text: '应用组件接入' },
    middleware: { text: '中间件组件接入' },
    sql: { text: '基础数据接入' },
  };
  const getCurProductLine = (value: string) => {
    setCurProductLine(value);
  };
  useEffect(() => {
    if (tabActiveKey === 'app') {
      getProductlineList();
    }
  }, []);

  return (
    <PageContainer>
      <ContentCard>
        <UserModal
          visable={userModalVisiable}
          productLineOptions={productLineOptions || []}
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
          queryComponentList={(tabActiveKey: any) => queryComponentList(tabActiveKey)}
          onClose={() => {
            setBasicDataModalVisiable(false);
          }}
        />
        <MiddlewareModal
          visable={middlewareModalVisibale}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          queryComponentList={(tabActiveKey: any) => queryComponentList(tabActiveKey)}
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
                <div className="tab-right-extra" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 10 }}>
                    <Form form={productLineForm} layout="inline">
                      {tabActiveKey === 'app' && (
                        <Form.Item name="productLine" label="切换产品线">
                          <Select
                            style={{ width: 160 }}
                            defaultValue={curProductLine || ''}
                            options={productLineOptions || []}
                            onChange={getCurProductLine}
                            loading={selectLoading}
                          />
                        </Form.Item>
                      )}

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
                    </Form>
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
              curProductLine={curProductLine}
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
