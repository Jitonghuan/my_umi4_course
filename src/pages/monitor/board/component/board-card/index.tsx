// 应用卡片列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:26

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Spin, Pagination, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import BoardList from '../card-list';
import FilterHeader from '../filter-header';
import './index.less';
import EditorDrawer from '../editor-drawer';
import { useGrafhTable } from '../../hooks';
import { delGraphTable } from '../../service';
import type { TMode } from '../../interfaces';

const rootCls = 'monitor-board';


export default function Board(props: any) {
  const { cluster } = props;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchParams, setSearchParams] = useState<any>({});

  const hookParams = useMemo(() => ({ ...searchParams, clusterCode: cluster }), [cluster, searchParams]);
  const [graphTableList, total, isLoading, loadGraphTable] = useGrafhTable(hookParams, pageIndex, pageSize, cluster);

  const [editDrawer, setEditDrawer] = useState<boolean>(false)

  const [mode, setMode] = useState<TMode>('add')
  const [boardInfo, setBoardInfo] = useState<any>({})

  const handleFilterSearch = useCallback((next: any) => {
    setPageIndex(1);
    setSearchParams(next);
  }, []);

  const onDrawerClose = () => {
    setEditDrawer(false)
  }

  const handleDelete = async (graphUuId: string) => {
    delGraphTable(cluster, graphUuId).then((res) => {
      if (res.success) {
        loadGraphTable()
      }
    })
  }

  const handleEdit = async (record: any) => {
    setMode('edit')
    setEditDrawer(true)
    setBoardInfo(record)
  }

  const handleAdd = () => {
    setEditDrawer(true)
    setMode('add')
  }

  return (
    <>
      <FilterHeader onSearch={handleFilterSearch} searchParams={searchParams} />
      <ContentCard>
        <div className="table-caption">
          <Button type="primary" onClick={handleAdd}>
            <PlusOutlined />
            新增大盘
          </Button>
        </div>

        <Spin spinning={isLoading}>
          <div className={`${rootCls}__card-wrapper`}>
            {!isLoading && !graphTableList.length && (
              <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <BoardList cluster={cluster} dataSource={graphTableList} loadGraphTable={loadGraphTable} deleteBoard={handleDelete} handleEdit={handleEdit} />
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
        <EditorDrawer boardInfo={boardInfo} cluster={cluster} visible={editDrawer} mode={mode} onClose={onDrawerClose} loadGraphTable={loadGraphTable} />
      </ContentCard>
    </>
  );
}
