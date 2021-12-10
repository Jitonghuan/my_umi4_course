// 上下布局页面 推送页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, message, Modal, Popover, Row, Col, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { stringify } from 'qs';
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import './index.less';

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
  const [pushItemVisible, setPushItemVisible] = useState(false); //是否显示推送项弹窗
  const [tmplDetailOptions, setTmplDetailOptions] = useState<any[]>([]);
  const [selectTmplOption, setSelectTmplOption] = useState<any>(); //获取当前选中值显示在推送项弹窗

  //通过session缓存信息
  let tmplDetailData = JSON.parse(sessionStorage.getItem('tmplDetailData'));

  //处理通过session传递过来的可配置项信息和jvm参数信息
  let tmplItemarry: any = [];
  let jvm = '';

  let jvmString = ''; //
  let tmplateDataString = ''; //
  let tmplItemString = '';

  if (tmplDetailData?.templateType === 'deployment') {
    for (const key in tmplDetailData?.tmplConfigurableItem) {
      if (key === 'jvm') {
        jvm = 'jvm：' + tmplDetailData?.tmplConfigurableItem[key];
      } else {
        tmplItemarry.push({
          key: key,
          value: tmplDetailData?.tmplConfigurableItem[key],
        });
      }
    }
  } else {
    for (const key in tmplDetailData?.tmplConfigurableItem) {
      tmplItemarry.push({
        key: key,
        value: tmplDetailData?.tmplConfigurableItem[key],
      });
    }
  }

  tmplItemarry.map((item: any) => {
    tmplItemString += '可配置项：' + item.key + ':' + item.value;
  });

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
    },
  };

  const showModal = () => {
    if (selectedRowKeys.length > 0) {
      tmplDetailForm.setFieldsValue({
        pushItem: undefined,
        envCodes: undefined,
        appCategoryCode: undefined,
      });
      setIsModalVisible(true);
    } else {
      message.warning('请先勾选应用！');
    }

    //加载默认的下拉选择框，当模版为deployment时，可配置项才可以显示jvm
    let tmplListdata = [
      { label: '模版详情', value: 'templateValue' },
      { label: '可配置项', value: 'item' },
      { label: '全部推送', value: 'all' },
    ];
    if (tmplDetailData?.templateType === 'deployment') {
      tmplListdata.unshift({ label: 'jvm参数', value: 'jvm' });
    }

    setTmplDetailOptions(tmplListdata);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    tmplDetailForm.setFieldsValue({
      pushItem: undefined,
      envCodes: undefined,
    });
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    selectCategory();
    loadListData({ pageIndex: 1, pageSize: 20 });
    // getApplication({ pageIndex: 1, pageSize: 20 });
  }, []);

  // 页面销毁时清空缓存
  useEffect(() => () => sessionStorage.removeItem('tmplDetailData'), []);
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
  //推送模版 模版Code 应用分类 环境Code 应用Code  customPush
  const templateCode = props.history.location.query.templateCode;
  const languageCode = props.history.location.query.languageCode;
  const appCodes = currentData.map((item, index) => {
    return Object.assign(item.appCode);
  });
  let getEnvCodes = [...envCodes];
  let pushItemArry: any = [];
  const handleOk = () => {
    setIsModalVisible(false);
    const values = tmplDetailForm.getFieldsValue();
    // 如果选择all时走原来的推送接口
    if (values?.pushItem === 'all') {
      if (appCategoryCode && envCodes) {
        postRequest(APIS.pushTmpl, {
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
    } else {
      //如果不是选择all 就把所有选择放入pushItemArry数组中
      values?.pushItem?.map((el: any) => {
        pushItemArry.push(el);
      });
    }
    //当不选择all且选择其他时则为长度>0，走新的接口
    if (pushItemArry.length > 0) {
      if (appCategoryCode && envCodes) {
        postRequest(APIS.customPush, {
          data: {
            appCategoryCode: appCategoryCode,
            templateCode,
            appCodes,
            envCodes: getEnvCodes,
            customItems: pushItemArry,
          },
        }).then((resp: any) => {
          if (resp.success) {
            message.success('推送成功！');
            window.location.reload();
          }
        });
      } else {
        message.error('请选择要推送的应用分类');
      }
    }
  };

  //点击查询
  const getApplication = (value: any) => {
    setLoading(true);
    getRequest(APIS.appList, {
      data: {
        tagName: value.tagName,
        appCategoryCode: value.appCategoryCode,
        appCode: value.appCode,
        languageCode,
        // envCode: value.envCode,
        appType: 'backend',
        // isClient: 0,
        pageSize: value.pageSize,
        pageIndex: value.pageIndex,

        // pageSize: value.pageSize,
      },
    })
      .then((res: any) => {
        if (res.success) {
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
        //全选时置灰其他单项选择
        if (item === 'all') {
          tmplDetailForm.setFieldsValue({ pushItem: 'all' });
          let tmplDetailQuery = [
            { label: '模版详情', value: 'templateValue', disabled: true },
            { label: '可配置项', value: 'item', disabled: true },
            { label: '全部推送', value: 'all' },
          ];
          if (tmplDetailData?.templateType === 'deployment') {
            tmplDetailQuery.unshift({ label: 'jvm参数', value: 'jvm', disabled: true });
          }
          setTmplDetailOptions(tmplDetailQuery);
        } else {
          //不选全选时其他项都可以选
          let tmplDetailQuery = [
            { label: '模版详情', value: 'templateValue', disabled: false },
            { label: '可配置项', value: 'item', disabled: false },
            { label: '全部推送', value: 'all' },
          ];
          if (tmplDetailData?.templateType === 'deployment') {
            tmplDetailQuery.unshift({ label: 'jvm参数', value: 'jvm', disabled: false });
          }
          setTmplDetailOptions(tmplDetailQuery);
        }
      });
    } else {
      let tmplDetailQuery = [
        { label: '模版详情', value: 'templateValue', disabled: false },
        { label: '可配置项', value: 'item', disabled: false },
        // { label: 'jvm参数', value: 'jvm参数', disabled: false },
        { label: '全部推送', value: 'all' },
      ];
      if (tmplDetailData?.templateType === 'deployment') {
        tmplDetailQuery.unshift({ label: 'jvm参数', value: 'jvm', disabled: false });
      }
      setTmplDetailOptions(tmplDetailQuery);
    }

    setPushItemVisible(true); //展示弹窗
    setSelectTmplOption(values); //展示所选择的信息
  };

  let selectTmplcontent: any = [];
  selectTmplOption?.map((item: any) => {
    if (item == 'all') {
      selectTmplcontent = [jvm, tmplItemString, '模版详情：' + tmplDetailData?.templateValue];
    }
    if (item == 'item') {
      selectTmplcontent.push(tmplItemString || '');
    }
    if (item == 'jvm') {
      selectTmplcontent.push(jvm);
    }
    if (item == 'templateValue') {
      selectTmplcontent.push('模版详情：' + tmplDetailData?.templateValue);
    }
  });

  const pushTmpls = () => {};

  const handleVisibleChange = (visible: any) => {
    setPushItemVisible(visible);
  };
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
          <Form.Item label="应用分类：" name="appCategoryCode">
            <Select showSearch allowClear style={{ width: 140 }} options={categoryData} onChange={changeAppCategory} />
          </Form.Item>
          <Form.Item label="应用标签：" name="tagName">
            <Input placeholder="请输入标签名称" style={{ width: 180 }}></Input>
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
                bordered
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
                <Table.Column title="ID" dataIndex="id" width="4%" />
                <Table.Column title="应用名" dataIndex="appName" width="18%" />
                <Table.Column title="应用CODE" dataIndex="appCode" width="18%" />
                <Table.Column title="应用分类" dataIndex="appCategoryCode" width="14%" />
                <Table.Column
                  title="应用标签"
                  dataIndex="bindTagNames"
                  width="32%"
                  render={(current) => (
                    <span>
                      {current?.map((tag: any) => {
                        let color = 'green';
                        return (
                          <span style={{ marginTop: 2 }}>
                            <Tag color={color}>{tag}</Tag>
                          </span>
                        );
                      })}
                    </span>
                  )}
                />
                <Table.Column
                  width="14%"
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
            width={750}
            bodyStyle={{ height: '300px' }}
          >
            <Form layout="inline" form={tmplDetailForm} labelCol={{ flex: '150px' }}>
              <div style={{ width: '100%' }}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="部署环境的应用分类："
                      name="appCategoryCode"
                      rules={[{ required: true, message: '这是必选项' }]}
                    >
                      <Select
                        showSearch
                        allowClear
                        style={{ width: 160 }}
                        options={categoryData}
                        onChange={changeAppCategory}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="部署环境：" name="envCodes" rules={[{ required: true, message: '这是必选项' }]}>
                      <Select
                        showSearch
                        allowClear
                        style={{ width: 160 }}
                        mode="multiple"
                        placeholder="请选择"
                        onChange={changeEnvCode}
                        options={envDatas}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div style={{ width: '100%', marginTop: 18 }}>
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
              </div>
              <div style={{ width: '100%', marginTop: 16 }}></div>
            </Form>
          </Modal>

          <Popover
            title="查看预览推送项详情"
            trigger="click"
            overlayStyle={{ width: '57%' }}
            overlayInnerStyle={{ width: '57%' }}
            visible={pushItemVisible}
            onVisibleChange={handleVisibleChange}
            content={
              <div>
                {selectTmplcontent.length >= 1 && (
                  <AceEditor mode="yaml" height={150} value={selectTmplcontent[0] || ''} />
                )}
                <br />
                {selectTmplcontent.length >= 2 && (
                  <AceEditor mode="yaml" height={150} value={selectTmplcontent[1] || ''} />
                )}
                <br />
                {selectTmplcontent.length >= 3 && (
                  <AceEditor mode="yaml" height={150} value={selectTmplcontent[2] || ''} />
                )}
                <br />
                <Button
                  onClick={() => {
                    setPushItemVisible(false);
                  }}
                  style={{ position: 'absolute', bottom: 10, right: 0 }}
                >
                  关闭
                </Button>
              </div>
            }
          ></Popover>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
