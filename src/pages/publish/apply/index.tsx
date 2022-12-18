/**
 * Comp
 * @description 发布申请
 * @author moting.nq
 * @create 2021-04-09 16:53
 */

import React, { useMemo, useEffect, useState, useCallback, useContext, useRef } from 'react';
import { Form, Button } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { FeContext } from '@/common/hooks';
import { InlineForm } from '@/components/schema-form';
import usePublicData from '@/utils/usePublicData';
import { createFilterFormSchema, createTableSchema } from './schema';
import AddDrawer from './components/add-drawer';
import DetailDrawer from './components/detail-drawer';
import './index.less';
import { queryApplysUrl, queryAppGroupReq } from '../service';

const rootCls = 'release-apply-page';

export default function ApplyList() {
  const { categoryData = [], businessData: businessDataList = [] } = useContext(FeContext);

  const [createApplyVisible, setCreateApplyVisible] = useState<boolean>(false);
  const [applyDetailVisible, setApplyDetailVisible] = useState<boolean>(false);
  const [curRecord, setCurRecord] = useState<any>();
  const [businessData, setBusinessData] = useState<any[]>([]);
  const [formInstance] = Form.useForm();

  const prevBelong = useRef<string>();

  const { envsUrlList } = usePublicData({
    isEnvType: false,
    isUseAppBranch: false,
    isUseAppEnv: false,
    isUseAppLists: false,
    isUseAppType: false,
    isEnvsUrl: true,
  });

  const filterColumns = useMemo(() => {
    return createFilterFormSchema({ categoryData, businessData });
  }, [categoryData, businessData]);

  // 根据所属查询业务线
  const queryBusiness = (categoryCode: string) => {
    setBusinessData([]);
    queryAppGroupReq({ categoryCode }).then((datas) => {
      setBusinessData(datas.list);
    });
  };

  // 查询数据
  const {
    run: queryAppList,
    tableProps,
    reset,
  } = usePaginated({
    requestUrl: queryApplysUrl,
    requestMethod: 'GET',
    pagination: {
      defaultPageSize: 20,
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
    formatRequestParams: (params) => {
      return {
        ...params,
        deployDate: params.deployDate ? params.deployDate.format('YYYY-MM-DD') : undefined,
      };
    },
  });

  useEffect(() => {
    queryAppList();
  }, []);

  // 监听表单变化，根据所属查询业务线
  const handleChange = useCallback((vals) => {
    const [name, value] = (Object.entries(vals)?.[0] || []) as [string, any];
    if (name && name === 'appCategoryCode') {
      if (value !== prevBelong.current) {
        formInstance.resetFields(['appGroupCode']);
      }
      prevBelong.current = value;
      if (value !== undefined) {
        queryBusiness(value);
      } else {
        setBusinessData([]);
      }
    }
  }, []);

  return (
    <PageContainer>
      <AddDrawer
        visible={createApplyVisible}
        onClose={(reload) => {
          if (reload) {
            queryAppList();
          }
          setCreateApplyVisible(false);
        }}
        envsUrlList={envsUrlList}
      />

      <DetailDrawer
        id={curRecord?.id || ''}
        visible={applyDetailVisible}
        onClose={() => {
          setApplyDetailVisible(false);
        }}
        categoryData={categoryData}
        businessDataList={businessDataList}
        envsUrlList={envsUrlList}
        onSave={()=>{
          queryAppList();
          //setApplyDetailVisible(false);
        }}
      />

      <FilterCard>
        <InlineForm
          form={formInstance}
          className={`${rootCls}__filter-form`}
          {...(filterColumns as any)}
          submitText="查询"
          onValuesChange={handleChange}
          onFinish={(values) => {
            if (tableProps.loading) return;
            reset();
            queryAppList({
              pageIndex: 1,
              ...values,
            });
          }}
          onReset={() => {
            if (tableProps.loading) return;
            formInstance.resetFields();
            setBusinessData([]);
            reset();
            queryAppList({
              pageIndex: 1,
            });
          }}
        />
      </FilterCard>

      <ContentCard>
        <div className={`${rootCls}__table-header`}>
          <h3>发布申请列表</h3>
          <Button
            type="primary"
            onClick={() => {
              setCreateApplyVisible(true);
            }}
          >
            + 提交发布申请
          </Button>
        </div>
        <HulkTable
          columns={
            createTableSchema({
              onDetailClick: (record) => {
                setCurRecord(record);
                setApplyDetailVisible(true);
              },
              categoryData,
              businessDataList,
              envsUrlList,
            }) as any
          }
          {...tableProps}
        />
      </ContentCard>
    </PageContainer>
  );
}
