import React, { useState, useContext, useMemo } from 'react';
import { Button, Space, Form } from 'antd';
import { history } from 'umi';
import TableSearch from '@/components/table-search';
import { OptionProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';
import { IPlanItem } from '../typing';
import useTable from '@/utils/useTable';
import {
  deletePublishPlanReq,
  queryAppGroupReq,
  queryPublishPlanUrl,
  queryFunctionUrl,
} from '../service';
import { createFormColumns, createTableColumns } from './schema';

import './index.less';

const FunctionCom: React.FC = () => {
  const { categoryData } = useContext(FEContext);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);

  const [form] = Form.useForm();

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: queryPublishPlanUrl,
    method: 'GET',
    form,
    formatResult: (result) => {
      return {
        total: result.data?.pageInfo?.total,
        list: result.data?.dataSource?.map((el: any) => ({ ...el.plan })) || [],
      };
    },
  });

  const onCategoryChange = (code: string) => {
    form.setFieldsValue({
      appGroupCode: undefined,
    });
    setGroupData([]);
    queryAppGroupReq({
      categoryCode: code,
    }).then((resp) => {
      setGroupData(
        resp.list.map((el: any) => {
          return {
            ...el,
            key: el.value,
            value: el.label,
          };
        }),
      );
    });
  };

  const onDelete = (planId: string) => {
    deletePublishPlanReq({ planId }).then((resp) => {
      if (resp.success) {
        submit();
      }
    });
  };

  const formOptions = useMemo(() => {
    return createFormColumns({
      categoryData,
      onCategoryChange,
      groupData,
    });
  }, [categoryData, groupData]);

  const columns = useMemo(() => {
    return createTableColumns({ onDelete });
  }, []);

  return (
    <MatrixPageContent>
      <TableSearch
        form={form}
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          // defaultPageSize: 20,
        }}
        extraNode={
          <Space>
            <Button
              type="primary"
              ghost
              onClick={() => {
                // history.push(`${ds.pagePrefix}/release/plan/addFunctionModify`);
                history.push('./plan/addFunctionModify');
              }}
            >
              新增功能变更
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => {
                // history.push(`${ds.pagePrefix}/release/plan/addConfigModify`);
                history.push('./plan/addConfigModify');
              }}
            >
              新增配置变更
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => {
                // history.push(`${ds.pagePrefix}/release/plan/addDatabaseModify`);
                history.push('./plan/addDatabaseModify');
              }}
            >
              新增数据库变更
            </Button>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={{ x: 2000 }}
        searchText="查询"
      />
    </MatrixPageContent>
  );
};

export default FunctionCom;
