// 版本管理页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/31 11:32

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Tag, Popconfirm, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { addAPIPrefix } from '@/utils';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import versionManage from 'mock/versionManage';

export default function appStore(porps: any) {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [versionManageData, setVersionManageData] = useState<any[]>([]);
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
  type statusTypeItem = {
    tagText: string;
    color: string;
    status: number;
  };

  const STATUS_TYPE: Record<number, statusTypeItem> = {
    1: { tagText: '已上架', color: 'green', status: 2 },
    2: { tagText: '未上架', color: 'default', status: 1 },
  };
  const versionList = () => {
    getRequest(addAPIPrefix('/deliverManage/versionManage/list')).then((result) => {
      const source = result?.data?.dataSource;
      setVersionManageData(source);
    });
  };
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
    versionList(), getApplication({ pageIndex: 1, pageSize: 20 });
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
    const templateCode = porps.history.location.query.templateCode;
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
          <Form.Item label="应用名称：" name="appCategoryCode" rules={[{ required: true, message: '这是必选项' }]}>
            <Input style={{ width: 140 }} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="分类：" name="appCode">
            <Select showSearch allowClear style={{ width: 140 }} options={categoryData} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="应用版本：" name="manage">
            <Select style={{ width: 140 }}></Select>
          </Form.Item>
          <Form.Item label="状态：" name="status">
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
          <Button
            type="primary"
            style={{ float: 'right', fontSize: 16, marginRight: '10px' }}
            onClick={() => {
              history.push('/matrix/delivery/createAppEdition');
            }}
          >
            创建新版本
          </Button>
        </div>
        <div>
          <Form onFinish={pushTmpls} form={formTmpl}>
            <Form.Item name="tableData">
              <Table
                dataSource={versionManageData}
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
                <Table.Column title="id" dataIndex="id" />
                <Table.Column title="应用名称" dataIndex="appCode" ellipsis />
                <Table.Column title="分类" dataIndex="category" ellipsis />
                <Table.Column title="应用版本" dataIndex="appVsersion" />
                <Table.Column title="更新时间" dataIndex="gmtModify" />
                <Table.Column
                  title="状态"
                  dataIndex="status"
                  render={(text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.tagText}</Tag>}
                  ellipsis
                />
                <Table.Column
                  title="操作"
                  dataIndex="gmtModify"
                  key="action"
                  render={(text, record: any) => (
                    <Space size="large">
                      <a onClick={showModal}>上架</a>
                      <Popconfirm title="确定要删除该信息吗？" onConfirm={() => handleDelItem(record)}>
                        <a style={{ color: 'red' }}>删除</a>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
            </Form.Item>
            <Space size="middle" style={{ float: 'right' }}>
              <Form.Item>
                <Button type="ghost" htmlType="reset">
                  重置
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  批量上架
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </div>
        <Modal
          title="你确定要上架以下应用吗？ "
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width="60%"
        >
          <div>
            <Table>
              <Table.Column title="应用名称" dataIndex="appCode" />
              <Table.Column title="应用版本" dataIndex="appVersion" />
              <Table.Column title="更新日志" dataIndex="relase" />
            </Table>
          </div>
          <div style={{ marginTop: '4%', marginBottom: '10%' }}>
            <span>请输入生产的交付版本号:</span>
            <div>
              {' '}
              <Input style={{ width: 220 }} placeholder="请输入"></Input>
            </div>
          </div>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
