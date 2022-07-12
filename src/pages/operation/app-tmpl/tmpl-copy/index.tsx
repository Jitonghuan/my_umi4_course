// 上下布局页面 应用模版复制页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import EditorTable from '@cffe/pc-editor-table';
import { Input, Button, Form, Row, Col, Select, Space } from 'antd';
import './index.less';

export default function DemoPageTb(porps: any) {
  const { Option } = Select;
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const children: any = [];
  const [categoryData, setCategoryData] = useState<any>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const [isDeployment, setIsDeployment] = useState<string>();
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};

  useEffect(() => {
    selectTmplType();
    selectCategory();
    tmplDetialResult(templateCode);

    const flag = porps.history.location.query.type;
    if (flag == 'info') {
      setIsdisabled(true);
    } else {
      setIsdisabled(false);
    }
  }, []);
  //进入页面加载信息
  const templateCode: string = porps.history.location.query.templateCode;
  const languageCode = porps.history.location.query.languageCode;
  const tmplDetialResult = (templateCode: string) => {
    getRequest(APIS.tmplList, { data: { templateCode } }).then((res: any) => {
      if (res.success) {
        const tmplresult = res.data.dataSource[0];
        let arr = [];
        let jvm = '';
        for (const key in tmplresult.tmplConfigurableItem) {
          if (key === 'jvm') {
            jvm = tmplresult.tmplConfigurableItem[key];
          } else {
            arr.push({
              key: key,
              value: tmplresult.tmplConfigurableItem[key],
            });
          }
        }

        let envCode = tmplresult.envCode;
        if (envCode == '') {
          envCode = [];
        }

        createTmplForm.setFieldsValue({
          templateType: tmplresult.templateType,
          templateName: tmplresult.templateName,
          templateValue: tmplresult.templateValue,
          appCategoryCode: tmplresult.appCategoryCode,
          envCodes: envCode,
          tmplConfigurableItem: arr,
          jvm: jvm,
          languageCode: tmplresult.languageCode,
          remark: tmplresult.remark,
        });
        setIsDeployment(tmplresult.templateType);
        changeAppCategory(tmplresult.appCategoryCode);
      }
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

  const selectTemplType = (value: any) => {
    setIsDeployment(value);
  };
  //加载应用分类下拉选择
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

  // 查询环境
  const changeAppCategory = (categoryCode: string) => {
    //调用接口 查询env
    setEnvDatas([]);
    setAppCategoryCode(categoryCode);
    getRequest(APIS.envList, { data: { pageSize: -1 } }).then((resp: any) => {
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

  //提交复制模版
  const createTmpl = (value: any) => {
    // const templateCode:string = porps.history.location.query.templateCode;
    //  const tmplConfigurableItem = new Map(value.tmplConfigurableItem.map((el:any)=> [el.key,el.value]))
    const tmplConfigurableItem = value?.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el?.value;
      return prev;
    }, {} as any);

    let valArr = [];
    if (Array.isArray(value.envCodes)) {
      valArr = value.envCodes;
    } else {
      valArr.push(value.envCodes);
    }
    if (languageCode === 'java') {
      postRequest(APIS.create, {
        data: {
          templateName: value.templateName,
          templateType: value.templateType,
          templateValue: value.templateValue,
          appCategoryCode: value.appCategoryCode || '',
          envCodes: valArr || [],
          tmplConfigurableItem: tmplConfigurableItem || {},
          jvm: value?.jvm,
          languageCode: value?.languageCode,
          remark: value?.remark,
          // templateCode:templateCode
        },
      }).then((resp: any) => {
        if (resp.success) {
          const datas = resp.data || [];
          setEnvDatas(datas.envCodes);
          history.push({
            pathname: 'tmpl-list',
          });
        }
      });
    } else {
      postRequest(APIS.create, {
        data: {
          templateName: value.templateName,
          templateType: value.templateType,
          templateValue: value.templateValue,
          appCategoryCode: value.appCategoryCode || '',
          envCodes: valArr || [],
          tmplConfigurableItem: tmplConfigurableItem || {},

          languageCode: value?.languageCode,
          remark: value?.remark,
          // templateCode:templateCode
        },
      }).then((resp: any) => {
        if (resp.success) {
          const datas = resp.data || [];
          setEnvDatas(datas.envCodes);
          history.push({
            pathname: 'tmpl-list',
          });
        }
      });
    }
  };

  return (
    <PageContainer className="tmpl-detail">
      <ContentCard>
        <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <div>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  options={templateTypes}
                  disabled={isDisabled}
                  onChange={selectTemplType}
                />
              </Form.Item>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <Form.Item label="模版语言：" name="languageCode" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} disabled={true} />
              </Form.Item>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </div>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={10}>
              <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                {/* <TextArea rows={18} disabled={isDisabled} /> */}
                <AceEditor mode="yaml" height={600} />
              </Form.Item>
            </Col>

            <Col span={10} offset={2}>
              <div style={{ fontSize: 15, color: '#696969' }}>可配置项：</div>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  value={source}
                  onChange={handleChange}
                  columns={[
                    { title: 'Key', dataIndex: 'key', colProps: { width: 240 } },
                    {
                      title: '缺省值',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                    },
                  ]}
                  disabled={isDisabled}
                />
              </Form.Item>
              {isDeployment === 'deployment' && languageCode === 'java' ? <span>JVM参数:</span> : ''}
              {isDeployment === 'deployment' && languageCode === 'java' ? (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '50px' }}
              >
                <Select showSearch style={{ width: 220 }} disabled={isDisabled} options={categoryData} />
              </Form.Item>
              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 220 }}
                  showSearch
                  placeholder="支持通过envCode搜索环境"
                  // defaultValue={['a10', 'c12']}
                  onChange={clickChange}
                  options={envDatas}
                  disabled={isDisabled}
                >
                  {children}
                </Select>
              </Form.Item>

              <div style={{ fontSize: 15, color: '#696969', marginTop: 20 }}>备注：</div>
              <Form.Item name="remark">
                <Input.TextArea placeholder="请输入" style={{ width: 660, height: 220 }}></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ float: 'right' }}>
              <Button
                type="ghost"
                htmlType="reset"
                danger
                onClick={() =>
                  history.push({
                    pathname: 'tmpl-list',
                  })
                }
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" disabled={isDisabled}>
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </PageContainer>
  );
}
