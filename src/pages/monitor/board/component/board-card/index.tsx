// 应用卡片列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:26

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Spin, Pagination, Empty, Tabs } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import TemplateDrawer from "@/pages/monitor/alarm-rules/_components/template-drawer";
import BoardList from '../card-list';
import FilterHeader from '../filter-header';
import './index.less';
import EditorDrawer from '../editor-drawer';
import { useGrafhTable } from '../../hooks';
import { delGraphTable, getCluster, getCategory } from '../../service';
import type { TMode } from '../../interfaces';
import { Form, Select } from '@cffe/h2o-design';
import { history } from 'umi';
import useRequest from "@/utils/useRequest";
import {createRules} from "@/pages/monitor/basic/services";
const rootCls = 'monitor-board';

export default function Board(props: any) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchParams, setSearchParams] = useState<any>({});
  const [categoryList, setCategoryList] = useState([]);
  const [graphType, setGraphType] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [editDrawer, setEditDrawer] = useState<boolean>(false);

  const [mode, setMode] = useState<TMode>('add');
  const [boardInfo, setBoardInfo] = useState<any>({});
  const [clusterCode, setClusterCode] = useState<number | null>(null);
  const [clusterList, setClusterList] = useState<any>([]);

  const hookParams = useMemo(() => ({ ...searchParams, clusterCode, graphType }), [clusterCode, searchParams, graphType]);
  const [graphTableList, total, isLoading, loadGraphTable] = useGrafhTable(hookParams, pageIndex, pageSize);

  const handleFilterSearch = useCallback((next: any) => {
    setPageIndex(1);
    setSearchParams({
      graphType,
      ...next || {}
    });
  }, []);

  useEffect(() => {
    onCategory();
  }, []);

  const onDrawerClose = () => {
    setEditDrawer(false);
  };

  const onCategory = async () => {
    const res = await getCategory();
    let data = res?.data || [];
    data.unshift('全部');
    setCategoryList(data);
  }

  const handleDelete = async (graphUuId: string) => {
    clusterCode &&
      delGraphTable(clusterCode, graphUuId).then((res) => {
        if (res.success) {
          loadGraphTable();
        }
      });
  };

  const handleEdit = async (record: any) => {
    setMode('edit');
    setEditDrawer(true);
    setBoardInfo(record);
  };

  const handleAdd = () => {
    setEditDrawer(true);
    setMode('add');
  };

  const toAlarmDetail = () => {
    history.push({
      pathname: 'alarm-rules',
      search:'tab=1'
    });
  }

  useEffect(() => {
    getCluster().then((res) => {
      if (res.success) {
        const data = res.data.map((item: any) => {
          return {
            label: item.clusterName,
            value: item.id,
          };
        });
        setClusterList(data);
        const localstorageData = JSON.parse(localStorage.getItem('__monitor_board_cluster_selected') || '{}');
        if (localstorageData?.clusterCode) {
          onClusterChange(localstorageData.clusterCode);
        } else {
          if (data?.[0]?.value) {
            onClusterChange(data?.[0]?.value);
          } else {
            setClusterCode(null);
          }
        }
      }
    });
  }, []);

  const onClusterChange = (value: number) => {
    setClusterCode(value);
    const localstorageData = { clusterCode: value };
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData));
  };

  const toDetail = (data: any) => {
    let clusterName;
    clusterList.forEach((item: any) => {
      if (item.value == clusterCode) {
        clusterName = item.label;
      }
    });
    history.push({
      pathname: 'detail',
      search: `?graphName=${data.graphName}&url=${encodeURIComponent(data.url)}&clusterName=${clusterName}`,
    });
  };

  // 新增规则
  const { run: createRulesFun } = useRequest({
    api: createRules,
    method: 'POST',
    successText: '新增成功',
    isSuccessModal: true,
    onSuccess: () => {
      setDrawerVisible(false);
    },
  });

  return (
    <>
      <FilterCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: 30 }}>
          <div style={{ display: 'flex', }}>
            <Form style={{ marginRight: '10px', }}>
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
          <div>
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            + 新增报警
          </Button>
          <Button type="primary" onClick={toAlarmDetail} style={{margin:'0 10px'}}>
            报警规则
          </Button>
          <Button type="primary" onClick={handleAdd}>
            + 新增大盘
          </Button>
          </div>
        </div>
      </FilterCard>
      <ContentCard className='monitor-content-card'>
        <div className='monitor-content'>
          <Tabs
            defaultActiveKey="0"
            tabPosition="left"
            style={{ height: '100%', width: '120px' }}
            onChange={(key) => {
              const type = Number(key) === 0 ? '' : categoryList[Number(key)];
              setGraphType(type);
              handleFilterSearch({
                ...searchParams,
                graphType: type
              })
            }}
          >
            {
              categoryList.map((item, i) => <Tabs.TabPane tab={item} key={i} />)
            }
          </Tabs>
          <Spin spinning={isLoading}>
            <div className={`${rootCls}__card-wrapper`}>
              {!isLoading && !graphTableList.length && (
                <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
              <BoardList
                dataSource={graphTableList}
                loadGraphTable={loadGraphTable}
                deleteBoard={handleDelete}
                handleEdit={handleEdit}
                toDetail={toDetail}
              />
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
        </div>
        <EditorDrawer
          boardInfo={boardInfo}
          cluster={clusterCode}
          visible={editDrawer}
          clusterList={clusterList}
          mode={mode}
          onClose={onDrawerClose}
          loadGraphTable={loadGraphTable}
        />
        <TemplateDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          drawerTitle="新增告警规则"
          onSubmit={createRulesFun}
          drawerType="rules"
          type="add"
          record={{}}
        />
      </ContentCard>
    </>
  );
}
