// 应用卡片列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:26

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Spin, Pagination, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import BoardList from '../card-list';
import FilterHeader from '../filter-header';
import './index.less';
import EditorDrawer from '../editor-drawer';
import { useGrafhTable } from '../../hooks';
import { delGraphTable, getCluster } from '../../service';
import type { TMode } from '../../interfaces';
import { Form, Select } from '@cffe/h2o-design';

const rootCls = 'monitor-board';


export default function Board(props: any) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchParams, setSearchParams] = useState<any>({});

  const [editDrawer, setEditDrawer] = useState<boolean>(false)

  const [mode, setMode] = useState<TMode>('add')
  const [boardInfo, setBoardInfo] = useState<any>({})
  const [clusterCode, setClusterCode] = useState<number | null>(null)
  const [clusterList, setClusterList] = useState<any>([])

  const hookParams = useMemo(() => ({ ...searchParams, clusterCode }), [clusterCode, searchParams]);
  const [graphTableList, total, isLoading, loadGraphTable] = useGrafhTable(hookParams, pageIndex, pageSize);

  const handleFilterSearch = useCallback((next: any) => {
    setPageIndex(1);
    setSearchParams(next);
  }, []);

  const onDrawerClose = () => {
    setEditDrawer(false)
  }

  const handleDelete = async (graphUuId: string) => {
    clusterCode && delGraphTable(clusterCode, graphUuId).then((res) => {
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

  useEffect(() => {
    getCluster().then((res) => {
      if (res.success) {
        const data = res.data.map((item: any) => {
          return {
            label: item.clusterName,
            value: item.id
          }
        })
        setClusterList(data);
        const localstorageData = JSON.parse(localStorage.getItem('__monitor_board_cluster_selected') || '{}')
        if (localstorageData?.clusterCode) {
          onClusterChange(localstorageData.clusterCode)
        } else {
          if(data?.[0]?.value){
            onClusterChange(data?.[0]?.value)
          }else{
            setClusterCode(null)
          }
        }
      }
    })
  }, [])

  const onClusterChange = (value: number) => {
    setClusterCode(value)
    const localstorageData = { clusterCode: value }
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData))
  }

  return (
    <>
      <FilterCard>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <Form style={{ marginRight: '10px' }}>
              <Form.Item label="集群选择">
                <Select
                  clearIcon={false}
                  style={{ width: '250px' }}
                  options={clusterList}
                  value={clusterCode}
                  onChange={onClusterChange}
                />
              </Form.Item>
            </Form>
            <FilterHeader onSearch={handleFilterSearch} searchParams={searchParams} />
          </div>
          <Button type="primary" onClick={handleAdd}>
            <PlusOutlined />
            新增大盘
          </Button>
        </div>
      </FilterCard>
      <ContentCard>
        <Spin spinning={isLoading}>
          <div className={`${rootCls}__card-wrapper`}>
            {!isLoading && !graphTableList.length && (
              <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <BoardList dataSource={graphTableList} loadGraphTable={loadGraphTable} deleteBoard={handleDelete} handleEdit={handleEdit} />
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
        <EditorDrawer boardInfo={boardInfo} cluster={clusterCode} visible={editDrawer} mode={mode} onClose={onDrawerClose} loadGraphTable={loadGraphTable} />
      </ContentCard>
    </>
  );
}
