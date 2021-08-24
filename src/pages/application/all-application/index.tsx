/**
 * AllApplication
 * @description 全部应用页面
 * @author moting.nq
 * @create 2021-04-08 14:56
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Radio, Button, Spin, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import CreateApplication from '../_components/create-application';
import ApplicationCardList from './card-list';
import FilterHeader from '../_components/filter-header';
import { useAppListData } from '../hooks';
import './index.less';

const rootCls = 'all-application-page';

export default function AllApplication() {
  const [type, setType] = useState<'all' | 'mine'>('mine');
  const [createAppVisible, setCreateAppVisible] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();

  const hookParams = useMemo(() => ({ ...searchParams, requestType: type }), [type, searchParams]);
  const [appListData, total, isLoading, loadAppListData] = useAppListData(hookParams, pageIndex, pageSize);

  const handleFilterSearch = useCallback((next: any) => {
    setPageIndex(1);
    setSearchParams(next);
  }, []);

  return (
    <MatrixPageContent className={rootCls}>
      <FilterHeader onSearch={handleFilterSearch} />

      <ContentCard>
        <div className={`${rootCls}__header`}>
          <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
            <Radio.Button value="mine">我的应用</Radio.Button>
            <Radio.Button value="all">全部应用</Radio.Button>
          </Radio.Group>

          <Button type="primary" onClick={() => setCreateAppVisible(true)}>
            <PlusOutlined />
            新增应用
          </Button>
        </div>

        <Spin spinning={isLoading}>
          <div className={`${rootCls}__card-wrapper`}>
            <ApplicationCardList key={type} dataSource={appListData} />
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
          </div>
        </Spin>
      </ContentCard>

      <CreateApplication
        visible={createAppVisible}
        onClose={() => setCreateAppVisible(false)}
        onSubmit={() => {
          loadAppListData();
          setCreateAppVisible(false);
        }}
      />
    </MatrixPageContent>
  );
}
