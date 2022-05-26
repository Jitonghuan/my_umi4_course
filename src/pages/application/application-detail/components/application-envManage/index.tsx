// 环境管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/10/25 11:14

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Input, Table, Popconfirm, Form, Button, Select, Switch, Modal, message, Tag } from '@cffe/h2o-design';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import './index.less';
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
  const [addLoading, setAddLoading] = useState<boolean>(false);
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
  const proEnvTypeData = [
    {
      label: '项目环境',
      value: 'project',
    },
    {
      label: '基准环境',
      value: 'benchmark',
    },
  ]; //项目环境分类选择
  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(appTypeList).then((result) => {
      const list = (result?.data?.dataSource || []).map((n: any) => ({
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
    setAddLoading(true);
    let envCodes: any = [];
    selectedRows?.map((item: any) => {
      envCodes.push(item?.envCode);
    });
    postRequest(addAppEnv, { data: { appCode, envCodes: envCodes } })
      .then((res: any) => {
        if (res.success) {
          message.success('绑定环境成功！');
          setIsModalVisible(false);
        }
      })
      .then(() => {
        queryAppEnvData(appCode);
      })
      .finally(() => {
        setAddLoading(false);
      });
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
        proEnvType: value?.proEnvType,
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
    postRequest(delAppEnv, { data: { appCode, envCode: record.envCode, proEnvType: record.proEnvType } }).then(
      (res: any) => {
        if (res.success) {
          message.success('删除成功！');
          queryAppEnvData({
            appCode,
          });
        }
      },
    );
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
          let pageIndex = result.data.pageInfo.pageIndex;
          setEnvDataSource(result?.data?.dataSource);
          setTotal(pageTotal);
          setPageIndex(pageIndex);
          setPageSize(result.data.pageInfo.pageSize);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    loadListData(obj);
  };

  const loadListData = (params: any) => {
    const values = EnvForm.getFieldsValue();
    queryEnvData({
      ...values,
      ...params,
    });
  };
  return (
    <ContentCard className="app-env-management">
      <Modal
        title="请选择要绑定的环境"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        bodyStyle={{ height: '580px' }}
        footer={
          <div className="drawer-footer">
            <Button
              type="primary"
              loading={addLoading}
              onClick={() => {
                handleOk();
              }}
            >
              绑定
            </Button>
            <Button
              type="default"
              onClick={() => {
                handleCancel();
              }}
            >
              取消
            </Button>
          </div>
        }
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
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1); //
              },
              showTotal: () => `总共 ${total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="环境大类" dataIndex="envTypeCode" width={200} />
            <Table.Column title="环境CODE" dataIndex="envCode" ellipsis />
            <Table.Column title="环境名" dataIndex="envName" ellipsis />
            <Table.Column title="默认分类" dataIndex="categoryCode" width={120} />
            <Table.Column
              title="是否启用配置管理"
              dataIndex="useNacos"
              width={180}
              render={(value, record, index) => (
                <Switch className="useNacos" checked={value === 1 ? true : false} disabled={true} />
              )}
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
          <Form.Item label="项目环境分类：" name="proEnvType">
            <Select showSearch style={{ width: 130 }} options={proEnvTypeData} />
          </Form.Item>
          <Form.Item label="环境大类：" name="envTypeCode">
            <Select options={envTypeData} allowClear showSearch style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="环境名：" name="envName">
            <Input placeholder="请输入环境名" style={{ width: 140 }}></Input>
          </Form.Item>
          <Form.Item label=" 环境CODE：" name="envCode">
            <Input placeholder="请输入环境CODE" style={{ width: 140 }}></Input>
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
          <div style={{ marginLeft: '18px' }}>
            <Button
              type="primary"
              onClick={() => {
                EnvForm.resetFields();
                //  appEnvForm.setFieldsValue(undefined)
                setIsModalVisible(true);
                let obj = { pageIndex: 1, pageSize: 10 };
                queryEnvData(obj);
                setSelectedRowKeys(['undefined']);
                setPageIndex(1);
              }}
            >
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
          <Table.Column
            title="项目环境分类"
            dataIndex="proEnvType"
            width={140}
            render={(value, record: any, index) => (
              <span>
                {value === 'benchmark' ? <Tag color="geekblue">基准环境</Tag> : <Tag color="green">项目环境</Tag>}
              </span>
            )}
          />
          <Table.Column title="默认分类" dataIndex="categoryCode" width={140} />
          <Table.Column title="备注" dataIndex="mark" width={180} />
          <Table.Column
            title="操作"
            width={120}
            render={(_, record: Record<string, any>, index) => (
              <div className="action-cell">
                <Popconfirm title="确定要解绑该环境吗？" onConfirm={() => handleDelEnv(record)}>
                  <a style={{ color: 'red' }}>解绑</a>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </div>
    </ContentCard>
  );
}
