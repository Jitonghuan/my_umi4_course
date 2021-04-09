import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { Input, Drawer, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { TplSimpleForm } from '@cffe/fe-tpl';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import HulkForm from '@cffe/vc-hulk-form';
import { InlineForm, BasicForm } from '@cffe/fe-backend-component';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import ApplyUpload from './apply-upload';
import FEContext from '@/layouts/basic-layout/FeContext';

import { queryTicketData, queryTicketType } from '../service';
import { filterFormSchema, tableSchema, getTicketCreateSchema } from './schema';

import './index.less';
import { postRequest, getRequest } from '@/utils/request';

type IOption = { label: string; value: string; children?: IOption[] };

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
  const { envData = [], businessData = [] } = feContent;

  // 类型枚举
  const [typeEnum, setTypeEnum] = useState<IOption[]>([]);
  // 申请项枚举
  const [applyTypeEnum, setApplyTypeEnum] = useState<IOption[]>([]);

  const [tableData, setTableData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<any>({});

  // 创建表单中的上传操作
  const [isShowApplyUpload, setisShowApplyUpload] = useState(false);

  // 查询枚举数据
  const queryEnumData = async () => {
    const resp = await getRequest(queryTicketType);
    const { data = {} } = resp;

    // 类型枚举
    const typeLists = Object.keys(data).map((el) => ({
      label: el,
      value: el,
      children: data[el].map((ele: string) => ({
        label: ele,
        value: ele,
      })),
    }));

    setTypeEnum(typeLists);
  };

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
    queryEnumData();
    queryTicketLists();
  }, []);

  // 创建工单表格
  const ticketCreateSchema = useMemo(() => {
    return getTicketCreateSchema({
      typeEuumData: typeEnum,
      envEnumData: envData,
      businessEnumData: businessData,
      applyEnumData: applyTypeEnum,
      isShowUpload: isShowApplyUpload,
    });
  }, [envData, businessData, typeEnum, applyTypeEnum, isShowApplyUpload]);

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
          dataSource={{
            type: '资源申请',
          }}
          {...(ticketCreateSchema as any)}
          customMap={{
            applyTable: ApplyUpload,
            remark: Input.TextArea,
          }}
          isShowReset
          onValuesChange={(target: any) => {
            const field = Object.keys(target)[0];
            const value = target[field];
            if (field === 'type') {
              // 类型切换,处理申请项数据
              const filter = typeEnum.find((el) => el.value === value);
              setApplyTypeEnum(
                filter && filter.children ? filter.children : [],
              );
              setisShowApplyUpload(value === '运维权限申请');
            }
          }}
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
