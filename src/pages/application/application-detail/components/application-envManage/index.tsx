// 环境管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/10/25 11:14

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Input, Table, Popconfirm, Form, Button, Select, Switch, Modal, message } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import { datetimeCellRender } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import { appTypeList, listAppEnv, addAppEnv, delAppEnv, queryEnvList } from '@/pages/application/service';

export default function appEnvPageList() {
  const { appData } = useContext(DetailContext);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [appEnvDataSource, setAppEnvDataSource] = useState<Record<string, any>[]>([]);
  const [envDataSource, setEnvDataSource] = useState<Record<string, any>[]>([]); //查看modal弹窗环境信息
  const [categoryData, setCategoryData] = useState<any[]>([]); //默认分类
  const [total, setTotal] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false); //是否显示弹窗
  const [checkedOption, setCheckedOption] = useState<boolean>();
  const [EnvForm] = Form.useForm();
  const [appEnvForm] = Form.useForm();
  const { appCode } = appData || {};
  const envTypeData = [
    {
      label: 'DEV',
      value: 'dev',
    },
    {
      label: 'TEST',
      value: 'test',
    },
    {
      label: 'PRE',
      value: 'pre',
    },
    {
      label: 'PROD',
      value: 'prod',
    },
  ]; //环境大类

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
    queryAppEnvData(appCode);
  }, []);
  //确认推送环境

  const handleOk = () => {
    let envCodes: any = [];
    selectedRows?.map((item: any) => {
      envCodes.push(item?.envCode);
    });
    postRequest(addAppEnv, { data: { appCode, envCodes: envCodes } })
      .then((res: any) => {
        if (res.success) {
          message.success('绑定环境成功！');
        }
      })
      .finally(() => {
        queryAppEnvData(appCode);
      });
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // 查询应用环境数据
  const queryAppEnvData = (value: any) => {
    setLoading(true);
    getRequest(listAppEnv, {
      data: {
        appCode,
        envTypeCode: value?.envTypeCode,
        envCode: value?.envCode,
        envName: value?.envName,
        categoryCode: value?.categoryCode,
      },
    })
      .then((result) => {
        if (result?.success) {
          setAppEnvDataSource(result?.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //删除数据
  const handleDelEnv = (record: any) => {
    postRequest(delAppEnv, { data: { appCode, envCode: record.envCode } }).then((res: any) => {
      if (res.success) {
        message.success('删除成功！');
        queryAppEnvData({
          appCode,
        });
      }
    });
  };
  //查看modal弹窗环境信息
  const queryEnvData = (value: any) => {
    setLoading(true);
    getRequest(queryEnvList, {
      data: {
        envTypeCode: value?.envTypeCode,
        envCode: value?.envCode,
        envName: value?.envName,
        categoryCode: value?.categoryCode,
        pageIndex: value?.pageIndex,
        pageSize: value?.pageSize,
      },
    })
      .then((result) => {
        if (result?.success) {
          let pageTotal = result.data.pageInfo.total;
          // let pageIndex = result.data.pageInfo.pageIndex;
          setEnvDataSource(result?.data?.dataSource);
          setTotal(pageTotal);
          // setPageCurrentIndex(pageIndex);
          if (result?.data?.dataSource?.useNacos === 1) {
            setCheckedOption(true);
          } else {
            setCheckedOption(false);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PageContainer>
      <ContentCard>
        <Modal
          title="请选择要绑定的环境"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={900}
          bodyStyle={{ height: '500px' }}
        >
          <Form
            layout="inline"
            form={EnvForm}
            onFinish={(values: any) => {
              setPageIndex(1);
              queryEnvData({
                ...values,
                pageIndex: 1,
                pageSize: 10,
              });
            }}
            onReset={() => {
              EnvForm.resetFields();

              queryEnvData({
                pageIndex: 1,
                // pageSize: pageSize,
              });
            }}
          >
            <Form.Item label="环境大类" name="envTypeCode">
              <Select showSearch style={{ width: 150 }} options={envTypeData} />
            </Form.Item>
            <Form.Item label="默认分类：" name="categoryCode">
              <Select showSearch style={{ width: 120 }} options={categoryData} />
            </Form.Item>
            <Form.Item label=" 环境CODE：" name="envCode">
              <Input placeholder="请输入环境CODE"></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: '25px' }}>
            <Table
              dataSource={envDataSource}
              loading={loading}
              rowSelection={{
                selectedRowKeys,
                onChange: (next, selectedRows) => {
                  setSelectedRowKeys(next);
                  setSelectedRows(selectedRows);
                },
              }}
              rowKey="id"
              pagination={{
                current: pageIndex,
                total,
                pageSize,
                showSizeChanger: true,
                onChange: (next) => {
                  setPageIndex(next);
                  const values = EnvForm.getFieldsValue();
                  queryEnvData({
                    ...values,
                    pageIndex: next,
                    pageSize: pageSize,
                  });
                },
                onShowSizeChange: (_, next) => {
                  setPageSize(next);
                  queryEnvData({
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                  });
                },
              }}
            >
              <Table.Column title="环境大类" dataIndex="envTypeCode" width={200} />
              <Table.Column title="环境CODE" dataIndex="envCode" ellipsis />
              <Table.Column title="环境名" dataIndex="envName" ellipsis />
              <Table.Column title="默认分类" dataIndex="categoryCode" width={120} />
              <Table.Column
                title="是否启用配置管理"
                dataIndex="useNacos"
                width={180}
                render={(_, record, index) => <Switch checked={checkedOption} disabled={true} />}
              />
            </Table>
          </div>
        </Modal>
        <div>
          <Form
            layout="inline"
            form={appEnvForm}
            onFinish={(values: any) => {
              queryAppEnvData({
                ...values,
              });
            }}
            onReset={() => {
              appEnvForm.resetFields();
              queryAppEnvData({
                appCode,
              });
            }}
          >
            <Form.Item label="默认分类：" name="categoryCode">
              <Select showSearch style={{ width: 120 }} options={categoryData} />
            </Form.Item>
            <Form.Item label="环境大类：" name="envTypeCode">
              <Select options={envTypeData} allowClear showSearch style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="环境名：" name="envName">
              <Input placeholder="请输入环境名"></Input>
            </Form.Item>
            <Form.Item label=" 环境CODE：" name="envCode">
              <Input placeholder="请输入环境CODE"></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
                重置
              </Button>
            </Form.Item>
            <div style={{ marginLeft: '32px' }}>
              <Button
                type="primary"
                onClick={() => {
                  EnvForm.resetFields();
                  //  appEnvForm.setFieldsValue(undefined)
                  setIsModalVisible(true);
                  let obj = { pageIndex: 1, pageSize: 10 };
                  queryEnvData(obj);
                  setSelectedRowKeys(['undefined']);
                }}
              >
                <PlusOutlined />
                绑定环境
              </Button>
            </div>
          </Form>
        </div>
        <div style={{ marginTop: '15px' }}>
          <Table dataSource={appEnvDataSource} loading={loading} rowKey="id" pagination={false}>
            <Table.Column title="ID" dataIndex="id" width={60} />
            <Table.Column title="环境名" dataIndex="envName" width={150} />
            <Table.Column title="环境CODE" dataIndex="envCode" width={150} />
            <Table.Column title="环境大类" dataIndex="envTypeCode" width={140} />
            <Table.Column title="默认分类" dataIndex="categoryCode" width={120} />
            <Table.Column title="备注" dataIndex="mark" width={180} />
            <Table.Column
              title="操作"
              width={120}
              render={(_, record: Record<string, any>, index) => (
                <div className="action-cell">
                  <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelEnv(record)}>
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
