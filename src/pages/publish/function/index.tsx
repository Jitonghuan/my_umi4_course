import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Button, Form } from 'antd';
import { history } from 'umi';
import TableSearch from '@/components/table-search';
import { OptionProps } from '@/components/table-search/typing';
import MatrixPageContent from '@/components/matrix-page-content';
import './index.less';
import FEContext from '@/layouts/basic-layout/fe-context';
import { deleteFunc, queryAppGroupReq, queryFunctionUrl } from '../service';
import useTable from '@/utils/useTable';
import usePublicData from '@/utils/usePublicData';
import { createFormItems, createTableColumns } from './schema';

const FunctionCom: React.FC = () => {
  const { categoryData = [], envData = [], businessData = [] } = useContext(FEContext);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);

  const [form] = Form.useForm();

  const { envsUrlList } = usePublicData({
    isEnvType: false,
    isUseAppBranch: false,
    isUseAppEnv: false,
    isUseAppLists: false,
    isUseAppType: false,
    isEnvsUrl: true,
  });

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: queryFunctionUrl,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
        preDeployTime: params.preDeployTime ? params.preDeployTime.format('YYYY-MM-DD') : undefined,
        deployTime: params.deployTime ? params.deployTime.format('YYYY-MM-DD') : undefined,
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

  const columns = createTableColumns({
    onDelete,
    categoryData,
    businessData,
    envsUrlList,
  });

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
