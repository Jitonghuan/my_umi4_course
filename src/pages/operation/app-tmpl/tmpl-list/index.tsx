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
import TmplEditDraw from '../tmpl-edits';
/** 应用开发语言(后端) */
export type AppDevelopLanguage = 'java' | 'golang' | 'python';
export const appDevelopLanguageOptions: IOption<AppDevelopLanguage>[] = [
  { label: 'GOLANG', value: 'golang' },
  { label: 'JAVA', value: 'java' },
  { label: 'PYTHON', value: 'python' },
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
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formTmpl] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [tmplDetailData, setTmplDetailData] = useState<any>(' ');
  const [tmplEditMode, setTmplEditMode] = useState<EditorMode>('HIDE');
  const [tmplateData, setTmplateData] = useState<TmplEdit>();
  const handleEditTask = useCallback(
    (record: TmplEdit, index: number) => {
      setTmplateData(record);
      setTmplEditMode('EDIT');
      setDataSource(dataSource);
    },
    [dataSource],
  );

  //查询编辑参数
  useEffect(() => {
    loadListData({ pageIndex: 1, pageSize: 20 });
    selectCategory();
    selectTmplType();
  }, []);

  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || [])?.map((n: any) => ({
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
      const list = (result.data || [])?.map((n: any) => ({
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
        let dataArry: any = [];
        resp.data?.dataSource?.map((n: any) => {
          if (n.proEnvType === 'benchmark' && n.clusterName !== 'fe') {
            dataArry.push({
              value: n?.envCode,
              label: n?.envName,
              data: n,
            });
          }
        });
        setEnvDatas(dataArry);
      }

      // const datas =
      //   resp?.data?.dataSource?.map((el: any) => {
      //     if (el.clusterName !== 'fe') {
      //       return {
      //         ...el,
      //         value: el?.envCode,
      //         label: el?.envName,
      //       };
      //     }
      //   }) || [];
      // console.log('datas',datas)

      // }
    });
  };

  //触发分页

  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    loadListData(obj);
    setPageIndex(pagination.current);
  };

  const loadListData = (params: any) => {
    const values = formTmpl.getFieldsValue();

    queryList({
      ...values,
      ...params,
    });
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
        languageCode: value.languageCode,
        pageIndex: value.pageIndex,
        pageSize: value.pageSize,
      },
    })
      .then((res: any) => {
        if (res.success) {
          const dataSource = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          value.appCategoryCode = appCategoryCode;
          value.envCode = envCode;
          value.templateType = templateType;
          setPageTotal(pageTotal);
          setDataSource(dataSource);
          setPageIndex(pageIndex);
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
        loadListData({
          pageIndex: 1,
          pageSize: 20,
        });
      }
    });
  };
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
        initData={tmplateData}
        onClose={() => setTmplEditMode('HIDE')}
        onSave={saveEditData}
      />
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
            <Select showSearch style={{ width: 110 }} options={categoryData} onChange={changeAppCategory} />
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
          <Form.Item label="模版语言：" name="languageCode">
            <Select showSearch allowClear style={{ width: 100 }} options={appDevelopLanguageOptions} />
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
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>模版列表</h3>
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
              新增模版
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
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
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="模版名称" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="模版语言" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="模版类型" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column title="应用分类" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column
              title="环境"
              dataIndex="envCode"
              width="16%"
              render={(current) => (
                <span>
                  {current?.map((item: any) => {
                    return (
                      <span style={{ marginLeft: 4, marginTop: 2 }}>
                        <Tag color={'green'}>{item}</Tag>
                      </span>
                    );
                  })}
                </span>
              )}
            />
            <Table.Column title="备注" dataIndex="remark" width="18%" ellipsis />
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
                        pathname: 'tmpl-copy',
                        query: {
                          type: 'edit',
                          templateCode: record.templateCode,
                          languageCode: record?.languageCode,
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
                          languageCode: record?.languageCode,
                        },
                      })
                    }
                  >
                    详情 {record.lastName}
                  </a>

                  <a onClick={() => handleEditTask(record, index)}>编辑</a>
                  <a
                    onClick={() => {
                      sessionStorage.setItem('tmplDetailData', JSON.stringify(record || ''));
                      history.push({
                        pathname: 'push',
                        query: {
                          templateCode: record?.templateCode,
                          languageCode: record?.languageCode,
                        },
                      });
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
    </PageContainer>
  );
}
