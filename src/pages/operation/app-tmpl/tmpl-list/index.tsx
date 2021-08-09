// 上下布局页面 应用模版页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { history } from 'umi';
import { useEffectOnce } from 'white-react-use';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import { tmplList } from '../service';

export default function Launch() {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
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
  useEffectOnce(() => {
    queryList({ pageIndex: 1, pageSize: 20 });
    selectCategory();
    selectTmplType();
  });

  // 加载应用分类下拉选择
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

  //加载模版类型下拉选择
  const selectTmplType = () => {
    getRequest(APIS.tmplType).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: n,
        value: n,
        data: n,
      }));
      setTemplateTypes(list);
    });
  };

  // 根据应用分类查询环境
  const changeAppCategory = (categoryCode: string) => {
    //调用接口 查询env 参数就是appCategoryCode
    //setEnvDatas
    setEnvDatas([]);
    setAppCategoryCode(categoryCode);
    getRequest(APIS.envList, { data: { categoryCode } }).then((resp: any) => {
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

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryList(obj);
    setPageIndex(pagination.current);
  };

  // 查询数据
  const queryList = (value: any) => {
    // setDataSource(dataSource);
    setLoading(true);

    getRequest(APIS.tmplList, {
      data: {
        appCategoryCode: value.appCategoryCode,
        envCode: value.envCode,
        templateType: value.templateType,
        templateName: value.templateName,
        pageIndex: value.pageIndex,
        pageSize: value.pageSize,
      },
    })
      .then((res: any) => {
        if (res.success) {
          const dataSource = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          value.appCategoryCode = appCategoryCode;
          value.envCode = envCode;
          value.templateType = templateType;
          setPageTotal(pageTotal);
          setDataSource(dataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //删除数据
  const handleDelItem = (record: any) => {
    let id = record.id;
    delRequest(`${APIS.deleteTmpl}/${id}`).then((res: any) => {
      if (res.success) {
        message.success('删除成功！');
        queryList({
          pageIndex: 1,
          pageSize: 20,
        });
      }
    });
  };

  return (
    <MatrixPageContent>
      <FilterCard>
        <Form
          layout="inline"
          form={formTmpl}
          onFinish={(values: any) => {
            queryList({
              ...values,
              pageIndex: 1,
              pageSize: 20,
            });
          }}
          onReset={() => {
            formTmpl.resetFields();
            queryList({
              pageIndex: 1,
              // pageSize: pageSize,
            });
          }}
        >
          <Form.Item label="应用分类：" name="appCategoryCode">
            <Select showSearch style={{ width: 120 }} options={categoryData} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="环境：" name="envCode">
            <Select
              options={envDatas}
              allowClear
              onChange={(n) => {
                setenvCode(n);
              }}
              showSearch
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="模版类型：" name="templateType">
            <Select
              showSearch
              allowClear
              style={{ width: 120 }}
              options={templateTypes}
              onChange={(n) => {
                setTemplateType(n);
              }}
            />
          </Form.Item>
          <Form.Item label=" 模版名称：" name="templateName">
            <Input placeholder="请输入模版名称"></Input>
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
          <span style={{ float: 'right' }}>
            <Button
              type="primary"
              style={{ marginLeft: '88px' }}
              onClick={() =>
                history.push({
                  pathname: 'tmpl-add',
                })
              }
            >
              新增模版
            </Button>
          </span>
        </Form>
      </FilterCard>
      <ContentCard>
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
            <Table.Column title="ID" dataIndex="id" width="10%" />
            <Table.Column title="模版名称" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="模版CODE" dataIndex="templateCode" width="35%" ellipsis />
            <Table.Column title="模版类型" dataIndex="templateType" width="10%" />
            <Table.Column title="应用分类" dataIndex="appCategoryCode" width="10%" />
            <Table.Column title="环境" dataIndex="envCode" width="15%" />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="24%"
              key="action"
              render={(text, record: any) => (
                <Space size="small">
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-copy',
                        query: {
                          type: 'edit',
                          templateCode: record.templateCode,
                        },
                      })
                    }
                  >
                    复制
                  </a>
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-detail',
                        query: {
                          type: 'info',
                          templateCode: record.templateCode,
                        },
                      })
                    }
                  >
                    详情 {record.lastName}
                  </a>

                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-edit',
                        query: {
                          type: 'edit',
                          templateCode: record.templateCode,
                        },
                      })
                    }
                  >
                    编辑
                  </a>
                  <a
                    onClick={() => {
                      history.push(`push?templateCode=${record.templateCode}`);
                    }}
                  >
                    推送
                  </a>
                  <Popconfirm title="确定要删除该信息吗？" onConfirm={() => handleDelItem(record)}>
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
