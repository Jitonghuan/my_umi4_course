// 上下布局页面 应用模版页
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
import { useQueryTemplateList } from './hooks';

/** 编辑页回显数据 */
export interface TmplEdit extends Record<string, any> {
  productLine: string;
  tempType: string;
  tempName: string;
  tempConfiguration: string;
}
export default function ComponentTmpl() {
  const { Option } = Select;
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, queryTemplateList] = useQueryTemplateList();
  const [formTmpl] = Form.useForm();
  const [tmplEditMode, setTmplEditMode] = useState<EditorMode>('HIDE');
  const [tmplateData, setTmplateData] = useState<TmplEdit>();
  const handleEditTask = useCallback(
    (record: TmplEdit, index: number) => {
      setTmplateData(record);
      setTmplEditMode('EDIT');
    },
    [tableDataSource],
  );

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryTemplateList(obj.pageIndex, obj.pageSize);
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

  // 查询数据
  // const queryList = (value: any) => {
  //   // setDataSource(dataSource);
  //   setLoading(true);

  //   getRequest(APIS.tmplList, {
  //     data: {
  //       appCategoryCode: value.appCategoryCode,
  //       envCode: value.envCode,
  //       templateType: value.templateType,
  //       templateName: value.templateName,
  //       languageCode: value.languageCode,
  //       pageIndex: value.pageIndex,
  //       pageSize: value.pageSize,
  //     },
  //   })
  //     .then((res: any) => {
  //       if (res.success) {
  //         const dataSource = res.data.dataSource;
  //         let pageTotal = res.data.pageInfo.total;
  //         let pageIndex = res.data.pageInfo.pageIndex;
  //         value.appCategoryCode = appCategoryCode;
  //         value.envCode = envCode;
  //         value.templateType = templateType;
  //         setPageTotal(pageTotal);
  //         setDataSource(dataSource);
  //         setPageIndex(pageIndex);
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  //删除数据
  // const handleDelItem = (record: any) => {
  //   let id = record.id;
  //   delRequest(`${APIS.deleteTmpl}/${id}`).then((res: any) => {
  //     if (res.success) {
  //       message.success('删除成功！');
  //       loadListData({
  //         pageIndex: 1,
  //         pageSize: 20,
  //       });
  //     }
  //   });
  // };
  //抽屉保存
  const saveEditData = () => {
    setTmplEditMode('HIDE');
    setTimeout(() => {
      loadListData({ pageIndex: 1, pageSize: 20 });
    }, 100);
    // window.location.reload();
  };
  return (
    <PageContainer>
      <TmplEditDraw
        mode={tmplEditMode}
        // initData={tmplateData}
        onClose={() => setTmplEditMode('HIDE')}
        onSave={saveEditData}
      />
      <FilterCard>
        <Form
          layout="inline"
          form={formTmpl}
          onFinish={(values: any) => {
            // queryList({
            //   ...values,
            //   pageIndex: 1,
            //   pageSize: 20,
            // });
          }}
          onReset={() => {
            formTmpl.resetFields();
            // queryList({
            //   pageIndex: 1,
            //   // pageSize: pageSize,
            // });
          }}
        >
          <Form.Item label="产品线：" name="appCategoryCode">
            <Select showSearch style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="环境：" name="envCode">
            <Select
              // options={envDatas}
              allowClear
              // onChange={(n) => {
              //   setenvCode(n);
              // }}
              showSearch
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item label="类型：" name="templateType">
            <Select
              showSearch
              allowClear
              style={{ width: 180 }}
              // options={templateTypes}
              // onChange={(n) => {
              //   setTemplateType(n);
              // }}
            />
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
            <Button
              type="primary"
              onClick={() =>
                history.push({
                  pathname: 'tmpl-add',
                })
              }
            >
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
              total: pageInfo.pageTotal,
              pageSize: pageInfo.pageSize,
              current: pageInfo.pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageInfo({
                  pageSize: size,
                  pageIndex: 1,
                });
              },
              showTotal: () => `总共 ${pageInfo.pageTotal} 条数据`,
            }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="模版名称" dataIndex="tempName" width="20%" ellipsis />
            <Table.Column title="产品线" dataIndex="productLine" width="8%" ellipsis />
            <Table.Column title="类型" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="18%"
              key="action"
              render={(_, record: TmplEdit, index) => (
                <Space size="small">
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-detail',
                        query: {
                          type: 'info',
                          templateCode: record.templateCode,
                          languageCode: record?.languageCode,
                        },
                      })
                    }
                  >
                    详情 {record.lastName}
                  </a>

                  <a onClick={() => handleEditTask(record, index)}>编辑</a>

                  <Popconfirm title="确定要删除该信息吗？">
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
