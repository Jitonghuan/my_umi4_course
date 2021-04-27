/**
 * Comp
 * @description 应用列表
 * @author moting.nq
 * @create 2021-04-09 16:53
 */

import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { Form, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffectOnce } from 'white-react-use';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import FEContext from '@/layouts/basic-layout/FeContext';
import { InlineForm } from '@cffe/fe-backend-component';
import { createFilterFormSchema, createTableSchema } from './schema';
import { queryApplysUrl, queryBizDatas } from './service';
import AddDrawer from './components/add-drawer';
import './index.less';

export interface IProps {}

const rootCls = 'release-apply-page';

const ApplyList = (props: IProps) => {
  const { belongData, breadcrumbMap } = useContext(FEContext);

  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [curRecord, setCurRecord] = useState<any>();
  const [businessData, setBusinessData] = useState<any[]>([]);
  const [formInstance] = Form.useForm();

  const prevBelong = useRef<string>();

  const filterColumns = useMemo(() => {
    return createFilterFormSchema({ belongData, businessData });
  }, [belongData, businessData]);

  // 根据所属查询业务线
  const queryBusiness = (belong: string) => {
    queryBizDatas({ belong }).then((datas) => {
      setBusinessData(datas);
    });
  };

  // 查询数据
  const { run: queryAppList, tableProps, reset } = usePaginated({
    requestUrl: queryApplysUrl,
    requestMethod: 'GET',
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  useEffectOnce(() => {
    queryAppList();
  });

  // 监听表单变化，根据所属查询业务线
  const handleChange = useCallback((vals) => {
    const [name, value] = (Object.entries(vals)?.[0] || []) as [string, any];
    if (name && name === 'belong') {
      if (value !== prevBelong.current) {
        formInstance.resetFields(['lineCode']);
      }
      prevBelong.current = value;
      queryBusiness(value);
    }
  }, []);

  return (
    <VCPageContent
      height="calc(100vh - 118px)"
      breadcrumbMap={breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <AddDrawer
        visible={createAppVisible}
        onClose={(reload) => {
          if (reload) {
            queryAppList();
          }
          setCreateAppVisible(false);
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
              setCurRecord(undefined);
              setCreateAppVisible(true);
            }}
          >
            <PlusOutlined />
            提交发布申请
          </Button>
        </div>
        <HulkTable
          columns={
            createTableSchema({
              onDetailClick: (record) => {
                setCurRecord(record);
                setCreateAppVisible(true);
              },
              belongData,
            }) as any
          }
          {...tableProps}
        />
      </ContentCard>
    </VCPageContent>
  );
};

ApplyList.defaultProps = {};

export default ApplyList;
