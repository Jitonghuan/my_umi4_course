/**
 * AllApplication
 * @description 全部应用页面
 * @author moting.nq
 * @create 2021-04-08 14:56
 */

import React, { useContext, useEffect, useState } from 'react';
import { Radio, Button, Card, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useListData, useEffectOnce } from 'white-react-use';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';
import CreateApplication from '@/components/create-application';
import ApplicationCardList from './application-card-list';
import { queryApps } from './service';
import { rootCls } from './constants';
import { IProps } from './types';
import './index.less';

const AllApplication = (props: IProps) => {
  const feContent = useContext(FEContext);
  const [appType, setAppType] = useState<'all' | 'my'>('all');
  const [createAppVisible, setCreateAppVisible] = useState(false);

  /** 全部应用 */
  const [
    queryAllApps,
    allList,
    setAllList,
    allPagination,
    setAllPagination,
  ] = useListData(queryApps as any, {
    currentAlias: 'pageIndex',
  });
  /** 我的应用 */
  const [
    queryMyApps,
    myList,
    setMyList,
    myPagination,
    setMyPagination,
  ] = useListData(queryApps as any, {
    currentAlias: 'pageIndex',
  });

  useEffectOnce(() => {
    queryAllApps({
      type: 'all',
      pageIndex: 1,
      pageSize: 10,
    });
    queryMyApps({
      type: 'my',
      pageIndex: 1,
      pageSize: 10,
    });
  });

  return (
    <VCPageContent
      className={rootCls}
      height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <CreateApplication
        visible={createAppVisible}
        onClose={() => setCreateAppVisible(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求列表
          queryAllApps({
            type: 'all',
            pageIndex: allPagination.current,
            pageSize: allPagination.pageSize,
          });
          queryMyApps({
            type: 'my',
            pageIndex: myPagination.current,
            pageSize: myPagination.pageSize,
          });
          setCreateAppVisible(false);
        }}
      />

      <ContentCard>
        <div className={`${rootCls}__header`}>
          <Radio.Group
            value={appType}
            onChange={(e) => setAppType(e.target.value)}
          >
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
            pagination={{
              ...(appType === 'all' ? allPagination : myPagination),
              onChange: (page, pageSize) => {
                const queryFn = appType === 'all' ? queryAllApps : queryMyApps;
                queryFn({
                  type: appType,
                  pageIndex: page,
                  pageSize,
                });
              },
            }}
            dataSource={appType === 'my' ? allList : myList}
          />
        </div>
      </ContentCard>
    </VCPageContent>
  );
};

AllApplication.defaultProps = {};

export default AllApplication;
