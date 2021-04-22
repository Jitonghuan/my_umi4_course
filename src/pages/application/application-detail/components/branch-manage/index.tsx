/**
 * BranchManage
 * @description 分支管理
 * @author moting.nq
 * @create 2021-04-20 19:10
 */

import React, { useState, useContext } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffectOnce } from 'white-react-use';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { InlineForm } from '@cffe/fe-backend-component';
import EditBranch from './edit-branch';
import { createFilterFormSchema, createTableSchema } from './schema';
import { queryBranchListUrl, deleteBranch } from '../../../service';
import { rootCls } from './constants';
import { IProps } from './types';
import './index.less';

const BranchManage = ({
  location: {
    query: { appCode, id },
  },
}: IProps) => {
  const [createBranchVisible, setCreateBranchVisible] = useState(false);

  // 查询数据
  const { run: queryBranchList, tableProps } = usePaginated({
    requestUrl: queryBranchListUrl,
    requestMethod: 'GET',
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  useEffectOnce(() => {
    queryBranchList({ appCode });
  });

  return (
    <>
      <EditBranch
        appCode={appCode}
        visible={createBranchVisible}
        onSubmit={() => {
          setCreateBranchVisible(false);
          queryBranchList({
            pageIndex: 1,
          });
        }}
        onClose={() => setCreateBranchVisible(false)}
      />

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
        <div className={`${rootCls}__table-header`}>
          <h3>分支列表</h3>
          <Button
            type="primary"
            onClick={() => {
              setCreateBranchVisible(true);
            }}
          >
            <PlusOutlined />
            新建分支
          </Button>
        </div>
        <HulkTable
          columns={
            createTableSchema({
              onCancelClick: (record, index) => {
                deleteBranch({ id: record.id }).then((res: any) => {
                  if (res.success) {
                    message.success('操作成功');
                    queryBranchList();
                    return;
                  }
                  message.error(res.errorMsg);
                });
              },
            }) as any
          }
          {...tableProps}
        />
      </ContentCard>
    </>
  );
};

BranchManage.defaultProps = {};

export default BranchManage;
