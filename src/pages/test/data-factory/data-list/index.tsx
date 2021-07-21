import React, { useContext, useCallback, useState } from 'react';
import { Form, Table, Button, Input, Select, DatePicker, Checkbox, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import FELayout from '@cffe/vc-layout';
import FEContext from '@/layouts/basic-layout/fe-context';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import MatrixPageContent from '@/components/matrix-page-content';
import usePublicData from '@/utils/usePublicData';
import DetailModal from '@/components/detail-modal';
import { useTableData } from './hooks';
import './index.less';

const { Item: FormItem } = Form;

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '创建中', color: 'blue' },
  2: { text: '失败', color: 'volcano' },
  1: { text: '成功', color: 'green' },
};

export default function DataFactoryList(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { categoryData = [] } = useContext(FEContext);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchField] = Form.useForm();
  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
  });
  const [searchParams, setSearchParams] = useState<any>();
  const [tableData, total, loading] = useTableData(searchParams, pageIndex, pageSize);

  const handleSearch = useCallback(() => {
    const { createTime, ...others } = searchField.getFieldsValue();
    setSearchParams({
      ...others,
      startTime: createTime && createTime[0] ? `${createTime[0].format('YYYY-MM-DD')} 00:00:00` : undefined,
      endTime: createTime && createTime[1] ? `${createTime[1].format('YYYY-MM-DD')} 23:59:59` : undefined,
    });
    setPageIndex(1);
  }, [searchField]);

  const handleReset = useCallback(() => {
    searchField.resetFields();
    const nextValues = searchField.getFieldsValue();
    setSearchParams(nextValues);
    setPageIndex(1);
  }, [searchField]);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="records" history={props.history} />
      <ContentCard>
        <Form form={searchField} layout="inline">
          <FormItem label="项目" name="project">
            <Select options={appTypeData} placeholder="请选择" style={{ width: 120 }} onChange={handleSearch} />
          </FormItem>
          <FormItem label="环境" name="env">
            <Select
              options={envListType}
              placeholder="请选择"
              style={{ width: 120 }}
              onChange={handleSearch}
              allowClear
            />
          </FormItem>
          <FormItem label="模板名称" name="factoryName">
            <Input placeholder="请输入" style={{ width: 120 }} />
          </FormItem>
          <FormItem label="创建时间" name="createTime">
            <DatePicker.RangePicker style={{ width: 240 }} />
          </FormItem>
          <FormItem label="" name="createUser">
            <Checkbox.Group options={[{ label: '我的数据', value: userInfo.userName! }]} onChange={handleSearch} />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={handleSearch} style={{ marginRight: 12 }}>
              查询
            </Button>
            <Button type="default" onClick={handleReset}>
              重置
            </Button>
          </FormItem>
        </Form>

        <div className="table-caption">
          <h3></h3>
          <Button type="primary" onClick={() => props.history.push('./add')} icon={<PlusOutlined />}>
            新增数据
          </Button>
        </div>

        <Table
          dataSource={tableData}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            showTotal: (total) => `共 ${total} 条`,
            pageSize,
            showSizeChanger: true,
            onShowSizeChange: (_, size) => {
              setPageIndex(1);
              setPageSize(size);
            },
            onChange: (next) => setPageIndex(next),
          }}
        >
          <Table.Column dataIndex="id" title="序号" width={90} />
          <Table.Column
            dataIndex="response"
            title="数据明细"
            width={200}
            render={(text) => {
              if (!text || (typeof text === 'object' && Object.keys(text).length === 0)) return '';
              return (
                <Tooltip title={JSON.stringify(text)}>
                  <span style={{ width: 100 }} className="ellipsis-span">
                    {JSON.stringify(text)}
                  </span>
                </Tooltip>
              );
            }}
          />
          <Table.Column dataIndex="factoryName" title="模板名称" />
          <Table.Column dataIndex="env" title="环境" />
          <Table.Column
            dataIndex="project"
            title="项目"
            render={(value) => {
              const result = categoryData?.filter((el) => el.value === value);
              return result?.length ? result[0].label : value || '';
            }}
          />
          <Table.Column
            dataIndex="gmtCreate"
            title="创建时间"
            render={(value) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '')}
          />
          <Table.Column dataIndex="createUser" title="创建人" />
          <Table.Column
            dataIndex="params"
            title="创建参数"
            render={(text) => {
              if (!text || (typeof text === 'object' && Object.keys(text).length === 0)) return '';
              return (
                <Tooltip title={JSON.stringify(text)}>
                  <span style={{ width: 100 }} className="ellipsis-span">
                    {JSON.stringify(text)}
                  </span>
                </Tooltip>
              );
            }}
          />
          <Table.Column
            dataIndex="status"
            title="状态"
            render={(text: number) => <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].text}</Tag>}
          />
          <Table.Column dataIndex="errorLog" title="日志" render={(value: string) => <DetailModal data={value} />} />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
