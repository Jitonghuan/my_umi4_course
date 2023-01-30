// 上下布局页面 推送页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useEffect,useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  message,
  Modal,
  Popover,
  Row,
  Col,
  Tag,
  Divider,
  Radio,
} from 'antd';
import PageContainer from '@/components/page-container';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import { stringify } from 'qs';
import {createTableColumns} from './schema'
import { postRequest, getRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import './index.less';
import { queryAppGroupReq } from './service';

export default function Push(props: any) {
  const { Option } = Select;
  let location:any = useLocation();
  const query :any= parse(location.search);
  const tmplDetailData:any =  location.state?.record||{};
  //推送模版 模版Code 应用分类 环境Code 应用Code  customPush
  const templateCode = query.templateCode;
  const languageCode = query.languageCode;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [appCategoryCode, setAppCategoryCode] = useState<string>(''); //应用分类获取到的值
  const [envCodes, setEnvCodes] = useState<string[]>([]); //环境CODE获取到的值
  const [formTmpl] = Form.useForm();
  const [formTmplQuery] = Form.useForm();
  const [tmplDetailForm] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); //是否显示弹窗
  const [pushItemVisible, setPushItemVisible] = useState(false); //是否显示推送项弹窗
  const [tmplDetailOptions, setTmplDetailOptions] = useState<any[]>([]);
  const [selectTmplOption, setSelectTmplOption] = useState<any>(); //获取当前选中值显示在推送项弹窗
  const [labelListSource, setLabelListSource] = useState<any>();
  const [labelLoading, setLabelLoading] = useState<boolean>(false);
  const [businessData, setBusinessData] = useState<any[]>([]);
  const [value, setValue] = useState<number>(1); //弹窗radio的值

  const columns = useMemo(() => {
    return createTableColumns({
      onParam: (record, index) => {
        const query = {
          id: record.id,
          appCode: record.appCode,
          templateType: record.templateType,
          envCode: record.envCode,
        };
        history.push(`/matrix/application/detail/AppParameters?${stringify(query)}`);
      },
    }) as any;
  }, []);

  const getLabelList = () => {
    setLabelLoading(true);
    let arry: any = [];
    getRequest(APIS.getTagList, {
      data: { pageIndex: -1 },
    })
      .then((result) => {
        const { dataSource } = result.data || [];
        dataSource.map((el: any) => {
          arry.push({
            label: el.tagName,
            value: el.tagName,
          });
        });
        setLabelListSource(arry);
      })
      .finally(() => {
        setLabelLoading(false);
      });
  };
  
  
  // const [tmplName,setTmplName]=useState<string>(tmplDetailData?.templateName)
  let tmplName = tmplDetailData?.templateName;

  //处理通过session传递过来的可配置项信息和jvm参数信息
  let tmplItemarry: any = [];
  let jvm = '';
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
      setIsModalVisible(true);
    } else {
      message.warning('请先勾选应用！');
    }

    //加载默认的下拉选择框，当模版为deployment时，可配置项才可以显示jvm
    let tmplListdata = [
      {
        label: '模版详情',
        value: 'templateValue',
      },
      { label: '可配置项', value: 'item' },
      { label: '全部推送', value: 'all' },
    ];
    if (tmplDetailData?.templateType === 'deployment') {
      tmplListdata.unshift({
        label: 'jvm参数',
        value: 'jvm',
      });
    }

    setTmplDetailOptions(tmplListdata);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    selectCategory();
    getLabelList();
    let param = localStorage.getItem('TEMPLATE_PUSH_SEARCH')
      ? JSON.parse(localStorage.getItem('TEMPLATE_PUSH_SEARCH') || '')
      : '';
    formTmplQuery.setFieldsValue({
      appCategoryCode: param.appCategoryCode,
      appCode: param.appCode,
      tagNames: param.tagNames,
      appGroupCode: param.appGroupCode,
    });

    loadListData({
      ...param,
      pageIndex: 1,
      pageSize: 20,
    });
    // getApplication({ pageIndex: 1, pageSize: 20 });
  }, []);

  useEffect(() => {
    tmplDetailForm.resetFields();
    tmplDetailForm.setFieldsValue({
      restartPolicy: 1,
    });
  }, [isModalVisible]);

  // 页面销毁时清空缓存
  // useEffect(() => () => sessionStorage.removeItem('tmplDetailData'), []);
  // 根据选择的应用分类查询要推送的环境
  const changeAppCategory = (value: any) => {
    setEnvDatas([{ value: '', label: '' }]);
    setEnvCodes(['']);
    formTmplQuery.setFieldsValue({
      appGroupCode: '',
    });
    const appCategoryCode = value;
    setAppCategoryCode(appCategoryCode);
    queryAppGroupReq({
      categoryCode: value,
    }).then((datas) => {
      setBusinessData(datas.list);
    });

    getRequest(APIS.envList, {
      data: { categoryCode: appCategoryCode, pageIndex: -1, pageSize: -1 },
    }).then((resp: any) => {
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
  useEffect(() => {
    let values = formTmplQuery.getFieldsValue();
    if (values.appCategoryCode) {
      queryAppGroupReq({
        categoryCode: values.appCategoryCode,
      }).then((datas) => {
        setBusinessData(datas.list);
      });
    }
  }, []);
  //获取环境的值
  const changeEnvCode = (value: any) => {
    setEnvCodes(value);
  };
  //推送模版 模版Code 应用分类 环境Code 应用Code  customPush
  
  const appCodes = currentData.map((item, index) => {
    return Object.assign(item.appCode);
  });
  let getEnvCodes = [...envCodes];
  let pushItemArry: any = [];

  const handleOk = async () => {
    const values = await tmplDetailForm.validateFields();
    // 如果选择all时走原来的推送接口
    if (values?.pushItem === 'all') {
      if (appCategoryCode && envCodes) {
        postRequest(APIS.pushTmpl, {
          data: {
            appCategoryCode: appCategoryCode,
            templateCode,
            appCodes,
            envCodes: getEnvCodes,
            concurrentNumber: values?.concurrentNumber,
            restartPolicy: values?.restartPolicy,
          },
        }).then((resp: any) => {
          if (resp.success) {
            message.success('推送成功！');
            setIsModalVisible(false);
            // window.location.reload();
            loadListData({ pageIndex: 1, pageSize: 20 });
            setTimeout(() => {
              setSelectedRowKeys(['undefined']);
            }, 200);
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
            concurrentNumber: values?.concurrentNumber,
            restartPolicy: values?.restartPolicy,
          },
        }).then((resp: any) => {
          if (resp.success) {
            message.success('推送成功！');
            setIsModalVisible(false);
            loadListData({ pageIndex: 1, pageSize: 20 });
            setTimeout(() => {
              setSelectedRowKeys(['undefined']);
            }, 200);
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
        ...value,
        languageCode,
        appType: 'backend',
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
          tmplDetailForm.setFieldsValue({
            pushItem: 'all',
          });
          let tmplDetailQuery = [
            {
              label: '模版详情',
              value: 'templateValue',
              disabled: true,
            },
            {
              label: '可配置项',
              value: 'item',
              disabled: true,
            },
            { label: '全部推送', value: 'all' },
          ];
          if (tmplDetailData?.templateType === 'deployment') {
            tmplDetailQuery.unshift({
              label: 'jvm参数',
              value: 'jvm',
              disabled: true,
            });
          }
          setTmplDetailOptions(tmplDetailQuery);
        } else {
          //不选全选时其他项都可以选
          let tmplDetailQuery = [
            {
              label: '模版详情',
              value: 'templateValue',
              disabled: false,
            },
            {
              label: '可配置项',
              value: 'item',
              disabled: false,
            },
            { label: '全部推送', value: 'all' },
          ];
          if (tmplDetailData?.templateType === 'deployment') {
            tmplDetailQuery.unshift({
              label: 'jvm参数',
              value: 'jvm',
              disabled: false,
            });
          }
          setTmplDetailOptions(tmplDetailQuery);
        }
      });
    } else {
      let tmplDetailQuery = [
        {
          label: '模版详情',
          value: 'templateValue',
          disabled: false,
        },
        {
          label: '可配置项',
          value: 'item',
          disabled: false,
        },
        // { label: 'jvm参数', value: 'jvm参数', disabled: false },
        { label: '全部推送', value: 'all' },
      ];
      if (tmplDetailData?.templateType === 'deployment') {
        tmplDetailQuery.unshift({
          label: 'jvm参数',
          value: 'jvm',
          disabled: false,
        });
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

  const pushTmpls = () => { };

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
            localStorage.setItem('TEMPLATE_PUSH_SEARCH', JSON.stringify(values));
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
          <Form.Item label="应用标签：" name="tagNames">
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="输入标签名称"
              style={{ width: 220 }}
              options={labelListSource}
              loading={labelLoading}
            ></Select>
          </Form.Item>
          <Form.Item label="应用组：" name="appGroupCode">
            <Select
              allowClear
              showSearch
              placeholder="请选择应用组Code"
              style={{ width: 190 }}
              options={businessData}
            ></Select>
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
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
          <span>
            当前模版：
            <Tag color="blue">{tmplName}</Tag>
          </span>
        </Form>
      </FilterCard>
      <ContentCard>
        <div>
          <Form onFinish={pushTmpls} form={formTmpl}>
            <div className="table-caption">
            <div className="left-caption">
                   <h3> 应用列表</h3>

                </div>
                <div className="right-caption">
                当前模版：
            <Tag color="blue">{tmplDetailData?.tmplName!||""}</Tag>

                </div>

    </div>
            <Form.Item name="tableData">
              <Table
                bordered
                dataSource={dataSource}
                rowKey="id"
                loading={loading}
                columns={columns}
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
              />
            </Form.Item>
            <Space size="middle" style={{ float: 'right' }}>
              <Form.Item>
                <Button type="ghost" htmlType="reset" danger>
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
            className="push-form"
            width={750}
          >
            <Form layout="inline" form={tmplDetailForm} labelCol={{ flex: '150px' }}>
              <Row style={{ width: '100%' }}>
                <Col span={12}>
                  <Form.Item
                    label="部署环境的应用分类："
                    name="appCategoryCode"
                    rules={[
                      {
                        required: true,
                        message: '这是必选项',
                      },
                    ]}
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
                  <Form.Item
                    label="部署环境："
                    name="envCodes"
                    rules={[
                      {
                        required: true,
                        message: '这是必选项',
                      },
                    ]}
                  >
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
              <Form.Item
                label="推送项："
                name="pushItem"
                rules={[
                  {
                    required: true,
                    message: '这是必选项',
                  },
                ]}
                style={{
                  width: '100%',
                  marginTop: '10px',
                }}
              >
                <Select
                  allowClear
                  mode="multiple"
                  style={{ width: 160 }}
                  placeholder="请选择"
                  onChange={selectTmplItem}
                  options={tmplDetailOptions}
                />
              </Form.Item>
              <Divider />
              <Form.Item
                label="生效策略："
                name="restartPolicy"
                style={{ width: '100%' }}
                rules={[
                  {
                    required: true,
                    message: '这是必选项',
                  },
                ]}
              >
                <Radio.Group
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  value={value}
                >
                  <Radio value={1}>下次发布生效</Radio>
                  <Radio value={2}>立即生效</Radio>
                </Radio.Group>
              </Form.Item>
              {(value === 3 || value === 2) && tmplDetailData?.templateType === 'deployment' && (
                <Form.Item
                  label="并发数量："
                  name="concurrentNumber"
                  style={{
                    width: '100%',
                    marginTop: '15px',
                  }}
                  rules={[
                    {
                      required: true,
                      message: '这是必选项',
                    },
                  ]}
                >
                  <Select style={{ width: 160 }}>
                    <Select.Option value={5}>5</Select.Option>
                    <Select.Option value={10}>10</Select.Option>
                    <Select.Option value={15}>15</Select.Option>
                  </Select>
                </Form.Item>
              )}
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
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 0,
                  }}
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
