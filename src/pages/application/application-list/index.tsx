/**
 * ApplicationList
 * @description 应用列表
 * @author moting.nq
 * @create 2021-04-09 16:53
 */

import React, { useMemo, useEffect, useState, useCallback, useContext } from 'react';
import { Form, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import CreateApplication from '../_components/create-application';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import FEContext from '@/layouts/basic-layout/fe-context';
import { InlineForm } from '@/components/schema-form';
import { queryBizData } from '@/layouts/basic-layout/service';
import { getRequest } from '@/utils/request';
import MatrixPageContent from '@/components/matrix-page-content';
import { createFilterFormSchema, createTableSchema } from './schema';
import { queryAppsUrl, deleteApp } from '../service';
import './index.less';

const rootCls = 'application-list-page';

export default function ApplicationList() {
  const { categoryData = [], businessData: businessDataList = [] } = useContext(FEContext);
  const [businessData, setBusinessData] = useState<any[]>([]);
  const [formInstance] = Form.useForm();

  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [curRecord, setCurRecord] = useState<any>();

  const filterColumns = useMemo(() => {
    return createFilterFormSchema({ categoryData, businessData });
  }, [categoryData, businessData]);

  // 根据应用分类查询应用组
  const queryBusiness = useCallback((categoryCode: string) => {
    setBusinessData([]);
    getRequest(queryBizData, {
      data: { categoryCode },
    }).then((resp: any) => {
      if (resp.success) {
        const datas =
          resp.data?.dataSource?.map((el: any) => ({
            ...el,
            value: el?.groupCode,
            label: el?.groupName,
          })) || [];

        setBusinessData(datas);
      }
    });
  }, []);

  // 查询数据
  const {
    run: queryAppList,
    tableProps,
    reset,
  } = usePaginated({
    requestUrl: queryAppsUrl,
    requestMethod: 'GET',
    showRequestError: true,
    pagination: {
      defaultPageSize: 20,
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  // 监听表单变化，根据应用分类查询应用组
  const handleChange = useCallback((vals) => {
    const [name, value] = (Object.entries(vals)?.[0] || []) as [string, any];
    if (name && name === 'appCategoryCode') {
      formInstance.resetFields(['appGroupCode']);
      queryBusiness(value);
    }
  }, []);

  useEffect(() => {
    queryAppList();
  }, []);

  // 表格列配置
  const tableColumns = useMemo(() => {
    return createTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setCreateAppVisible(true);
      },
      onDelClick: (record, index) => {
        deleteApp({ appCode: record.appCode, id: record.id }).then((res) => {
          if (res.success) {
            message.success('删除成功');
            queryAppList();
          }
        });
      },
      categoryData,
      businessDataList,
    }) as any;
  }, [categoryData, businessDataList]);

  return (
    <MatrixPageContent isFlex>
      <FilterCard>
        <InlineForm
          form={formInstance}
          className={`${rootCls}__filter-form`}
          {...(filterColumns as any)}
          submitText="查询"
          onValuesChange={handleChange}
          onFinish={(values) => {
            if (tableProps.loading) return;
            queryAppList({
              pageIndex: 1,
              ...values,
            });
          }}
          onReset={() => {
            if (tableProps.loading) return;
            const { pageSize = 10 } = tableProps.pagination as any;
            formInstance.resetFields();
            reset();
            queryAppList({
              pageIndex: 1,
              pageSize: pageSize,
            });
          }}
        />
      </FilterCard>

      <ContentCard>
        <div className={`${rootCls}__table-header`}>
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
        <HulkTable className={`${rootCls}__table-body`} columns={tableColumns} {...tableProps} />
      </ContentCard>

      <CreateApplication
        formValue={curRecord}
        visible={createAppVisible}
        onClose={() => setCreateAppVisible(false)}
        onSubmit={() => {
          queryAppList();
          setCreateAppVisible(false);
        }}
      />
    </MatrixPageContent>
  );
}
