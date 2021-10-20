// 上下布局页面 推送页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, message, Modal, Radio } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { stringify } from 'qs';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';

export default function Push(props: any) {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [envCodes, setEnvCodes] = useState<string[]>([]); //环境CODE获取到的值
  const [formTmpl] = Form.useForm();
  const [formTmplQuery] = Form.useForm();
  const [tmplDetailForm] = Form.useForm();
  const [selectList, setSelectList] = useState<any[]>([]);
  const [pageTotal, setPageTotal] = useState<number>();
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); //是否显示弹窗
  const [tmplDetailOptions, setTmplDetailOptions] = useState<any[]>([]);

  //通过session缓存信息
  let tmplDetailData = JSON.parse(sessionStorage.getItem('tmplDetailData'));

  //处理通过session传递过来的可配置项信息和jvm参数信息
  let tmplItemarry: any = [];
  let jvm = '';

  if (tmplDetailData.templateType === 'deployment') {
    for (const key in tmplDetailData?.tmplConfigurableItem) {
      if (key === 'jvm') {
        jvm = tmplDetailData?.tmplConfigurableItem[key];
      } else {
        tmplItemarry.push({
          key: key,
          value: tmplDetailData?.tmplConfigurableItem[key],
        });
      }
    }
  }

  // if (!tmplDetailData){

  // }
  //  let tmplDetailOption=[];
  let allTmplDetail = [];
  allTmplDetail.push({ templateValue: tmplDetailData?.templateValue, tmplItem: tmplItemarry, jvm: jvm });

  let allTmplData = []; //全部数据

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
    },
  };

  const showModal = () => {
    if (appCategoryCode) {
      setIsModalVisible(true);
    } else {
      message.error('请选择要推送的应用分类');
    }

    //加载默认的下拉选择框，当模版为deployment时，可配置项才可以显示jvm
    let tmplListdata = [
      { label: '模版详情', value: '模版详情' },
      { label: '可配置项', value: '可配置项' },
      // {label:'jvm参数',value:'jvm参数'},
      { label: '全部', value: 'all' },
    ];
    if (tmplDetailData.templateType === 'deployment') {
      tmplListdata.unshift({ label: 'jvm参数', value: 'jvm参数' });
    }

    setTmplDetailOptions(tmplListdata);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    selectCategory();
    loadListData({ pageIndex: 1, pageSize: 20 });
    // getApplication({ pageIndex: 1, pageSize: 20 });
  }, []);

  // 页面销毁时清空缓存
  // useEffect(() => () => sessionStorage.removeItem("tmplDetailData"), []);
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
    const values = tmplDetailForm.getFieldsValue();
    console.log('values', values);
    let pushArry = [];
    values.pushItem.map((el: any) => {
      if (el === '模版详情') {
        pushArry.push(tmplDetailData?.templateValue);
      } else if (el === '可配置项') {
        pushArry.push(tmplItemarry);
      } else if (el === 'jvm') {
        pushArry.push(jvm);
      } else if (el === 'all') {
        pushArry.push(tmplDetailData?.templateValue, tmplItemarry, jvm);
      }
    });
    // const templateCode = props.history.location.query.templateCode;
    // const appCodes = currentData.map((item, index) => {
    //   return Object.assign(item.appCode);
    // });
    let getEnvCodes = [...envCodes];
    if (appCategoryCode && envCodes) {
      // await postRequest(APIS.pushTmpl, {
      //   data: { appCategoryCode: appCategoryCode, templateCode, appCodes, envCodes: getEnvCodes },
      // }).then((resp: any) => {
      //   if (resp.success) {
      //     message.success('推送成功！');
      //     window.location.reload();
      //   }
      // });
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
    loadListData(obj);
    setSelectList(currentDataSource);
  };
  const loadListData = (params: any) => {
    const values = formTmplQuery.getFieldsValue();
    getApplication({
      ...values,
      ...params,
    });
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

  //选择推送项
  const selectTmplItem = (values: any) => {
    if (values.length > 0) {
      values.map((item: any) => {
        debugger;
        if (item === 'all') {
          tmplDetailForm.setFieldsValue({ pushItem: 'all' });
          let tmplDetail = [
            { label: '模版详情', value: '模版详情', disabled: true },
            { label: '可配置项', value: '可配置项', disabled: true },
            // {label:'jvm参数',value:'jvm参数',disabled:true},
            { label: '全部', value: 'all' },
          ];
          if (tmplDetailData.templateType === 'deployment') {
            tmplDetail.unshift({ label: 'jvm参数', value: 'jvm参数', disabled: true });
          }

          setTmplDetailOptions(tmplDetail);
        } else {
          let tmplDetail = [
            { label: '模版详情', value: '模版详情', disabled: false },
            { label: '可配置项', value: '可配置项', disabled: false },
            // {label:'jvm参数',value:'jvm参数',disabled:false},

            { label: '全部', value: 'all' },
          ];
          if (tmplDetailData.templateType === 'deployment') {
            tmplDetail.unshift({ label: 'jvm参数', value: 'jvm参数', disabled: false });
          }
          //  tmplDetail.map((item)=>{
          //    if (item.label!=='all') {
          //      item.disabled=false
          //    }
          //  })
          setTmplDetailOptions(tmplDetail);
        }
      });
    } else {
      let tmplDetail = [
        { label: '模版详情', value: '模版详情', disabled: false },
        { label: '可配置项', value: '可配置项', disabled: false },
        { label: 'jvm参数', value: 'jvm参数', disabled: false },
        { label: '全部', value: 'all' },
      ];
      setTmplDetailOptions(tmplDetail);
    }
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
            formTmplQuery.resetFields();
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
                            id: record.id,
                            appCode: record.appCode,
                            templateType: record.templateType,
                            envCode: record.envCode,
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
          <Modal
            title="请选择"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ height: '600px' }}
          >
            <Form layout="inline" form={tmplDetailForm}>
              <Form.Item label="推送项：" name="pushItem" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  allowClear
                  mode="multiple"
                  style={{ width: 160 }}
                  placeholder="请选择"
                  onChange={selectTmplItem}
                  options={tmplDetailOptions}
                />
              </Form.Item>
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
          {/* visible={pushItemVisible} */}
          <Modal title="预览推送详情"></Modal>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
