//组件模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import TmplEditDraw from './tmpl-edits';
import { useQueryTemplateList, useDeleteComponentTmpl, useGetTypeListOption } from './hooks';
import { productLineOptions } from './config';

/** 编辑页回显数据 */
export interface TmplEdit extends Record<string, any> {
  id: number;
  productLine: string;
  tempType: string;
  tempName: string;
  tempConfiguration: string;
}
export default function ComponentTmpl() {
  const { Option } = Select;
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, queryTemplateList] = useQueryTemplateList();
  const [formTmpl] = Form.useForm();
  const [delLoading, deleteComponentTmpl] = useDeleteComponentTmpl();
  const [optionLoading, typeOption] = useGetTypeListOption();
  const [tmplEditMode, setTmplEditMode] = useState<EditorMode>('HIDE');
  const [tmplateData, setTmplateData] = useState<TmplEdit>();
  const handleEditTask = useCallback((record: TmplEdit, index: number, type) => {
    setTmplateData(record);
    setTmplEditMode(type);
  }, []);
  //触发分页

  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryTemplateList(obj);
    setPageInfo({
      pageIndex: pagination.current.pageIndex,
    });
    setPageInfo({
      pageIndex: pagination.current.pageIndex,
      pageSize: pagination.current.pageIndex,
    });
  };

  const loadListData = (params: any) => {
    const values = formTmpl.getFieldsValue();

    // queryList({
    //   ...values,
    //   ...params,
    // });
  };

  //抽屉保存
  const saveEditData = () => {
    setTmplEditMode('HIDE');
    setTimeout(() => {
      queryTemplateList({ pageIndex: 1, pageSize: 20 });
      // loadListData({ pageIndex: 1, pageSize: 20 });
    }, 200);
    // window.location.reload();
  };
  return (
    <PageContainer>
      <TmplEditDraw
        mode={tmplEditMode}
        initData={tmplateData}
        onClose={() => setTmplEditMode('HIDE')}
        onSave={saveEditData}
      />
      <FilterCard>
        <Form
          layout="inline"
          form={formTmpl}
          onFinish={(values: any) => {
            queryTemplateList({ pageIndex: 1, pageSize: 20, ...values });
          }}
          onReset={() => {
            formTmpl.resetFields();
            queryTemplateList({
              pageIndex: 1,
              pageSize: 20,
            });
          }}
        >
          <Form.Item label="产品线：" name="productLine">
            <Select showSearch allowClear style={{ width: 180 }} options={productLineOptions} />
          </Form.Item>
          <Form.Item label="类型：" name="tempType">
            <Select showSearch allowClear style={{ width: 180 }} options={typeOption} />
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
            <h3>组件模版列表</h3>
          </div>
          <div className="caption-right">
            <Button type="primary" onClick={() => setTmplEditMode('ADD')}>
              新增组件模版
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            dataSource={tableDataSource}
            bordered
            loading={tableLoading}
            pagination={{
              total: pageInfo.total,
              pageSize: pageInfo.pageSize,
              current: pageInfo.pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageInfo({
                  pageSize: size,
                  pageIndex: 1,
                });
              },
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="模版名称" dataIndex="tempName" width="20%" ellipsis />
            <Table.Column title="产品线" dataIndex="productLine" width="8%" ellipsis />
            <Table.Column title="类型" dataIndex="tempType" width="8%" ellipsis />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="18%"
              key="action"
              render={(_, record: TmplEdit, index) => (
                <Space size="small">
                  <a onClick={() => handleEditTask(record, index, 'VIEW')}>详情</a>

                  <a onClick={() => handleEditTask(record, index, 'EDIT')}>编辑</a>

                  <Popconfirm
                    title="确定要删除该信息吗？"
                    onConfirm={() => {
                      deleteComponentTmpl(record.id).then(() => {
                        const values = formTmpl.getFieldsValue();
                        queryTemplateList({ pageIndex: 1, pageSize: 20, ...values });
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
