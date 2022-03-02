// 环境管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/10/25 11:14

import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Input, Table, Popconfirm, Form, Button, Select, Switch, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { getRequest, delRequest, putRequest } from '@/utils/request';
import AddEnvDraw from '../addEnv';
import { queryEnvList, appTypeList, deleteEnv, updateEnv } from '../service';
import appConfig from '@/app.config';
import './index.less';

/** 编辑页回显数据 */
export interface EnvEditData extends Record<string, any> {
  envTypeCode: string;
  envName: string;
  envCode: string;
  categoryCode: string;
  mark: any;
  isBlock: number;
  useNacos: number;
  nacosAddress: string;
  clusterName: string;
  clusterType: string;
  clusterNetType: string;
  ngInstCode: string;
  proEnvType: string;
}

export default function envManageList(props: any) {
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageCurrentIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [envDataSource, setEnvDataSource] = useState<Record<string, any>[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [total, setTotal] = useState<number>(0);
  const [addEnvMode, setAddEnvMode] = useState<EditorMode>('HIDE');
  const [EnvForm] = Form.useForm();
  const [initEnvData, setInitEnvData] = useState<any>([]); //初始化数据
  const [ngModalVisiable, setNgModalVisiable] = useState<boolean>(false);
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
  useEffect(() => {
    selectCategory();
  }, []);

  useEffect(() => {
    let obj = { pageIndex: 1, pageSize: 20 };
    queryEnvData(obj);
  }, []);

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

  const handleAddEnv = () => {
    setAddEnvMode('ADD');
  };

  const handleEditEnv = useCallback(
    (record: EnvEditData, index: number, type) => {
      setInitEnvData(record);
      setAddEnvMode(type);
      setEnvDataSource(envDataSource);
    },
    [envDataSource],
  );

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
        proEnvType: value?.proEnvType,
      },
    })
      .then((result) => {
        if (result?.success) {
          let pageTotal = result.data.pageInfo.total;
          let pageIndex = result.data.pageInfo.pageIndex;
          setEnvDataSource(result?.data?.dataSource);
          setTotal(pageTotal);
          setPageCurrentIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
        // setPageCurrentIndex(1);
      });
  };

  //触发分页
  const pageSizeClick = (pagination: any) => {
    //  setPageIndexInfo(pagination.current);
    setPageCurrentIndex(pagination.current);
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
    // setPageCurrentIndex(pageIndex);
  };

  //删除数据
  const handleDelEnv = (record: any) => {
    let id = record.id;
    delRequest(`${appConfig.apiPrefix}/appManage/env/delete/${record.envCode}`);
    // message.success('删除成功！');
    loadListData({
      pageIndex: 1,
      pageSize: 20,
    });
  };

  let useNacosData: number;
  let isBlockData: number;
  let needApplyData: number;
  //启用配置管理选择 启用发布审批为0，不启用为1
  const handleNeedApplyChange = async (checked: any, record: any) => {
    if (checked === 0) {
      needApplyData = 1;
    } else {
      needApplyData = 0;
    }
    await putRequest(updateEnv, {
      data: {
        envCode: record?.envCode,
        useNacos: record?.useNacos,
        isBlock: record.isBlock,
        needApply: needApplyData,
      },
    }).then((result) => {
      if (result.success) {
        message.success('更改成功！');
      } else {
        message.error(result.errorMsg);
      }
    });
    loadListData({
      pageIndex: 1,
      pageSize: 20,
    });
  };

  //启用配置管理选择
  const handleNacosChange = async (checked: any, record: any) => {
    if (checked === 0) {
      useNacosData = 1;
    } else {
      useNacosData = 0;
    }
    if (record.nacosAddress !== '') {
      await putRequest(updateEnv, {
        data: {
          envCode: record?.envCode,
          useNacos: useNacosData,
          isBlock: record.isBlock,
          needApply: record.needApply,
        },
      }).then((result) => {
        if (result.success) {
          message.success('更改成功！');
        } else {
          message.error(result.errorMsg);
        }
      });
      loadListData({
        pageIndex: 1,
        pageSize: 20,
      });
    } else {
      message.warning('请先检查Nacos地址是否为空！');
    }
  };
  //是否封网
  const isBlockChange = async (checked: any, record: any) => {
    if (checked === 0) {
      isBlockData = 1;
    } else {
      isBlockData = 0;
    }
    await putRequest(updateEnv, {
      data: {
        envCode: record?.envCode,
        // envName: record?.envName,
        useNacos: record?.useNacos,
        isBlock: isBlockData,
        needApply: record.needApply,
      },
    }).then((result) => {
      if (result.success) {
        message.success('更改成功！');
      } else {
        message.error(result.errorMsg);
      }
    });
    loadListData({
      pageIndex: 1,
      pageSize: 20,
    });
  };

  return (
    <PageContainer className="env-list-content">
      <Modal></Modal>
      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={EnvForm}
            onFinish={(values: any) => {
              queryEnvData({
                ...values,
                pageIndex: 1,
                pageSize: 20,
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
            <Form.Item label="默认分类：" name="categoryCode">
              <Select showSearch style={{ width: 130 }} options={categoryData} />
            </Form.Item>
            <Form.Item label="环境大类：" name="envTypeCode">
              <Select options={envTypeData} allowClear showSearch style={{ width: 130 }} />
            </Form.Item>
            <Form.Item label="环境名：" name="envName">
              <Input placeholder="请输入环境名称" style={{ width: 130 }} />
            </Form.Item>
            <Form.Item label=" 环境CODE：" name="envCode">
              <Input placeholder="请输入环境CODE" style={{ width: 130 }}></Input>
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
        </div>
      </FilterCard>
      <ContentCard>
        <AddEnvDraw
          mode={addEnvMode}
          initData={initEnvData}
          onSave={() => {
            setAddEnvMode('HIDE');
            setTimeout(() => {
              queryEnvData({ pageIndex: 1, pageSize: 20 });
            }, 100);
          }}
          onClose={() => setAddEnvMode('HIDE')}
        />
        <div className="table-caption">
          <div className="caption-left">
            <h3>环境列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setInitEnvData(undefined);
                setAddEnvMode('ADD');
              }}
            >
              <PlusOutlined />
              新增环境
            </Button>
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <Table
            dataSource={envDataSource}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pageIndex,
              total,
              pageSize,
              showSizeChanger: true,
              // onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageCurrentIndex(1); //
              },
              showTotal: () => `总共 ${total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width={50} />
            <Table.Column title="环境名" dataIndex="envName" width={150} />
            <Table.Column title="环境CODE" dataIndex="envCode" width={130} />
            <Table.Column title="环境大类" dataIndex="envTypeCode" width={90} />
            <Table.Column title="默认分类" dataIndex="categoryCode" width={130} />
            <Table.Column title="备注" dataIndex="mark" width={200} />
            <Table.Column
              title="启用发布审批"
              dataIndex="needApply"
              width={110}
              render={(value, record, index) => (
                <Switch
                  className="needApply"
                  onChange={() => handleNeedApplyChange(value, record)}
                  checked={value === 0 ? true : false}
                />
              )}
            />
            <Table.Column
              title="启用配置管理"
              dataIndex="useNacos"
              width={110}
              render={(value, record, index) => (
                <Switch
                  className="useNacos"
                  onChange={() => handleNacosChange(value, record)}
                  checked={value === 1 ? true : false}
                />
              )}
            />
            <Table.Column
              title="封网"
              dataIndex="isBlock"
              width={80}
              render={(value, record, index) => (
                <Switch
                  className="isBlock"
                  onChange={() => isBlockChange(value, record)}
                  checked={value === 1 ? true : false}
                />
              )}
            />
            <Table.Column
              title="NG配置"
              dataIndex="ngInstCode"
              width={140}
              render={(value: string, record: EnvEditData, index) =>
                value ? (
                  <a
                    onClick={() => {
                      setNgModalVisiable(true);
                    }}
                  >
                    {value}
                  </a>
                ) : (
                  '---'
                )
              }
            />
            <Table.Column
              title="操作"
              width={180}
              render={(_, record: EnvEditData, index) => (
                <div className="action-cell">
                  <a onClick={() => handleEditEnv(record, index, 'VIEW')}>查看</a>

                  <a onClick={() => handleEditEnv(record, index, 'EDIT')}>编辑</a>
                  <a
                    onClick={() => {
                      history.push({
                        pathname: '/matrix/operation/env-manage/push-env',
                        query: {
                          envCode: record.envCode,
                        },
                      });
                    }}
                  >
                    推送
                  </a>
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
