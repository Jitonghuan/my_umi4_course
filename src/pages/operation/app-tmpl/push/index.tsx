// 上下布局页面 推送页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, message, Modal } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { history } from 'umi';
import { stringify } from 'qs';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';

export default function Push(porps: any) {
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
    if (appCategoryCode) {
      setIsModalVisible(true);
    } else {
      message.error('请选择要推送的应用分类');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    selectCategory();
    getApplication({ pageIndex: 1, pageSize: 20 });
  }, []);
  // 根据选择的应用分类查询要推送的环境
  const changeAppCategory = (value: any) => {
    setEnvDatas([{ value: '', label: '' }]);
    setEnvCodes(['']);
    const appCategoryCode = value;
    setAppCategoryCode(appCategoryCode);
    getRequest(APIS.envList, { data: { categoryCode: appCategoryCode } }).then((resp: any) => {
      if (resp.success) {
        const datas =
          resp?.data?.dataSource?.map((el: any) => {
            return {
              ...el,
              value: el?.envCode,
              label: el?.envName,
            };
          }) || [];
        setEnvDatas(datas);
      }
    });
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
    if (appCategoryCode && envCodes) {
      await postRequest(APIS.pushTmpl, {
        data: { appCategoryCode: appCategoryCode, templateCode, appCodes, envCodes: getEnvCodes },
      }).then((resp: any) => {
        if (resp.success) {
          message.success('推送成功！');
          window.location.reload();
        }
      });
    } else {
      message.error('请选择要推送的应用分类');
    }
  };

  //点击查询
  const getApplication = (value: any) => {
    setLoading(true);
    getRequest(APIS.appList, {
      data: {
        appCategoryCode: value.appCategoryCode,
        appCode: value.appCode,
        envCode: value.envCode,
        appType: 'backend',
        isClient: 0,
        pageSize: value.pageSize,
        pageIndex: value.pageIndex,

        // pageSize: value.pageSize,
      },
    })
      .then((res: any) => {
        if (res.success) {
          // console.log('.......',res.data)
          const dataSource = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;

          setPageTotal(pageTotal);
          setDataSource(dataSource);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //触发分页

  const pageSizeClick = (pagination: any, currentDataSource: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    setPageIndex(pagination.current);
    getApplication(obj);
    console.log('pagination.current:', pagination.current, pagination.pageSize);
    setSelectList(currentDataSource);
  };

  //加载应用分类
  const selectCategory = () => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };

  const pushTmpls = () => {};
  return (
    <MatrixPageContent>
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
          <Form.Item label="应用分类：" name="appCategoryCode" rules={[{ required: true, message: '这是必选项' }]}>
            <Select showSearch allowClear style={{ width: 140 }} options={categoryData} onChange={changeAppCategory} />
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
          <Form onFinish={pushTmpls} form={formTmpl}>
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
                <Table.Column
                  title="操作"
                  dataIndex="gmtModify"
                  key="action"
                  render={(text, record: any) => (
                    <Space size="large">
                      <a
                        onClick={() => {
                          const query = {
                            appCode: record.appCode,
                            templateType: record.templateType,
                            envCode: record.envCode,
                            categoryCode: record.categoryCode,
                            isClient: 0,
                            isContainClient: 0,
                            id: record.id,
                          };
                          history.push(`/matrix/application/detail/AppParameters?${stringify(query)}`);
                        }}
                      >
                        当前应用参数
                      </a>
                    </Space>
                  )}
                />
              </Table>
            </Form.Item>
            <Space size="middle" style={{ float: 'right' }}>
              <Form.Item>
                <Button type="ghost" htmlType="reset">
                  清空
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={showModal}>
                  推送
                </Button>
              </Form.Item>
            </Space>
          </Form>
          <Modal title="请选择推送环境" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form>
              <Form.Item label="环境：" name="envCodes" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  showSearch
                  allowClear
                  style={{ width: 160 }}
                  mode="multiple"
                  placeholder="请选择"
                  onChange={changeEnvCode}
                  // defaultValue={['a10', 'c12']}
                  options={envDatas}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
