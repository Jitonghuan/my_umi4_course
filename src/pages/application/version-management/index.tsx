// 版本列表
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/04/21 15:30

import React, { useMemo, useState, useCallback } from 'react';
import { Button, message, Table } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import VersionEditor from './_components/version-editor';
import PageContainer from '@/components/page-container';
import { createTableSchema, VersionRecordItem } from './schema';
import FilterHeader from './_components/filter-header';
import BindAppEditor from './_components/bindApp-editor';
import { useGetVersionList } from './hooks';
import { postRequest } from '@/utils/request';
import './index.less';
import { updateVersion, useUpdateVersion } from './hooks';

export default function VersionList() {
  const [dataSource, pageInfo, setPageInfo, listLoading, loadVersionListData] = useGetVersionList();
  const [createVersionVisible, setCreateVersionVisible] = useState<boolean>(false);
  const [bindAppVisiable, setBindAppVisiable] = useState<boolean>(false);
  const [curRecord, setCurRecord] = useState<VersionRecordItem>();
  const [editLoading, editVersion] = useUpdateVersion();
  const [type, setType] = useState<string>('');
  const handleFilterSearch = useCallback(
    (paramsObj: { versionCode?: string; versionName?: string; appCategoryCode?: string }) => {
      loadVersionListData(paramsObj);
      setPageInfo({
        pageIndex: 1,
      });
    },
    [],
  );

  // 表格列配置
  const tableColumns = useMemo(() => {
    return createTableSchema({
      onEditClick: (record: any, index: any) => {
        setCurRecord(record);
        setCreateVersionVisible(true);
        setType('edit');
      },
      onVeiwClick: (record: any, index: any) => {
        setCurRecord(record);
        setCreateVersionVisible(true);
        setType('view');
      },
      onBindClick: (record: any, index: any) => {
        setCurRecord(record);
        setBindAppVisiable(true);
        setType('bindApp');
      },
      onDisable: (record: any, index: any) => {
        let editParams = { id: record.id, disable: record.disable ? 0 : 1, versionName: record.versionName, desc: record.desc };
        editVersion(editParams).then(() => {
          loadVersionListData();
        });
      },
    }) as any;
  }, [dataSource]);

  return (
    <PageContainer className="version-list-page">
      <FilterHeader onSearch={handleFilterSearch} />

      <ContentCard>
        <div className="table-caption">
          <h3>版本列表</h3>
          <Button
            type="primary"
            onClick={() => {
              setCurRecord(undefined);
              setCreateVersionVisible(true);
              setType('add');
            }}
          >
            + 新增版本
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          loading={listLoading}
          bordered
          rowKey="id"
          pagination={{
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
            current: pageInfo.pageIndex,
            showSizeChanger: true,
            onShowSizeChange: (_, next) => {
              setPageInfo({
                pageIndex: 1,
                pageSize: next,
              });
            },
            onChange: (next) =>
              setPageInfo({
                pageIndex: next,
              }),
            showTotal: () => `总共 ${pageInfo.total} 条数据`,
          }}
          columns={tableColumns}
        ></Table>
      </ContentCard>

      <VersionEditor
        initData={curRecord}
        visible={createVersionVisible}
        onClose={() => setCreateVersionVisible(false)}
        onSubmit={() => {
          loadVersionListData();
          setCreateVersionVisible(false);
        }}
        type={type}
      />
      <BindAppEditor
        initData={curRecord}
        visible={bindAppVisiable}
        onClose={() => setBindAppVisiable(false)}
        onSubmit={() => {
          setBindAppVisiable(false);
        }}
        type={type}
      />
    </PageContainer>
  );
}
