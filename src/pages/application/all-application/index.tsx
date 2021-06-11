/**
 * AllApplication
 * @description 全部应用页面
 * @author moting.nq
 * @create 2021-04-08 14:56
 */

import React, { useContext, useEffect, useState } from 'react';
import { Radio, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useListData, useEffectOnce } from 'white-react-use';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
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
  const [queryAllApps, allList, setAllList, allPagination, setAllPagination] =
    useListData(queryApps as any, {
      currentAlias: 'pageIndex',
    });

  const queryAllAppsWithLoading = (...args: any[]) => {
    setLoading(true);
    queryAllApps(...args).finally(() => setLoading(false));
  };

  /** 我的应用 */
  // const [
  //   queryMyApps,
  //   myList,
  //   setMyList,
  //   myPagination,
  //   setMyPagination,
  // ] = useListData(queryApps as any, {
  //   currentAlias: 'pageIndex',
  // });

  useEffectOnce(() => {
    queryAllAppsWithLoading({
      pageIndex: 1,
      pageSize: 20,
    });
    // queryMyApps({
    //   pageIndex: 1,
    //   pageSize: 10,
    // });
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
          queryAllAppsWithLoading({
            pageIndex: allPagination.current,
            pageSize: allPagination.pageSize,
          });
          // queryMyApps({
          //   type: 'my',
          //   pageIndex: myPagination.current,
          //   pageSize: myPagination.pageSize,
          // });
          setCreateAppVisible(false);
        }}
      />

      <Spin spinning={loading}>
        <ContentCard>
          <div className={`${rootCls}__header`}>
            <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
              <Radio.Button value="all">全部应用</Radio.Button>
              {/* TODO 一期先不上我的应用功能 */}
              {/* <Radio.Button value="my">我的应用</Radio.Button> */}
            </Radio.Group>

            <Button type="primary" onClick={() => setCreateAppVisible(true)}>
              <PlusOutlined />
              新增应用
            </Button>
          </div>

          <div className={`${rootCls}__card-wrapper`}>
            <ApplicationCardList
              pagination={{
                // ...(type === 'all' ? allPagination : myPagination),
                ...allPagination,
                onChange: (page, pageSize) => {
                  // const queryFn = type === 'all' ? queryAllApps : queryMyApps;
                  queryAllAppsWithLoading({
                    pageIndex: page,
                    pageSize,
                  });
                },
              }}
              // dataSource={type === 'all' ? allList : myList}
              dataSource={allList}
            />
          </div>
        </ContentCard>
      </Spin>
    </VCPageContent>
  );
};

AllApplication.defaultProps = {};

export default AllApplication;
