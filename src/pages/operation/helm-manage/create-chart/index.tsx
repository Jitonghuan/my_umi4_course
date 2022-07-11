import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Empty, Spin, Divider } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import CreatCard from './components/create-card';
import { ContentCard } from '@/components/vc-page-content';
import AceEditor from '@/components/ace-editor';
import {
  queryPodNamespaceData,
  useGetChartName,
  queryChartVersions,
  queryChartList,
  queryChartValues,
  useChartInstall,
} from './hook';
import './index.less';

export default function CreateChart() {
  const rootCls = 'all-chart-page';
  const clusterInfo: any = history.location?.state || {};
  const [createReleaseForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [chartNameLoading, chartNameOptions, getChartList] = useGetChartName();
  const [showNextStep, setShowNextStep] = useState<boolean>(false);
  const [nameSpaceOption, setNameSpaceOption] = useState<any>([]);
  const [chartVersionOption, setChartVersionOption] = useState<any>([]);
  const [chartListInfo, setChartListInfo] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [curChartName, setCurChartName] = useState<string>('');
  const [chartValues, setChartValues] = useState<string>('');
  const [valueLoading, setValueLoading] = useState<boolean>(false);
  const [chartParam, setChartParam] = useState<any>({});
  const [intallLoading, chartInstall] = useChartInstall();
  const [oneStepData, setOneStepData] = useState<any>({});

  useEffect(() => {
    queryNameSpace(clusterInfo?.curClusterId);
    getChartList({ clusterName: clusterInfo?.curClusterName });
    queryChartListInfo();
  }, []);
  const queryChartListInfo = (chartName?: string) => {
    setIsLoading(true);
    queryChartList({ clusterName: clusterInfo?.curClusterName, chartName })
      .then((res) => {
        let result = res ? res : [];
        setChartListInfo(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  //查询nameSpace
  const queryNameSpace = (value: any) => {
    queryPodNamespaceData({ clusterId: value }).then((res) => {
      setNameSpaceOption(res);
    });
  };
  const changeChartName = (value: string) => {
    setCurChartName(value);
    queryChartListInfo(value);
  };
  const getChartVersions = (chartName?: string, repository?: string) => {
    queryChartVersions({
      clusterName: clusterInfo?.curClusterName,
      chartName: chartName,
      repository: repository,
    }).then((res) => {
      setChartVersionOption(res);
    });
  };

  const getChartValues = (params: { chartName: string; clusterName: string; repository: string }) => {
    setChartParam(params);
  };

  const changeVersion = (chartVersion: string) => {
    setValueLoading(true);
    queryChartValues({ ...chartParam, chartVersion })
      .then((res) => {
        setChartValues(res);

        createReleaseForm.setFieldsValue({
          values: res,
        });
      })
      .finally(() => {
        setValueLoading(false);
      });
  };
  const getOneStepData = async () => {
    const paramsOneStep = await createForm.validateFields();
    setShowNextStep(true);
    setOneStepData(paramsOneStep);
  };

  const hanleSubmit = async () => {
    const params = await createReleaseForm.validateFields();
    chartInstall({
      ...params,
      ...chartParam,
      ...oneStepData,
      chartName: chartParam?.chartName,
      clusterName: clusterInfo?.curClusterName,
    }).then(() => {
      history.push('/matrix/operation/helm-manage/helm-list');
    });
  };

  return (
    <PageContainer>
      <ContentCard>
        <div className="create-release-content">
          <div className="create-release-content-form">
            <Form
              style={{ width: '56%' }}
              labelCol={{ flex: '120px' }}
              // layout='inline'
              form={createReleaseForm}
              onReset={() => {
                createReleaseForm.resetFields();
              }}
            >
              {!showNextStep && (
                <>
                  <Form
                    style={{ width: '56%' }}
                    labelCol={{ flex: '120px' }}
                    form={createForm}
                    onReset={() => {
                      createForm.resetFields();
                    }}
                  >
                    <div className="first-create-step">
                      <Form.Item
                        label="发布名称"
                        name="releaseName"
                        rules={[{ required: true, message: '这是必填项' }]}
                      >
                        <Input style={{ width: 320 }} />
                      </Form.Item>
                      <Form.Item label="命名空间" name="namespace" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select style={{ width: 320 }} allowClear showSearch options={nameSpaceOption} />
                      </Form.Item>
                      <Form.Item label="chart名称" name="chartName">
                        <Input.Search
                          style={{ width: 320 }}
                          // options={chartNameOptions}
                          onSearch={changeChartName}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </>
              )}
              {!showNextStep && <Divider />}

              {showNextStep && (
                <>
                  <div className="second-create-step">
                    <Form.Item
                      label="chart版本"
                      name="chartVersion"
                      rules={[{ required: true, message: '这是必填项' }]}
                    >
                      <Select
                        style={{ width: 540 }}
                        allowClear
                        showSearch
                        options={chartVersionOption}
                        onChange={changeVersion}
                      />
                    </Form.Item>
                  </div>

                  <Spin spinning={valueLoading}>
                    <Form.Item label="详情" name="values">
                      <AceEditor mode="yaml" height={560} />
                    </Form.Item>
                  </Spin>
                </>
              )}
            </Form>
          </div>

          {!showNextStep && (
            <Spin spinning={isLoading}>
              <div className="create-card-content">
                {/* <CreatCard /> */}
                <div className={`${rootCls}__card-wrapper`}>
                  {!isLoading && !chartListInfo.length && (
                    <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                  <CreatCard
                    curClusterName={clusterInfo?.curClusterName}
                    curChartName={curChartName}
                    dataSource={chartListInfo}
                    queryChartListInfo={queryChartListInfo}
                    getChartVersions={getChartVersions}
                    getChartValues={getChartValues}
                  />
                  {/* {total > 10 && (
                    <div className={`${rootCls}-pagination-wrap`}>
                      <Pagination
                        pageSize={pageSize}
                        total={total}
                        current={pageIndex}
                        // showSizeChanger
                        onShowSizeChange={(_, next) => {
                          setPageIndex(1);
                          setPageSize(next);
                        }}
                        onChange={(next) => setPageIndex(next)}
                      />
                    </div>
                  )} */}
                </div>
              </div>
            </Spin>
          )}

          <div className="create-card-footer">
            {!showNextStep && (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    getOneStepData();
                  }}
                >
                  下一步
                </Button>
                <Button
                  danger
                  onClick={() => {
                    createForm.resetFields();
                    history.push('/matrix/operation/helm-manage/helm-list');
                  }}
                >
                  取消
                </Button>
              </Space>
            )}
            {showNextStep && (
              <Space>
                <Button
                  type="ghost"
                  onClick={() => {
                    setShowNextStep(false);
                  }}
                >
                  上一步
                </Button>
                <Button type="primary" onClick={hanleSubmit} loading={intallLoading}>
                  确定
                </Button>
                <Button
                  danger
                  onClick={() => {
                    createReleaseForm.resetFields();
                  }}
                >
                  取消
                </Button>
              </Space>
            )}
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
