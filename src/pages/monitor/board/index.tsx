// 应用卡片列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:26

import React, { useState, useCallback, useMemo } from 'react';
import { Radio, Button, Spin, Pagination, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import BoardList from './card-list';
import FilterHeader from '@/pages/application/_components/filter-header';
import { useAppListData } from '@/pages/application/hooks';
import './index.less';

const rootCls = 'monitor-board';

export default function Board() {
  const currentType: any = localStorage.getItem('__last_application_type');
  const [type, setType] = useState<'all' | 'mine' | 'collect'>(currentType || 'collect');
  const [createAppVisible, setCreateAppVisible] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchParams, setSearchParams] = useState<any>(
    localStorage.ALL_APPLICATIO_SEARCH ? JSON.parse(localStorage.ALL_APPLICATIO_SEARCH) : {},
  );

  const hookParams = useMemo(() => ({ ...searchParams, requestType: type }), [type, searchParams]);
  const [appListData, total, isLoading, loadAppListData] = useAppListData(hookParams, pageIndex, pageSize);

  const handleTypeChange = useCallback((e: any) => {
    const next = e.target.value;
    setType(next);
    localStorage.setItem('__last_application_type', next);
  }, []);

  const handleFilterSearch = useCallback((next: any) => {
    setPageIndex(1);
    setSearchParams(next);
    localStorage.ALL_APPLICATIO_SEARCH = JSON.stringify(next || {});
  }, []);

  return (
    <PageContainer className={rootCls}>
      <FilterHeader onSearch={handleFilterSearch} searchParams={searchParams} />

      <ContentCard>
        <div className="table-caption">
          <Button type="primary" onClick={() => setCreateAppVisible(true)}>
            <PlusOutlined />
            新增应用
          </Button>
        </div>

        <Spin spinning={isLoading}>
          <div className={`${rootCls}__card-wrapper`}>
            {!isLoading && !appListData.length && (
              <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <BoardList key={type} type={type} dataSource={appListData} loadAppListData={loadAppListData} />
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
    </PageContainer>
  );
}
