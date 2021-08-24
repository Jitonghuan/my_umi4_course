/**
 * ApplicationList
 * @description 应用列表
 * @author moting.nq
 * @create 2021-04-09 16:53
 */

import React, { useMemo, useState, useCallback, useContext } from 'react';
import { Button, message, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import ApplicationEditor from '../_components/application-editor';
import FEContext from '@/layouts/basic-layout/fe-context';
import MatrixPageContent from '@/components/matrix-page-content';
import { createTableSchema } from './schema';
import { deleteApp } from '../service';
import { useAppListData } from '../hooks';
import FilterHeader from '../_components/filter-header';
import './index.less';

export default function ApplicationList() {
  const { categoryData = [], businessData: businessDataList = [] } = useContext(FEContext);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();
  const [appListData, total, isLoading, loadAppListData] = useAppListData(searchParams, pageIndex, pageSize);
  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [curRecord, setCurRecord] = useState<any>();

  const handleFilterSearch = useCallback((next: any) => {
    setPageIndex(1);
    setSearchParams(next);
  }, []);

  // 表格列配置
  const tableColumns = useMemo(() => {
    return createTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setCreateAppVisible(true);
      },
      onDelClick: async (record, index) => {
        await deleteApp({ appCode: record.appCode, id: record.id });
        message.success('删除成功');
        loadAppListData();
      },
      categoryData,
      businessDataList,
    }) as any;
  }, [categoryData, businessDataList]);

  return (
    <MatrixPageContent>
      <FilterHeader onSearch={handleFilterSearch} />

      <ContentCard>
        <div className="table-caption">
          <h3>应用列表</h3>
          <Button
            type="primary"
            onClick={() => {
              setCurRecord(undefined);
              setCreateAppVisible(true);
            }}
          >
            <PlusOutlined />
            新增应用
          </Button>
        </div>
        <Table
          dataSource={appListData}
          loading={isLoading}
          pagination={{
            pageSize,
            total,
            current: pageIndex,
            showSizeChanger: true,
            onShowSizeChange: (_, next) => {
              setPageIndex(1);
              setPageSize(next);
            },
            onChange: (next) => setPageIndex(next),
          }}
          columns={tableColumns}
        ></Table>
      </ContentCard>

      <ApplicationEditor
        formValue={curRecord}
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
