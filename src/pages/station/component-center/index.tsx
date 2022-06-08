/* 组件中心
 * @Author: muxi.jth
 * @Date: 2022-03-07 01:01:37
 * @FilePath: /fe-matrix/src/pages/station/version-detail/index.tsx
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Button, Typography, Select, Form, Input } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { productionTabsConfig } from './tab-config';
import InfoTable from './ReadOnlyTable';
import { history } from 'umi';
import BasicDataModal from './components/basicDataModal';
import { useQueryComponentList, useQueryProductlineList } from './hook';
import AddApplicationDraw from './components/addApplicationDraw';
import './index.less';
const { TabPane } = Tabs;
const { Paragraph } = Typography;

export default function ComponentCenter() {
  const identification: any = history.location.state;
  const [productLineForm] = Form.useForm();
  const [tabActiveKey, setTabActiveKey] = useState<string>('app');
  const [loading, dataSource, pageInfo, setPageInfo, setDataSource, queryComponentList] = useQueryComponentList();
  const [selectLoading, productLineOptions, getProductlineList] = useQueryProductlineList();
  const [batchAddMode, setBatchAddMode] = useState<EditorMode>('HIDE');
  const [basicDataModalVisiable, setBasicDataModalVisiable] = useState<boolean>(false);
  const [curProductLine, setCurProductLine] = useState<string>('');
  const [queryParams, setQueryParams] = useState<any>({});
  const pageTypes: any = {
    app: { text: '应用组件接入' },
    middleware: { text: '中间件组件接入' },
    sql: { text: '基础数据接入' },
  };
  const getCurProductLine = (value: string) => {
    setCurProductLine(value);
    const param = productLineForm.getFieldsValue();
    queryComponentList({ componentType: tabActiveKey, ...param });
    setQueryParams(param);
  };
  useEffect(() => {
    // if (tabActiveKey === 'app') {
    //   getProductlineList();
    //   debugger
    //   queryComponentList({ componentType: tabActiveKey });
    // }
    // return () => {
    //   debugger
    //   setTabActiveKey('app');
    // };
  }, []);
  useEffect(() => {
    if (identification?.identification) {
      queryComponentList({ componentType: identification?.identification });
      setTabActiveKey(identification?.identification);
    } else {
      if (tabActiveKey === 'app') {
        getProductlineList();
        queryComponentList({ componentType: tabActiveKey });
      }
    }
  }, [identification?.identification]);
  const onSearch = () => {
    const param = productLineForm.getFieldsValue();
    queryComponentList({ componentType: tabActiveKey, ...param });
    setQueryParams(param);
  };

  return (
    <PageContainer>
      <ContentCard>
        <AddApplicationDraw
          mode={batchAddMode}
          productLineOptions={productLineOptions || []}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          onClose={() => setBatchAddMode('HIDE')}
          onSave={() => {
            const param = productLineForm.getFieldsValue();
            queryComponentList({ componentType: tabActiveKey, ...param });
            setBatchAddMode('HIDE');
          }}
        />

        {/* <UserModal
          visable={userModalVisiable}
          productLineOptions={productLineOptions || []}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          queryParams={queryParams}
          queryComponentList={({ componentType: tabActiveKey }) => queryComponentList({ componentType: tabActiveKey })}
          onClose={() => {
            setUserModalVisiable(false);
          }}
        /> */}
        <BasicDataModal
          visable={basicDataModalVisiable}
          tabActiveKey={tabActiveKey}
          curProductLine={curProductLine}
          queryParams={queryParams}
          queryComponentList={({ componentType: tabActiveKey }) => queryComponentList({ componentType: tabActiveKey })}
          onClose={() => {
            setBasicDataModalVisiable(false);
          }}
        />
        <>
          <FilterCard className="layout-compact">
            <Tabs
              activeKey={tabActiveKey}
              onChange={(key) => {
                setTabActiveKey(key);
                const param = productLineForm.getFieldsValue();
                queryComponentList({ componentType: key, ...param });
              }}
              tabBarExtraContent={
                <div className="tab-right-extra" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 10 }}>
                    <Form form={productLineForm} layout="inline">
                      <Form.Item name="componentName">
                        <Input.Search
                          style={{ width: 220 }}
                          placeholder="请输入名称进行查找"
                          onSearch={onSearch}
                        ></Input.Search>
                      </Form.Item>
                      {tabActiveKey === 'app' && (
                        <Form.Item name="productLine" label="切换产品线">
                          <Select
                            style={{ width: 160 }}
                            defaultValue={curProductLine || ''}
                            options={productLineOptions || []}
                            onChange={getCurProductLine}
                            loading={selectLoading}
                            showSearch
                            allowClear
                          />
                        </Form.Item>
                      )}

                      <span style={{ marginRight: 8 }}>
                        {tabActiveKey !== 'middleware' && (
                          <Button
                            type="primary"
                            onClick={() => {
                              if (tabActiveKey === 'app') {
                                setBatchAddMode('ADD');
                                // setUserModalVisiable(true);
                              }
                              //  if (tabActiveKey === 'middleware') {
                              //    // setMiddlewareModalVisibale(true);
                              //  }
                              if (tabActiveKey === 'sql') {
                                setBasicDataModalVisiable(true);
                              }
                            }}
                          >
                            {pageTypes[tabActiveKey]?.text}
                          </Button>
                        )}
                      </span>
                      <Button
                        type="primary"
                        onClick={() => {
                          queryComponentList({ componentType: tabActiveKey });
                        }}
                      >
                        刷新数据
                      </Button>
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
              identification={identification?.identification}
              onDelClick={() => {
                const param = productLineForm.getFieldsValue();
                queryComponentList({ componentType: tabActiveKey, ...param });
              }}
              queryComponentList={({ componentType: tabActiveKey, pageIndex, pageSize }) =>
                queryComponentList({ componentType: tabActiveKey, productLine: curProductLine, pageIndex, pageSize })
              }
              tableLoading={loading}
              pageInfo={pageInfo}
              setPageInfo={(pageIndex: number, pageSize?: number) => {
                setPageInfo({ pageIndex, pageSize });
              }}
            />
          </div>
        </>
      </ContentCard>
    </PageContainer>
  );
}
