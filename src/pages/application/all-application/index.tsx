/**
 * AllApplication
 * @description 全部应用页面
 * @author moting.nq
 * @create 2021-04-08 14:56
 */

import React, { useContext, useEffect, useState } from 'react';
import { Radio, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useListData } from 'white-react-use';
import VCPageContent, { ContentCard } from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';
import CreateApplication from '@/components/create-application';
import ApplicationCardList from './application-card-list';
import { queryApps } from '../service';
import { rootCls } from './constants';
import { IProps } from './types';
import './index.less';

const AllApplication = (props: IProps) => {
  const feContent = useContext(FEContext);
  const [type, setType] = useState<'all' | 'my'>('all');
  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 全部应用 */
  const [queryAllApps, allList, setAllList, allPagination, setAllPagination] = useListData(queryApps as any, {
    currentAlias: 'pageIndex',
    pageSize: 20,
  });

  /** 我的应用 */
  const [queryMyApps, myList, setMyList, myPagination, setMyPagination] = useListData(queryApps as any, {
    currentAlias: 'pageIndex',
    pageSize: 20,
  });

  const queryAppsWithLoading = (params: any) => {
    setLoading(true);

    const queryFn = type === 'all' ? queryAllApps : queryMyApps;
    queryFn({ ...params, requestType: type }).finally(() => setLoading(false));
  };

  useEffect(() => {
    queryAppsWithLoading({
      pageIndex: 1,
      pageSize: 20,
    });
  }, [type]);

  return (
    <VCPageContent
      className={rootCls}
      // height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <CreateApplication
        visible={createAppVisible}
        onClose={() => setCreateAppVisible(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求列表
          queryAppsWithLoading({
            pageIndex: allPagination.current,
            pageSize: allPagination.pageSize,
          });
          setCreateAppVisible(false);
        }}
      />

      <Spin spinning={loading}>
        <ContentCard style={{ height: 'calc(100vh - 100px)' }}>
          <div className={`${rootCls}__header`}>
            <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
              <Radio.Button value="all">全部应用</Radio.Button>
              <Radio.Button value="my">我的应用</Radio.Button>
            </Radio.Group>

            <Button type="primary" onClick={() => setCreateAppVisible(true)}>
              <PlusOutlined />
              新增应用
            </Button>
          </div>

          <div className={`${rootCls}__card-wrapper`}>
            <ApplicationCardList
              key={type}
              pagination={{
                ...(type === 'all' ? allPagination : myPagination),
                onChange: (page, pageSize) => {
                  queryAppsWithLoading({
                    pageIndex: page,
                    pageSize,
                  });
                },
              }}
              dataSource={type === 'all' ? allList : myList}
            />
          </div>
        </ContentCard>
      </Spin>
    </VCPageContent>
  );
};

AllApplication.defaultProps = {};

export default AllApplication;
