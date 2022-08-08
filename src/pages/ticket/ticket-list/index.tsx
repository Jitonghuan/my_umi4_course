import React, { useEffect, useState, useCallback } from 'react';
import { Form, message, Alert, Input, Drawer, Button } from 'antd';
import HulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { InlineForm, BasicForm } from '@/components/schema-form';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import ApplyUpload from './apply-upload';

import { queryTicketData, queryTicketType, doCreateTicket } from '../service';
import { getFilterFormSchema, tableSchema, getTicketCreateSchema, defaultChooseType } from './schema';

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
  const [belongData, setBelongData] = useState<IOption[]>([]);
  const [lineData, setLineData] = useState<IOption[]>([]);
  // 工单创建表单对象
  const [createFormRef] = Form.useForm();

  // 类型枚举
  const [typeEnum, setTypeEnum] = useState<IOption[]>([]);
  // 申请项枚举
  const [applyTypeEnum, setApplyTypeEnum] = useState<IOption[]>([]);

  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<any>({});

  // 创建表单中的上传操作
  const [isShowApplyUpload, setisShowApplyUpload] = useState(false);

  // 查询枚举数据
  const queryEnumData = async () => {
    const resp = await getRequest(queryTicketType);
    const { data = {} } = resp;
    const { belong = [], line = [], ...rest } = data || {};

    setBelongData(
      belong.map((el: string) => ({
        label: el,
        value: el,
      })),
    );
    setLineData(
      line.map((el: string) => ({
        label: el,
        value: el,
      })),
    );

    // 类型枚举
    const typeLists = Object.keys(rest).map((el) => ({
      label: el,
      value: el,
      children: rest[el].map((ele: string) => ({
        label: ele,
        value: ele,
      })),
    }));

    setTypeEnum(typeLists);

    const filter = typeLists.find((el) => el.value === defaultChooseType);
    setApplyTypeEnum(filter && filter.children ? filter.children : []);
  };

  // 查询数据
  const {
    run: queryTicketLists,
    tableProps,
    reset,
  } = usePaginated({
    requestUrl: queryTicketData,
    requestMethod: 'GET',
    showRequestError: true,
    // initPageInfo: {
    //   pageSize: 20,
    // },
    pagination: {
      defaultPageSize: 20,
      showSizeChanger: true,
      showTotal: ((total: string) => `总共 ${total} 条数据`) as any,
    },
  });

  // 过滤操作
  const handleFilter = useCallback(
    (vals) => {
      reset();
      setFilter({
        ...filter,
        ...vals,
      });
    },
    [filter],
  );

  // 创建工单
  const handleCreateTicket = async (vals: any) => {
    const { belongs, ticketSubTypes, ...rest } = vals;
    const params = {
      ...rest,
      belongs: JSON.stringify(belongs),
      ticketSubTypes: JSON.stringify(ticketSubTypes),
    };

    const resp = await postRequest(doCreateTicket, {
      data: {
        ...params,
      },
    });

    if (!resp.success) {
      message.error(resp.errorMsg);
      return;
    }

    message.success('新增工单成功');
    setVisible(false);
    queryTicketLists(filter);
    createFormRef.resetFields();
  };

  useEffect(() => {
    queryEnumData();
  }, []);

  useEffect(() => {
    queryTicketLists(filter);
  }, [filter]);

  useEffect(() => {
    const values = createFormRef.getFieldsValue() || {};
    const valueList = Object.keys(values).map((v) => v);
    createFormRef.resetFields([...valueList.filter((v) => v !== 'ticketType')]);
  }, [createFormRef.getFieldValue('ticketType')]);

  // 创建工单表格
  const ticketCreateSchema = getTicketCreateSchema({
    typeEuumData: typeEnum,
    belongEnumData: belongData, // 环境用的是归属数据
    businessEnumData: lineData,
    applyEnumData: applyTypeEnum,
    isShowUpload: isShowApplyUpload,
  });

  return (
    <PageContainer>
      <FilterCard>
        <InlineForm
          className="ticket-filter-form"
          {...(getFilterFormSchema(typeEnum) as any)}
          isShowReset
          onFinish={handleFilter}
          submitText="查询"
          onReset={() => {
            reset();
            setFilter({});
          }}
        />
      </FilterCard>

      <ContentCard>
        <div className="ticket-table-header">
          <h3>工单列表</h3>
          <Button type="primary" onClick={() => setVisible(true)}>
            + 创建工单
          </Button>
        </div>
        <HulkTable columns={tableSchema as any} {...tableProps} />
      </ContentCard>

      <Drawer
        title="创建工单"
        visible={visible}
        onClose={() => {
          setVisible(false);
          createFormRef.resetFields();
        }}
        width={800}
        maskClosable={false}
        className="create-ticket-drawer"
      >
        <BasicForm
          form={createFormRef}
          dataSource={{}}
          {...(ticketCreateSchema as any)}
          customMap={{
            applyTable: ApplyUpload,
            remark: Input.TextArea,
          }}
          isShowReset
          onReset={() => {
            createFormRef.resetFields();
            setisShowApplyUpload(false);
          }}
          onValuesChange={(target: any) => {
            const field = Object.keys(target)[0];
            const value = target[field];
            if (field === 'ticketType') {
              // 类型切换,处理申请项数据
              const filter = typeEnum.find((el) => el.value === value);
              setApplyTypeEnum(filter && filter.children ? filter.children : []);
              setisShowApplyUpload(value === '资源申请');
            }
          }}
          onFinish={handleCreateTicket}
        />

        <div className="ticket-notify">
          <Alert
            type="info"
            message="运维权限申请友情提示"
            showIcon
            description={
              <ul>
                <li>DMS账号 申请来未来阿里云账号</li>
                <li>天台生产相关（RDS/EDAS/MQ）申请天台阿里云账号</li>
                <li>巍山生产相关（RDS/EDAS/MQ）申请巍山阿里云账号</li>
                <li>
                  <b>Jumpserver、Rancher 请先用ldap账号登录一次平台再申请权限</b>
                </li>
                {/* <li>Rancher、VPN、JumpServer 的申请归属选来未来即可，并选择相应业务线</li> */}
                <li>钉钉审批结束后的申请结果会以邮件的形式发送至你的企业邮箱</li>
              </ul>
            }
          />
        </div>
      </Drawer>
    </PageContainer>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;
