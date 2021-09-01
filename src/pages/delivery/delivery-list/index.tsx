// 交付列表页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/28 14:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
export default function deliveryList() {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([
    {
      key: '1',
      templateName: '8888',
      appName: '应用模版',
      templateCode: 'xuxu',
      appCategoryCode: 'xiniuyiliao',
      envCode: '天台',
      id: '1',
    },
  ]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [envCode, setenvCode] = useState<any>(); //环境的值
  const [templateType, setTemplateType] = useState<any>(); //模版类型
  const [templateName, setTemplateName] = useState<any>(); //模版名称的值
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formTmpl] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [showDrawVisible, setShowDrawVisible] = useState<boolean>(true); //是否展示抽屉
  const pageSizeClick = () => {};
  //删除数据
  const handleDelItem = (record: any) => {
    let id = record.id;
  };
  return (
    <PageContainer>
      <FilterCard>
        <Form layout="inline" form={formTmpl}>
          <Form.Item label="发布名称：" name="appCategoryCode">
            <Input placeholder="单行输入"></Input>
          </Form.Item>
          <Form.Item label="分类：" name="envCode">
            <Select
              options={envDatas}
              allowClear
              onChange={(n) => {
                setenvCode(n);
              }}
              showSearch
              style={{ width: 140 }}
            />
          </Form.Item>
          <Form.Item label="交付版本：" name="templateType">
            <Select
              showSearch
              allowClear
              style={{ width: 140 }}
              options={templateTypes}
              onChange={(n) => {
                setTemplateType(n);
              }}
            />
          </Form.Item>
          <Form.Item label=" 状态：" name="templateName">
            <Select style={{ width: 120 }} options={categoryData} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: 16 }}>应用发布详情</span>
          <Button
            type="primary"
            style={{ float: 'right', fontSize: 16, marginRight: '10px' }}
            onClick={() => {
              history.push('/matrix/delivery/appStore');
            }}
          >
            应用商店
          </Button>
        </div>
        <div>
          <Table
            dataSource={dataSource}
            bordered
            loading={loading}
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
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          >
            <Table.Column title="发布名称" dataIndex="id" width="8%" />
            <Table.Column title="发布环境" dataIndex="templateName" width="12%" ellipsis />
            <Table.Column title="交付版本" dataIndex="templateCode" width="20%" ellipsis />
            <Table.Column title="应用名称" dataIndex="templateType" width="15%" />
            <Table.Column title="应用版本" dataIndex="appCategoryCode" width="15%" />
            <Table.Column title="更新时间" dataIndex="envCode" width="12%" />
            <Table.Column title="状态" dataIndex="envCode" width="10%" />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="8%"
              key="action"
              render={(_, index) => (
                <Space size="small">
                  <a>下线</a>
                  <Popconfirm title="确定要删除该信息吗？" onConfirm={() => handleDelItem}>
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
