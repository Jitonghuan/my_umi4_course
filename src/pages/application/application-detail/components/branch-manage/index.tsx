/**
 * BranchManage
 * @description 分支管理
 * @author moting.nq
 * @create 2021-04-20 19:10
 */

import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { Button, message, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { InlineForm } from '@/components/schema-form';
import BranchEditor from './branch-editor';
import { createFilterFormSchema, createTableSchema } from './schema';
import DetailContext from '../../context';
import { queryBranchListUrl, deleteBranch } from '@/pages/application/service';
import './index.less';

const rootCls = 'branch-list-page';

export default function BranchManage() {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const [searchForm] = Form.useForm();

  const [createBranchVisible, setCreateBranchVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 查询数据
  const { run: queryBranchList, tableProps } = usePaginated({
    requestUrl: queryBranchListUrl,
    requestMethod: 'GET',
    showRequestError: true,
    pagination: {
      showSizeChanger: true,
      showTotal: (total: any) => `总共 ${total} 条数据`,
    },
  });

  useEffect(() => {
    if (!appCode) return;
    queryBranchList({ appCode, env: 'feature' });
  }, [appCode]);

  const handleSearch = useCallback(() => {
    const values = searchForm.getFieldsValue();
    queryBranchList({
      pageIndex: 1,
      ...values,
    });
  }, [searchForm]);

  const tableSchema = useMemo(() => {
    return createTableSchema({
      onCancelClick: (record, index) => {
        setLoading(true);
        deleteBranch({ id: record.id })
          .then((res: any) => {
            if (res.success) {
              message.success('操作成功');
              queryBranchList();
              return;
            }
            message.error(res.errorMsg);
          })
          .finally(() => setLoading(false));
      },
    }) as any;
  }, [tableProps]);

  return (
    <>
      <FilterCard>
        <InlineForm
          className={`${rootCls}__filter-form`}
          {...(createFilterFormSchema() as any)}
          submitText="查询"
          onFinish={(values) => {
            if (tableProps.loading) return;
            queryBranchList({
              pageIndex: 1,
              ...values,
            });
          }}
        />
      </FilterCard>

      <ContentCard>
        <Form layout="inline" form={searchForm}>
          <Form.Item label="分支名" name="branchName">
            <Input.Search placeholder="搜索分支名" onSearch={handleSearch} />
          </Form.Item>
        </Form>
        <div className="table-caption">
          <h3>分支列表</h3>
          <Button type="primary" onClick={() => setCreateBranchVisible(true)}>
            <PlusOutlined />
            新建分支
          </Button>
        </div>
        <HulkTable loading={loading} columns={tableSchema} {...tableProps} scroll={{ y: window.innerHeight - 440 }} />

        <BranchEditor
          appCode={appCode!}
          visible={createBranchVisible}
          onSubmit={() => {
            setCreateBranchVisible(false);
            queryBranchList({
              pageIndex: 1,
            });
          }}
          onClose={() => setCreateBranchVisible(false)}
        />
      </ContentCard>
    </>
  );
}
