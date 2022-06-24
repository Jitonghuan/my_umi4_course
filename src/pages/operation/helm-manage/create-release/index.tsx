import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Popconfirm, Form, Input, Select } from 'antd';
import PageContainer from '@/components/page-container';
import CreatCard from '../create-release/components/create-card';
import { ContentCard } from '@/components/vc-page-content';

export default function CreateRelease() {
  const [createReleaseForm] = Form.useForm();
  return (
    <PageContainer>
      <ContentCard>
        <div className="create-card-content">
          <Form
            labelCol={{ flex: '120px' }}
            form={createReleaseForm}
            onReset={() => {
              createReleaseForm.resetFields();
            }}
          >
            <Form.Item label="发布名称">
              <Input style={{ width: 320 }} />
            </Form.Item>
            <Form.Item label="命名空间">
              <Select style={{ width: 320 }} allowClear showSearch />
            </Form.Item>
            <Form.Item label="chart名称">
              <Select style={{ width: 320 }} allowClear showSearch />
            </Form.Item>
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
          <CreatCard />
        </div>
      </ContentCard>
    </PageContainer>
  );
}
