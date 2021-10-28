// 上下布局页面 推送页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, message } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { appTypeList, appList, pushAppEnv } from '../service';

export default function PushEnv(props: any) {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [envDataForm] = Form.useForm();
  const [formEnvQuery] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const envCodeCurrent = props.history.location.query.envCode;

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
    },
  };

  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };

  useEffect(() => {
    selectCategory();
    // loadListData({ pageIndex: 1, pageSize: 20 });
    getApplication({ pageIndex: 1, pageSize: 20 });
  }, []);

  //点击查询
  const getApplication = (value: any) => {
    setLoading(true);
    getRequest(appList, {
      data: {
        appCategoryCode: value.appCategoryCode,
        appCode: value.appCode,
        envCode: value.envCode,
        appType: 'backend',
        isClient: 0,
        pageSize: value?.pageSize,
        pageIndex: value?.pageIndex,

        // pageSize: value.pageSize,
      },
    })
      .then((res: any) => {
        if (res.success) {
          const dataSource = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          // let pageIndex = res.data.pageInfo.pageIndex;
          setPageTotal(pageTotal);
          setDataSource(dataSource);
          // setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //点击推送环境
  const pushEnv = () => {
    let appCodes: any = [];
    currentData?.map((item: any) => {
      appCodes.push(item?.appCode);
    });
    postRequest(pushAppEnv, { data: { appCodes, envCode: envCodeCurrent } }).then((res: any) => {
      if (res.success) {
        message.success('推送环境成功！');
      }
    });
  };

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    setPageIndex(pagination.current);
    loadListData(obj);
  };
  const loadListData = (params: any) => {
    const values = formEnvQuery.getFieldsValue();
    getApplication({
      ...values,
      ...params,
    });
  };

  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          form={formEnvQuery}
          onFinish={(values) => {
            getApplication({
              ...values,
              pageIndex: pageIndex,
              pageSize: pageSize,
            });
          }}
          onReset={() => {
            formEnvQuery.resetFields();
            getApplication({
              pageIndex: 1,
            });
          }}
        >
          <Form.Item label="应用分类：" name="appCategoryCode">
            {/* onChange={changeAppCategory}  */}
            <Select showSearch allowClear style={{ width: 140 }} options={categoryData} />
          </Form.Item>
          <Form.Item label="应用CODE：" name="appCode">
            <Input placeholder="请输入应用CODE" style={{ width: 180 }}></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset" danger>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div>
          {/* onFinish={} */}
          <Form form={envDataForm} onFinish={pushEnv}>
            <Form.Item name="tableData">
              <Table
                dataSource={dataSource}
                rowKey="id"
                loading={loading}
                rowSelection={{ ...rowSelection }}
                pagination={{
                  total: pageTotal,
                  pageSize,
                  current: pageIndex,
                  showSizeChanger: true,
                  onShowSizeChange: (_, size) => {
                    setPageSize(size);
                    setPageIndex(1);
                  },
                  showTotal: () => `总共 ${pageTotal} 条数据`,
                }}
                onChange={pageSizeClick}
              >
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="应用名" dataIndex="appName" ellipsis />
                <Table.Column title="应用CODE" dataIndex="appCode" ellipsis />
                <Table.Column title="应用分类" dataIndex="appCategoryCode" />
                <Table.Column title="应用分组" dataIndex="appGroupCode" />
              </Table>
            </Form.Item>
            <Space size="middle" style={{ float: 'right' }}>
              <Form.Item>
                <Button type="ghost" htmlType="reset">
                  清空
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  推送
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
