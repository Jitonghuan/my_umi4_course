import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Button, Form } from 'antd';
import { history } from 'umi';
import TableSearch from '@/components/table-search';
import { OptionProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import './index.less';
import FEContext from '@/layouts/basic-layout/FeContext';
import { deleteFunc, queryAppGroupReq, queryFunctionUrl } from '../service';
import useTable from '@/utils/useTable';
import { createFormItems, createTableColumns } from './schema';

const FunctionCom: React.FC = () => {
  const { categoryData } = useContext(FEContext);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);

  const [form] = Form.useForm();

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: queryFunctionUrl,
    method: 'GET',
    form,
  });

  const onCategoryChange = (code: string) => {
    form.setFieldsValue({
      appGroupCode: undefined,
    });
    setGroupData([]);
    queryAppGroupReq({
      categoryCode: code,
    }).then((resp) => {
      setGroupData(resp.list);
    });
  };

  const onDelete = (id: string) => {
    deleteFunc({
      funcId: id,
    }).then((resp) => {
      if (resp.success) {
        submit();
      }
    });
  };

  const formOptions = useMemo(() => {
    return createFormItems({
      categoryData,
      onCategoryChange,
      groupData,
    });
  }, [categoryData, groupData]);

  const columns = createTableColumns({ onDelete });

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
          <Button
            type="primary"
            onClick={() => {
              history.push('./function/addFunction');
            }}
          >
            新增发布功能
          </Button>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={tableProps.dataSource.length > 0 ? { x: 1800 } : undefined}
      />
    </MatrixPageContent>
  );
};

export default FunctionCom;
