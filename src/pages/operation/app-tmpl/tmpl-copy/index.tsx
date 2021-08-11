// 上下布局页面 应用模版复制页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest, postRequest } from '@/utils/request';
import { useContext, useState, useEffect, useRef } from 'react';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import EditorTable from '@cffe/pc-editor-table';
import { Table, Input, Button, Form, Row, Col, Select, Space } from 'antd';
import './index.less';

export default function DemoPageTb(porps: any) {
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const [tmplConfigurable, setTmplConfigurable] = useState<any[]>([]); //可配置项
  const children: any = [];
  const { TextArea } = Input;
  const [categoryData, setCategoryData] = useState<string>(); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
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
  const tmplDetialResult = (templateCode: string) => {
    getRequest(APIS.tmplList, { data: { templateCode } }).then((res: any) => {
      if (res.success) {
        const tmplresult = res.data.dataSource[0];
        let arr = [];
        for (const key in tmplresult.tmplConfigurableItem) {
          arr.push({
            key: key,
            value: tmplresult.tmplConfigurableItem[key],
          });
        }
        createTmplForm.setFieldsValue({
          templateType: tmplresult.templateType,
          templateName: tmplresult.templateName,
          templateValue: tmplresult.templateValue,
          appCategoryCode: tmplresult.appCategoryCode,
          envCodes: tmplresult.envCode,
          tmplConfigurableItem: arr,
        });
        changeAppCategory(tmplresult.appCategoryCode);
        // let arr = []
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

  // 根据应用分类查询环境
  const changeAppCategory = (categoryCode: string) => {
    //调用接口 查询env 参数就是appCategoryCode
    //setEnvDatas
    //  let categoryCode = categoryData

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
    postRequest(APIS.create, {
      data: {
        templateName: value.templateName,
        templateType: value.templateType,
        templateValue: value.templateValue,
        appCategoryCode: value.appCategoryCode || '',
        envCodes: valArr || [],
        tmplConfigurableItem: tmplConfigurableItem || {},
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
  };

  return (
    <MatrixPageContent className="tmpl-detail">
      <ContentCard>
        <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <Col span={6}>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} options={templateTypes} disabled={isDisabled} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={10}>
              <div style={{ fontSize: 18 }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                {/* <TextArea rows={18} disabled={isDisabled} /> */}
                <AceEditor mode="yaml" height={600} />
              </Form.Item>
            </Col>

            <Col span={10} offset={2}>
              <div style={{ fontSize: 18 }}>可配置项：</div>
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
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '140px' }}
              >
                <Select
                  showSearch
                  style={{ width: 220 }}
                  options={categoryData}
                  onChange={changeAppCategory}
                  disabled={isDisabled}
                />
              </Form.Item>
              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 220 }}
                  placeholder="Please select"
                  // defaultValue={['a10', 'c12']}
                  onChange={clickChange}
                  options={envDatas}
                  disabled={isDisabled}
                >
                  {children}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Button
                type="ghost"
                htmlType="reset"
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
    </MatrixPageContent>
  );
}
