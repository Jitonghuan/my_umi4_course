import React, { useState, useContext, useMemo, useRef } from 'react';
import { Button, Form, message } from '@cffe/h2o-design';
import { history } from 'umi';
import TableSearch from '@/components/table-search';
import { OptionProps } from '@/components/table-search/typing';
import PageContainer from '@/components/page-container';
import './index.less';
import { FeContext } from '@/common/hooks';
import { deleteFunc, queryAppGroupReq, queryFunctionUrl, getExportPublishFunctionLink } from '../service';
import useTable from '@/utils/useTable';
import usePublicData from '@/utils/usePublicData';
import { createFormItems, createTableColumns } from './schema';

const FunctionCom: React.FC = () => {
  const { categoryData = [], envTypeData = [], businessData = [] } = useContext(FeContext);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);
  // 用于在点击导出时传参
  const lastSearchRef = useRef<any>();

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
      const query = {
        ...params,
        preDeployTime: params.preDeployTime ? params.preDeployTime.format('YYYY-MM-DD') : undefined,
        deployTime: params.deployTime ? params.deployTime.format('YYYY-MM-DD') : undefined,
      };
      lastSearchRef.current = query;
      return query;
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
    <PageContainer>
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
          <>
            <Button type="primary" onClick={() => history.push('./function/addFunction')}>
              新增发布功能
            </Button>
            <Button
              type="primary"
              ghost
              target="_blank"
              download
              href={getExportPublishFunctionLink(lastSearchRef.current)}
            >
              导出数据
            </Button>
          </>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={tableProps.dataSource.length > 0 ? { x: 1800 } : undefined}
      />
    </PageContainer>
  );
};

export default FunctionCom;
