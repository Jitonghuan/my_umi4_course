import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Popconfirm, Form, Input, Select, Button, Space } from 'antd';
import PageContainer from '@/components/page-container';
import CreatCard from '../create-release/components/create-card';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';

export default function CreateRelease() {
  const [createReleaseForm] = Form.useForm();
  const [showNextStep, setShowNextStep] = useState<boolean>(false);
  return (
    <PageContainer>
      <ContentCard>
        <div className="create-release-content">
          <Form
            labelCol={{ flex: '120px' }}
            form={createReleaseForm}
            onReset={() => {
              createReleaseForm.resetFields();
            }}
          >
            {!showNextStep && (
              <>
                <Form.Item label="发布名称">
                  <Input style={{ width: 320 }} />
                </Form.Item>
                <Form.Item label="命名空间">
                  <Select style={{ width: 320 }} allowClear showSearch />
                </Form.Item>
                <Form.Item label="chart名称">
                  <Select style={{ width: 320 }} allowClear showSearch />
                </Form.Item>
              </>
            )}

            {showNextStep && (
              <>
                <Form.Item label="chart版本">
                  <Select style={{ width: 320 }} allowClear showSearch />
                </Form.Item>
                <Form.Item>
                  <Input.TextArea style={{ width: 320 }} />
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
          <div className="create-card-content">
            <CreatCard />
          </div>
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
