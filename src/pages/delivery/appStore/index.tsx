// 应用商店页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/28 14:50

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, message, Popconfirm, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

export default function appStore(props: any) {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [categoryCode, setCategoryCode] = useState<any[]>([]); //应用CODE
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [appCodes, setAppCodes] = useState<string>(); //应用Code获取到的值
  const [envCodes, setEnvCodes] = useState<string[]>([]); //环境CODE获取到的值
  const [formTmpl] = Form.useForm();
  const [formTmplQuery] = Form.useForm();
  const [selectList, setSelectList] = useState<any[]>([]);
  const [pageTotal, setPageTotal] = useState<number>();
  const [dataSource, setDataSource] = useState<any[]>([
    {
      key: '1',
      appCode: '8888',
      appName: '安全生产',
      id: '1',
    },
  ]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); //是否显示弹窗
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`,'selectedRows: ', selectedRows);
    },
  };
  // console.log('>>>>>>',currentData);
  const showModal = () => {
    setIsModalVisible(true);
  };
  //删除数据
  const handleDelItem = (record: any) => {
    let id = record.id;
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getApplication({ pageIndex: 1, pageSize: 20 });
  }, []);
  // 根据选择的应用分类查询要推送的环境
  const changeAppCategory = (value: any) => {
    setEnvDatas([{ value: '', label: '' }]);
    setEnvCodes(['']);
    const appCategoryCode = value;
    setAppCategoryCode(appCategoryCode);
  };
  //获取环境的值
  const changeEnvCode = (value: any) => {
    setEnvCodes(value);
  };
  //推送模版 模版Code 应用分类 环境Code 应用Code
  const handleOk = async () => {
    setIsModalVisible(false);
    const templateCode = props.history.location.query.templateCode;
    const appCodes = currentData.map((item, index) => {
      return Object.assign(item.appCode);
    });
    let getEnvCodes = [...envCodes];
  };

  //点击查询
  const getApplication = (value: any) => {
    setLoading(true);
  };
  //触发分页

  const pageSizeClick = (pagination: any, currentDataSource: any) => {
    //加载应用分类
    const selectCategory = () => {};
  };

  const pushTmpls = () => {};
  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          form={formTmplQuery}
          onFinish={(values) => {
            getApplication({
              ...values,
              pageIndex: pageIndex,
              pageSize: pageSize,
            });
          }}
          onReset={() => {
            formTmpl.resetFields();
            getApplication({
              pageIndex: 1,
            });
          }}
        >
          <Form.Item label="名称：" name="appCategoryCode">
            <Select showSearch allowClear style={{ width: 140 }} options={categoryData} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="分类：" name="appCode">
            <Select showSearch allowClear style={{ width: 140 }} options={categoryData} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="交付版本：" name="manage">
            <Select style={{ width: 140 }}></Select>
          </Form.Item>
          <Form.Item label="状态：" name="state">
            <Select style={{ width: 120 }}></Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
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
        <div style={{ marginBottom: '30px' }}>
          <Button type="primary" onClick={showModal} style={{ float: 'right', fontSize: 16, marginRight: '10px' }}>
            应用部署
          </Button>
        </div>
        <div>
          <Form onFinish={pushTmpls} form={formTmpl}>
            <Form.Item name="tableData">
              <Table
                dataSource={dataSource}
                rowKey="id"
                // loading={loading}
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
                <Table.Column title="名称" dataIndex="id" width="14%" />
                <Table.Column title="分类" dataIndex="appName" ellipsis />
                <Table.Column title="交付版本" dataIndex="appCode" ellipsis />
                <Table.Column title="应用版本" dataIndex="appCategoryCode" />
                <Table.Column title="更新时间" dataIndex="appGroupCode" />
                <Table.Column
                  title="操作"
                  dataIndex="gmtModify"
                  key="action"
                  width="18%"
                  render={(text, record: any) => (
                    <Space>
                      <a
                        onClick={() => {
                          history.push('/matrix/delivery/appDetails');
                        }}
                      >
                        详情
                      </a>
                      <a
                        onClick={() => {
                          history.push('/matrix/delivery/updateAppEdition');
                        }}
                      >
                        版本更新
                      </a>
                      <a>下架</a>
                      <Popconfirm title="确定要删除该信息吗？" onConfirm={() => handleDelItem(record)}>
                        <a style={{ color: 'red' }}>删除</a>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
            </Form.Item>
            {selectedRowKeys.length >= 1 && (
              <Space size="middle" style={{ float: 'right' }}>
                <Form.Item>
                  <Button type="ghost" htmlType="reset">
                    清空
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    批量删除
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    批量下架
                  </Button>
                </Form.Item>
              </Space>
            )}
          </Form>
        </div>
        <Modal
          title="你确定要安装以下应用吗？ "
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width="60%"
        >
          <div>
            <span>版本</span>
          </div>
          <div style={{ marginTop: '6px' }}>
            <Table>
              <Table.Column title="应用名称" dataIndex="appCode" />
              <Table.Column title="应用版本" dataIndex="appVersion" />
              <Table.Column title="交付版本" dataIndex="relase" />
            </Table>
          </div>
          <div style={{ marginTop: '4%' }}>
            <span>集群（环境）:</span>
            <div>
              <Select style={{ width: 140 }}></Select>
            </div>
          </div>
          <div style={{ marginTop: '2%', marginBottom: '10%' }}>
            <span>命名空间:</span>
            <div>
              <Select style={{ width: 140 }}></Select>
            </div>
          </div>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}