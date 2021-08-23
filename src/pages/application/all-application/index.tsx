/**
 * AllApplication
 * @description 全部应用页面
 * @author moting.nq
 * @create 2021-04-08 14:56
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Form, Radio, Button, Spin, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useListData } from 'white-react-use';
import MatrixPageContent from '@/components/matrix-page-content';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import CreateApplication from '../_components/create-application';
import ApplicationCardList from './card-list';
import { queryApps } from '../service';
import FilterHeader from '../_components/filter-header';
import './index.less';

const rootCls = 'all-application-page';

export default function AllApplication() {
  const [type, setType] = useState<'all' | 'mine'>('mine');
  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 全部应用 */
  const [queryAllApps, allList, setAllList, allPagination] = useListData(queryApps as any, {
    currentAlias: 'pageIndex',
    pageSize: 20,
  });

  /** 我的应用 */
  const [queryMyApps, myList, setMyList, myPagination] = useListData(queryApps as any, {
    currentAlias: 'pageIndex',
    pageSize: 20,
  });

  const queryAppsWithLoading = useCallback(
    (params: any) => {
      setLoading(true);

      const queryFn = type === 'all' ? queryAllApps : queryMyApps;
      queryFn({
        ...params,
        requestType: type,
      }).finally(() => setLoading(false));
    },
    [queryAllApps, queryMyApps, type],
  );

  useEffect(() => {
    queryAppsWithLoading({
      pageIndex: 1,
      pageSize: 20,
    });
  }, [type]);

  const dataSource = type === 'all' ? allList : myList;
  const pageInfo = type === 'all' ? allPagination : myPagination;

  return (
    <MatrixPageContent className={rootCls}>
      <FilterHeader />
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

        <Spin spinning={loading}>
          <div className={`${rootCls}__card-wrapper`}>
            <ApplicationCardList key={type} dataSource={dataSource} />
            {!!dataSource?.length && pageInfo.total! > pageInfo.pageSize! && (
              <div className={`${rootCls}-pagination-wrap`}>
                <Pagination
                  {...pageInfo}
                  onChange={(page, pageSize) => queryAppsWithLoading({ pageIndex: page, pageSize })}
                  showQuickJumper
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
          queryAppsWithLoading({
            pageIndex: allPagination.current,
            pageSize: allPagination.pageSize,
          });
          setCreateAppVisible(false);
        }}
      />
    </MatrixPageContent>
  );
}
