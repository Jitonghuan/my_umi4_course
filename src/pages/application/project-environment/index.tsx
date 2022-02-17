// 项目环境管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { queryProjectEnvList } from './service';
import { useDeleteProjectEnv, useQueryCategory, useEnvList } from './hook';
import EnvironmentEditDraw from './add-environment';
import './index.less';
/** 环境大类 */
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
];

/** 编辑页回显数据 */
export interface TmplEdit extends Record<string, any> {
  templateCode: string;
  templateType: string;
  templateName: string;
  tmplConfigurableItem: object;
  appCategoryCode: any;
  envCodes: string;
  templateValue: string;
  languageCode: string;
  remark: string;
}
export default function EnvironmentList() {
  const { Option } = Select;
  const [formList] = Form.useForm();
  const [enviroInitData, setEnviroInitData] = useState<any>();
  const [deleteProjectEnv] = useDeleteProjectEnv();
  const [categoryData] = useQueryCategory();
  const [loading, envDataSource] = useEnvList();
  const [enviroEditMode, setEnviroEditMode] = useState<EditorMode>('HIDE');
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageTotal, setPageTotal] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const queryProjectEnv = async (queryParamsObj: any) => {
    setListLoading(true);
    await getRequest(queryProjectEnvList, { data: queryParamsObj })
      .then((res) => {
        if (res?.success) {
          let data = res?.data?.dataSource;
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          setPageIndex(pageIndex);
          setDataSource(data);
          setPageTotal(pageTotal);
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };
  useEffect(() => {
    let obj = { pageIndex: 1, pageSize: 20 };
    queryProjectEnv(obj);
  }, []);
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
    const values = formList.getFieldsValue();
    queryProjectEnv({
      ...values,
      ...params,
    });
    // setPageCurrentIndex(pageIndex);
  };

  const saveEditData = () => {
    setEnviroEditMode('HIDE');
    loadListData({ pageIndex: 1, pageSize: 20 });
  };
  return (
    <PageContainer className="project-env-list">
      <EnvironmentEditDraw
        mode={enviroEditMode}
        initData={enviroInitData}
        onClose={() => {
          setEnviroEditMode('HIDE');
          loadListData({ pageIndex: 1, pageSize: 20 });
        }}
        onSave={saveEditData}
      />
      <FilterCard>
        <Form
          layout="inline"
          form={formList}
          onFinish={(values: any) => {
            queryProjectEnv({
              ...values,
              pageIndex: 1,
              pageSize: 20,
            });
          }}
          onReset={() => {
            formList.resetFields();
            queryProjectEnv({
              pageIndex: 1,
              // pageSize: pageSize,
            });
          }}
        >
          <Form.Item label="默认分类：" name="categoryCode">
            <Select showSearch style={{ width: 150 }} options={categoryData} />
          </Form.Item>
          <Form.Item label="环境大类：" name="envTypeCode">
            <Select allowClear showSearch style={{ width: 120 }} options={envTypeData} />
          </Form.Item>
          <Form.Item label="基准环境：" name="benchmarkEnvCode">
            <Select showSearch allowClear style={{ width: 150 }} options={envDataSource} loading={loading} />
          </Form.Item>
          <Form.Item label="环境名：" name="envName">
            <Input style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label=" 环境CODE" name="envCode">
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
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>项目环境列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setEnviroEditMode('ADD');
                console.log(2);
              }}
            >
              <PlusOutlined />
              新增项目环境
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            bordered
            dataSource={dataSource}
            loading={listLoading}
            pagination={{
              current: pageIndex,
              total: pageTotal,
              pageSize,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1);
              },
              showTotal: () => `总共 ${pageTotal} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="环境名" dataIndex="envName" width="20%" ellipsis />
            <Table.Column title="环境CODE" dataIndex="envCode" width="8%" ellipsis />
            <Table.Column title="基准环境" dataIndex="relEnvs" width="8%" ellipsis />
            <Table.Column title="默认分类" dataIndex="categoryCode" width="8%" ellipsis />
            <Table.Column title="环境大类" dataIndex="envTypeCode" width="16%" />
            <Table.Column title="备注" dataIndex="mark" width="18%" ellipsis />
            <Table.Column
              title="操作"
              width="18%"
              key="action"
              render={(_, record: any, index) => (
                <Space size="small">
                  <a
                    onClick={() => {
                      setEnviroEditMode('VIEW');
                      setEnviroInitData(record);
                    }}
                  >
                    查看
                  </a>
                  <a
                    onClick={() => {
                      setEnviroEditMode('EDIT');
                      setEnviroInitData(record);
                    }}
                  >
                    编辑
                  </a>
                  <Popconfirm
                    title="确定要删除该信息吗？"
                    onConfirm={() => {
                      deleteProjectEnv(record?.envCode).then(() => {
                        queryProjectEnv({
                          pageIndex: 1,
                          // pageSize: pageSize,
                        });
                      });
                    }}
                  >
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
