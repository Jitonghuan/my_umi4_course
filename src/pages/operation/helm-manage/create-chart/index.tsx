import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import CreatCard from './components/create-card';
import { ContentCard } from '@/components/vc-page-content';
import AceEditor from '@/components/ace-editor';
import { queryPodNamespaceData } from './hook';
import './index.less';

export default function CreateRelease() {
  const clusterInfo: any = history.location?.state || {};
  const [createReleaseForm] = Form.useForm();
  const [showNextStep, setShowNextStep] = useState<boolean>(false);
  const [nameSpaceOption, setNameSpaceOption] = useState<any>([]);
  console.log('clusterInfo', clusterInfo);
  // const [nameSpaceLoading, nameSpaceOption,getPodNamespace]=useGetClusterListPodNamespace();
  useEffect(() => {
    queryNameSpace(clusterInfo?.clusterId);
  }, []);
  //查询nameSpace
  const queryNameSpace = (value: any) => {
    queryPodNamespaceData({ clusterId: value }).then((res) => {
      setNameSpaceOption(res);
    });
  };
  return (
    <PageContainer>
      <ContentCard>
        <div className="create-release-content">
          <Form
            labelCol={{ flex: '400px' }}
            form={createReleaseForm}
            onReset={() => {
              createReleaseForm.resetFields();
            }}
          >
            {!showNextStep && (
              <>
                <Form.Item label="发布名称" name="releaseName">
                  <Input style={{ width: 320 }} />
                </Form.Item>
                <Form.Item label="命名空间" name="namespace">
                  <Select style={{ width: 320 }} allowClear showSearch options={nameSpaceOption} />
                </Form.Item>
                <Form.Item label="chart名称" name="chartName">
                  <Select style={{ width: 320 }} allowClear showSearch />
                </Form.Item>
              </>
            )}

            {showNextStep && (
              <>
                <Form.Item label="chart版本" name="chartVersion">
                  <Select style={{ width: 320 }} allowClear showSearch />
                </Form.Item>
                <Form.Item label="详情" name="values">
                  <AceEditor mode="yaml" height={500} />
                </Form.Item>
              </>
            )}
          </Form>

          {/* <div className={`${rootCls}__card-wrapper`}>
            {!isLoading && !appListData.length && (
              <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <CreatCard key={type} type={type} dataSource={appListData} loadAppListData={loadAppListData} />
            {total > 10 && (
              <div className={`${rootCls}-pagination-wrap`}>
                <Pagination
                  pageSize={pageSize}
                  total={total}
                  current={pageIndex}
                  showSizeChanger
                  onShowSizeChange={(_, next) => {
                    setPageIndex(1);
                    setPageSize(next);
                  }}
                  onChange={(next) => setPageIndex(next)}
                />
              </div>
            )}
          </div> */}
          {!showNextStep && (
            <div className="create-card-content">
              <CreatCard />
            </div>
          )}

          <div className="create-card-footer">
            {!showNextStep && (
              <Space>
                <Button
                  onClick={() => {
                    setShowNextStep(true);
                  }}
                >
                  下一步
                </Button>
                <Button>取消</Button>
              </Space>
            )}
            {showNextStep && (
              <Space>
                <Button
                  onClick={() => {
                    setShowNextStep(false);
                  }}
                >
                  上一步
                </Button>
                <Button>确定</Button>
                <Button>取消</Button>
              </Space>
            )}
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
