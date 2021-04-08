import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { Drawer, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { ColumnProps, TplTable } from '@cffe/fe-tpl';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { InlineForm, BasicForm } from '@cffe/fe-backend-component';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';

import { queryTicketData } from '../service';
import { filterFormSchema, tableSchema, ticketCreateSchema } from './schema';

import './index.less';
import { postRequest, getRequest } from '@/utils/request';

/**
 * 工单列表
 * @description 工单列表页面
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-06 15:15
 */
const Coms = (props: any) => {
  const { location } = props;
  const feContent = useContext(FEContext);

  const [tableData, setTableData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<any>({});

  // 查询数据
  const { run: queryTicketLists, tableProps } = usePaginated({
    requestUrl: queryTicketData,
    requestMethod: 'GET',
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  // 过滤操作
  const handleFilter = useCallback((vals) => {
    console.log(vals);
  }, []);

  // 创建工单 TODO
  const handleCreateTicket = (val: any) => {
    console.log(val);
  };

  useEffect(() => {
    queryTicketLists();
  }, []);

  console.log('tableColumns', tableSchema);

  return (
    <VCPageContent
      height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <FilterCard>
        <InlineForm
          className="ticket-filter-form"
          {...(filterFormSchema as any)}
          isShowReset
          onFinish={handleFilter}
        />
      </FilterCard>

      <ContentCard>
        <div className="ticket-table-header">
          <h3>工单列表</h3>
          <Button type="primary" onClick={() => setVisible(true)}>
            <PlusOutlined />
            创建工单
          </Button>
        </div>
        <HulkTable columns={tableSchema as any} {...tableProps} />
      </ContentCard>

      <Drawer
        title="创建工单"
        visible={visible}
        onClose={() => setVisible(false)}
        width={800}
      >
        <BasicForm
          {...(ticketCreateSchema as any)}
          onFinish={handleCreateTicket}
        />
      </Drawer>
    </VCPageContent>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;
