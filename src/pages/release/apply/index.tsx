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
} from 'react';
import { Drawer, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffectOnce } from 'white-react-use';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import CreateApplication from '@/components/create-application';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import FEContext from '@/layouts/basic-layout/FeContext';
import { InlineForm } from '@cffe/fe-backend-component';
import { createFilterFormSchema, createTableSchema } from './schema';
import { queryApplysUrl } from './service';
import './index.less';
import ColorContainer from '_@cffe_fe-datav-components@0.1.8@@cffe/fe-datav-components/es/components/utils/color-util/Context';

export interface IProps {}

const rootCls = 'release-apply-page';

const Comp = (props: IProps) => {
  const { belongData, businessData, breadcrumbMap } = useContext(FEContext);

  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [curRecord, setCurRecord] = useState<any>();

  // 查询数据
  const { run: queryAppList, tableProps } = usePaginated({
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
        <ColorContainer roleKeys={['color']}>
          <HulkTable
            columns={
              createTableSchema({
                onDetailClick: (record) => {
                  setCurRecord(record);
                  setCreateAppVisible(true);
                },
              }) as any
            }
            {...tableProps}
          />
        </ColorContainer>
      </ContentCard>
    </VCPageContent>
  );
};

Comp.defaultProps = {};

export default Comp;
