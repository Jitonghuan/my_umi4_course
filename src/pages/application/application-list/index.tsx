/**
 * ApplicationList
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
} from 'react';
import { Drawer, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffectOnce } from 'white-react-use';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import CreateApplication from '@/components/create-application';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import FEContext from '@/layouts/basic-layout/FeContext';
import { InlineForm, BasicForm } from '@cffe/fe-backend-component';
import { createFilterFormSchema, createTableSchema } from './schema';
import { queryAppsUrl, deleteApp } from '../service';
import { rootCls } from './constants';
import { IProps } from './types';
import './index.less';

const ApplicationList = (props: IProps) => {
  const { belongData, businessData, envData, breadcrumbMap } = useContext(
    FEContext,
  );

  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [curRecord, setCurRecord] = useState<any>();

  // 查询数据
  const { run: queryAppList, tableProps } = usePaginated({
    requestUrl: queryAppsUrl,
    requestMethod: 'GET',
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  useEffectOnce(() => {
    queryAppList();
  });

  return (
    <VCPageContent
      height="calc(100vh - 118px)"
      breadcrumbMap={breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <CreateApplication
        formValue={curRecord}
        visible={createAppVisible}
        onClose={() => setCreateAppVisible(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求列表
          queryAppList();
          setCreateAppVisible(false);
        }}
      />

      <FilterCard>
        <InlineForm
          className={`${rootCls}__filter-form`}
          {...(createFilterFormSchema({ belongData, businessData }) as any)}
          submitText="查询"
          onFinish={(values) => {
            if (tableProps.loading) return;
            queryAppList({
              pageIndex: 1,
              ...values,
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
        <HulkTable
          columns={
            createTableSchema({
              onEditClick: (record, index) => {
                setCurRecord(record);
                setCreateAppVisible(true);
              },
              onDelClick: (record, index) => {
                deleteApp({ appCode: record.appCode }).then((res) => {
                  if (res.success) {
                    message.success('删除成功');
                    queryAppList();
                  }
                });
              },
            }) as any
          }
          {...tableProps}
        />
      </ContentCard>
    </VCPageContent>
  );
};

ApplicationList.defaultProps = {};

export default ApplicationList;
